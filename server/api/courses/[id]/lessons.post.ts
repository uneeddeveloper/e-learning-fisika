import { prisma } from '../../../utils/prisma'
import { requireTeacher } from '../../../utils/auth'

const ALLOWED_TYPES = ['VIDEO', 'READING', 'QUIZ'] as const
type LessonType = (typeof ALLOWED_TYPES)[number]

export default defineEventHandler(async (event) => {
  await requireTeacher(event)

  const courseId = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(courseId) || courseId <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Course ID tidak valid.' })
  }

  const body = await readBody<{ title?: string; content?: string; videoUrl?: string; type?: LessonType }>(event)
  const title = body?.title?.trim()
  const type = (body?.type ?? 'READING') as LessonType
  const content = body?.content?.trim() || null
  const videoUrl = body?.videoUrl?.trim() || null

  if (!title) {
    throw createError({ statusCode: 400, statusMessage: 'Judul wajib diisi.' })
  }
  if (!ALLOWED_TYPES.includes(type)) {
    throw createError({ statusCode: 400, statusMessage: 'Tipe lesson tidak valid.' })
  }

  const course = await prisma.course.findUnique({ where: { id: courseId }, select: { id: true } })
  if (!course) {
    throw createError({ statusCode: 404, statusMessage: 'Course tidak ditemukan.' })
  }

  const lastLesson = await prisma.lesson.findFirst({
    where: { courseId },
    orderBy: { order: 'desc' },
    select: { order: true },
  })
  const nextOrder = (lastLesson?.order ?? 0) + 1

  const lesson = await prisma.lesson.create({
    data: { courseId, title, content, videoUrl, type, order: nextOrder },
  })

  return { lesson }
})
