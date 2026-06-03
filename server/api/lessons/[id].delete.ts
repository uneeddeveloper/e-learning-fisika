import { prisma } from '../../utils/prisma'
import { requireTeacher } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireTeacher(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Lesson ID tidak valid.' })
  }

  const lesson = await prisma.lesson.findUnique({ where: { id }, select: { id: true } })
  if (!lesson) {
    throw createError({ statusCode: 404, statusMessage: 'Materi tidak ditemukan.' })
  }

  // relationMode = "prisma" tidak cascade di DB, jadi hapus relasi manual.
  const quizzes = await prisma.quiz.findMany({ where: { lessonId: id }, select: { id: true } })
  const quizIds = quizzes.map((q) => q.id)

  await prisma.$transaction([
    ...(quizIds.length
      ? [
          prisma.quizResult.deleteMany({ where: { quizId: { in: quizIds } } }),
          prisma.option.deleteMany({ where: { quizId: { in: quizIds } } }),
          prisma.quiz.deleteMany({ where: { lessonId: id } }),
        ]
      : []),
    prisma.lesson.delete({ where: { id } }),
  ])

  return { ok: true }
})
