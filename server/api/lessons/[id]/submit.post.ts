import { prisma } from '../../../utils/prisma'
import { requireUser } from '../../../utils/auth'

type AnswerInput = { quizId?: number; optionId?: number }

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)

  const lessonId = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(lessonId) || lessonId <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Lesson ID tidak valid.' })
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { id: true, allowRetake: true },
  })
  if (!lesson) {
    throw createError({ statusCode: 404, statusMessage: 'Lesson tidak ditemukan.' })
  }

  const quizzes = await prisma.quiz.findMany({
    where: { lessonId },
    select: { id: true, options: { select: { id: true, isCorrect: true } } },
  })
  if (quizzes.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Latihan ini belum punya soal.' })
  }

  const quizIds = quizzes.map((q) => q.id)

  // Cek apakah siswa sudah pernah mengerjakan.
  const existing = await prisma.quizResult.findMany({
    where: { userId: user.id, quizId: { in: quizIds } },
    select: { id: true },
  })
  if (existing.length > 0 && !lesson.allowRetake) {
    throw createError({ statusCode: 409, statusMessage: 'Tes hanya boleh dikerjakan satu kali.' })
  }

  const body = await readBody<{ answers?: AnswerInput[] }>(event)
  const answers = Array.isArray(body?.answers) ? body!.answers! : []
  const answerMap = new Map<number, number>()
  for (const a of answers) {
    if (Number.isInteger(a?.quizId) && Number.isInteger(a?.optionId)) {
      answerMap.set(a!.quizId!, a!.optionId!)
    }
  }

  // Nilai tiap soal: benar jika opsi terpilih adalah opsi dengan isCorrect.
  const resultRows = quizzes.map((q) => {
    const chosenOptionId = answerMap.get(q.id)
    const correctOption = q.options.find((o) => o.isCorrect)
    const isCorrect = chosenOptionId != null && correctOption?.id === chosenOptionId
    return { userId: user.id, quizId: q.id, isCorrect }
  })

  const correct = resultRows.filter((r) => r.isCorrect).length
  const total = quizzes.length
  const score = Math.round((correct / total) * 100)

  // Simpan: untuk Latihan (boleh ulang) timpa hasil lama, agar nilai = pengerjaan terakhir.
  await prisma.$transaction([
    ...(existing.length > 0
      ? [prisma.quizResult.deleteMany({ where: { userId: user.id, quizId: { in: quizIds } } })]
      : []),
    prisma.quizResult.createMany({ data: resultRows }),
  ])

  return { score, correct, total }
})
