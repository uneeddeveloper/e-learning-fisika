import { prisma } from '../../utils/prisma'
import { requireTeacher } from '../../utils/auth'

type OptionInput = { text?: string; isCorrect?: boolean }

export default defineEventHandler(async (event) => {
  await requireTeacher(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Quiz ID tidak valid.' })
  }

  const quiz = await prisma.quiz.findUnique({ where: { id }, select: { id: true } })
  if (!quiz) {
    throw createError({ statusCode: 404, statusMessage: 'Soal tidak ditemukan.' })
  }

  const body = await readBody<{ question?: string; options?: OptionInput[] }>(event)
  const question = body?.question?.trim()
  const rawOptions = Array.isArray(body?.options) ? body!.options! : []

  if (!question) {
    throw createError({ statusCode: 400, statusMessage: 'Pertanyaan wajib diisi.' })
  }

  const options = rawOptions
    .map((o) => ({ text: o?.text?.trim() ?? '', isCorrect: o?.isCorrect === true }))
    .filter((o) => o.text.length > 0)

  if (options.length < 2) {
    throw createError({ statusCode: 400, statusMessage: 'Minimal 2 pilihan jawaban.' })
  }
  const correctCount = options.filter((o) => o.isCorrect).length
  if (correctCount !== 1) {
    throw createError({ statusCode: 400, statusMessage: 'Tandai tepat satu jawaban benar.' })
  }

  // Ganti seluruh set pilihan. Dijalankan berurutan (bukan batch transaction) agar
  // aman di runtime serverless Vercel. Option tidak punya relasi anak (QuizResult
  // menyimpan quizId, bukan optionId), jadi aman dihapus & dibuat ulang.
  await prisma.quiz.update({ where: { id }, data: { question } })
  await prisma.option.deleteMany({ where: { quizId: id } })
  await prisma.option.createMany({
    data: options.map((o) => ({ quizId: id, text: o.text, isCorrect: o.isCorrect })),
  })

  const updated = await prisma.quiz.findUnique({
    where: { id },
    select: {
      id: true,
      question: true,
      options: { orderBy: { id: 'asc' }, select: { id: true, text: true, isCorrect: true } },
    },
  })

  return { quiz: updated }
})
