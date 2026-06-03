import { prisma } from '../../../utils/prisma'
import { requireTeacher } from '../../../utils/auth'

type OptionInput = { text?: string; isCorrect?: boolean }
type QuestionInput = { question?: string; options?: OptionInput[] }

// Menyimpan banyak soal sekaligus (dipakai oleh fitur Impor dari Word).
// Hanya soal valid yang disimpan; soal tak valid dilewati dan dilaporkan.
export default defineEventHandler(async (event) => {
  await requireTeacher(event)

  const lessonId = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(lessonId) || lessonId <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Lesson ID tidak valid.' })
  }

  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, select: { id: true } })
  if (!lesson) {
    throw createError({ statusCode: 404, statusMessage: 'Lesson tidak ditemukan.' })
  }

  const body = await readBody<{ questions?: QuestionInput[] }>(event)
  const rawQuestions = Array.isArray(body?.questions) ? body!.questions! : []
  if (rawQuestions.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Tidak ada soal untuk disimpan.' })
  }

  // Validasi & normalisasi. Soal yang gagal validasi dilewati.
  const valid: { question: string; options: { text: string; isCorrect: boolean }[] }[] = []
  let skipped = 0
  for (const q of rawQuestions) {
    const question = q?.question?.trim() ?? ''
    const options = (Array.isArray(q?.options) ? q!.options! : [])
      .map((o) => ({ text: o?.text?.trim() ?? '', isCorrect: o?.isCorrect === true }))
      .filter((o) => o.text.length > 0)
    const correctCount = options.filter((o) => o.isCorrect).length
    if (!question || options.length < 2 || correctCount !== 1) {
      skipped++
      continue
    }
    valid.push({ question, options })
  }

  if (valid.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Tidak ada soal valid untuk disimpan.' })
  }

  // Catatan: TIDAK memakai prisma.$transaction([...]) di sini. Batch transaction
  // lewat driver TiDB serverless gagal di runtime serverless Vercel (500). Sebagai
  // gantinya, tiap soal disimpan dengan quiz.create terpisah (operasi yang sama
  // dengan endpoint tambah-soal satuan yang sudah teruji), dijalankan paralel
  // ber-batch agar tetap cepat tanpa menahan satu transaksi panjang.
  const CHUNK = 5
  let created = 0
  for (let i = 0; i < valid.length; i += CHUNK) {
    const chunk = valid.slice(i, i + CHUNK)
    const results = await Promise.allSettled(
      chunk.map((q) =>
        prisma.quiz.create({
          data: { lessonId, question: q.question, options: { create: q.options } },
          select: { id: true },
        }),
      ),
    )
    for (const r of results) {
      if (r.status === 'fulfilled') {
        created++
      } else {
        skipped++
        console.error('[quizzes-bulk] gagal menyimpan soal:', r.reason)
      }
    }
  }

  if (created === 0) {
    throw createError({ statusCode: 500, statusMessage: 'Gagal menyimpan soal. Coba lagi.' })
  }

  return { created, skipped }
})
