import { prisma } from '../../utils/prisma'
import { requireTeacher } from '../../utils/auth'

const ALLOWED_TYPES = ['VIDEO', 'READING', 'QUIZ'] as const
type LessonType = (typeof ALLOWED_TYPES)[number]

export default defineEventHandler(async (event) => {
  await requireTeacher(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Lesson ID tidak valid.' })
  }

  const existing = await prisma.lesson.findUnique({ where: { id }, select: { id: true } })
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Materi tidak ditemukan.' })
  }

  const body = await readBody<{ title?: string; content?: string; videoUrl?: string; type?: LessonType; allowRetake?: boolean }>(event)
  const title = body?.title?.trim()
  const type = (body?.type ?? 'READING') as LessonType
  const content = body?.content?.trim() || null
  const videoUrl = body?.videoUrl?.trim() || null
  const allowRetake = body?.allowRetake !== false

  if (!title) {
    throw createError({ statusCode: 400, statusMessage: 'Judul wajib diisi.' })
  }
  if (!ALLOWED_TYPES.includes(type)) {
    throw createError({ statusCode: 400, statusMessage: 'Tipe materi tidak valid.' })
  }

  const lesson = await prisma.lesson.update({
    where: { id },
    data: { title, content, videoUrl, type, allowRetake },
  })

  return { lesson }
})
