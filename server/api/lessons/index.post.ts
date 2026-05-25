import { prisma } from '../../utils/prisma'
import { requireTeacher } from '../../utils/auth'

const ALLOWED_TYPES = ['VIDEO', 'READING', 'QUIZ'] as const
type LessonType = (typeof ALLOWED_TYPES)[number]

async function getOrCreateDefaultCourse() {
  const first = await prisma.course.findFirst({ orderBy: { id: 'asc' }, select: { id: true } })
  if (first) return first.id

  const created = await prisma.course.create({
    data: {
      title: 'Fisika',
      description: 'Mata pelajaran Fisika — kumpulan materi pembelajaran.',
      isPublished: true,
    },
    select: { id: true },
  })
  return created.id
}

export default defineEventHandler(async (event) => {
  await requireTeacher(event)

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

  const courseId = await getOrCreateDefaultCourse()

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
