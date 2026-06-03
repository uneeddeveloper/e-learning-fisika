import { prisma } from '../../utils/prisma'
import { computeQuizStatus, canWorkOnQuiz } from '../../utils/quizStatus'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Lesson ID tidak valid.' })
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      type: true,
      content: true,
      videoUrl: true,
      order: true,
      allowRetake: true,
      isActive: true,
      deadline: true,
      createdAt: true,
      course: { select: { id: true, title: true } },
    },
  })

  if (!lesson) {
    throw createError({ statusCode: 404, statusMessage: 'Lesson tidak ditemukan.' })
  }

  const quizStatus = lesson.type === 'QUIZ' ? computeQuizStatus(lesson.isActive, lesson.deadline) : null
  const canWork = quizStatus ? canWorkOnQuiz(quizStatus) : false

  return { ...lesson, quizStatus, canWork }
})
