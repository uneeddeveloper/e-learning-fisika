import { prisma } from '../../../utils/prisma'
import { requireTeacher } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireTeacher(event)

  const lessonId = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(lessonId) || lessonId <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Lesson ID tidak valid.' })
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { id: true, title: true, allowRetake: true },
  })
  if (!lesson) {
    throw createError({ statusCode: 404, statusMessage: 'Lesson tidak ditemukan.' })
  }

  const quizzes = await prisma.quiz.findMany({ where: { lessonId }, select: { id: true } })
  const quizIds = quizzes.map((q) => q.id)
  const total = quizIds.length

  if (total === 0) {
    return { lesson, total: 0, students: [] }
  }

  const results = await prisma.quizResult.findMany({
    where: { quizId: { in: quizIds } },
    select: {
      userId: true,
      isCorrect: true,
      answeredAt: true,
      user: { select: { id: true, name: true, email: true } },
    },
  })

  // Kelompokkan per siswa: hitung benar & ambil waktu pengerjaan terakhir.
  type Acc = { user: { id: number; name: string; email: string }; correct: number; answeredAt: Date }
  const byUser = new Map<number, Acc>()
  for (const r of results) {
    const cur = byUser.get(r.userId)
    if (!cur) {
      byUser.set(r.userId, { user: r.user, correct: r.isCorrect ? 1 : 0, answeredAt: r.answeredAt })
    } else {
      cur.correct += r.isCorrect ? 1 : 0
      if (r.answeredAt > cur.answeredAt) cur.answeredAt = r.answeredAt
    }
  }

  const students = Array.from(byUser.values())
    .map((a) => ({
      id: a.user.id,
      name: a.user.name,
      email: a.user.email,
      correct: a.correct,
      total,
      score: Math.round((a.correct / total) * 100),
      answeredAt: a.answeredAt,
    }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))

  return { lesson, total, students }
})
