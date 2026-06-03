import { prisma } from '../../utils/prisma'
import { requireTeacher } from '../../utils/auth'

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

  // relationMode = "prisma" tidak melakukan cascade di DB, jadi hapus relasi manual.
  await prisma.$transaction([
    prisma.quizResult.deleteMany({ where: { quizId: id } }),
    prisma.option.deleteMany({ where: { quizId: id } }),
    prisma.quiz.delete({ where: { id } }),
  ])

  return { ok: true }
})
