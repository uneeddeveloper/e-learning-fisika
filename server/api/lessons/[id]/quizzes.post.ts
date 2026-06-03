import { prisma } from '../../../utils/prisma'
import { requireTeacher } from '../../../utils/auth'

type OptionInput = { text?: string; isCorrect?: boolean }

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

  const quiz = await prisma.quiz.create({
    data: {
      lessonId,
      question,
      options: { create: options },
    },
    select: {
      id: true,
      question: true,
      options: { orderBy: { id: 'asc' }, select: { id: true, text: true, isCorrect: true } },
    },
  })

  return { quiz }
})
