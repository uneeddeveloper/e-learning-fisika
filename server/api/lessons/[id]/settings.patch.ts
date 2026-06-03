import { prisma } from '../../../utils/prisma'
import { requireTeacher } from '../../../utils/auth'

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

  const body = await readBody<{ isActive?: boolean; deadline?: string | null; allowRetake?: boolean }>(event)

  const data: { isActive?: boolean; deadline?: Date | null; allowRetake?: boolean } = {}

  if (typeof body?.isActive === 'boolean') data.isActive = body.isActive
  if (typeof body?.allowRetake === 'boolean') data.allowRetake = body.allowRetake

  if ('deadline' in (body ?? {})) {
    if (body.deadline === null || body.deadline === '') {
      data.deadline = null
    } else {
      const d = new Date(body.deadline as string)
      if (Number.isNaN(d.getTime())) {
        throw createError({ statusCode: 400, statusMessage: 'Format deadline tidak valid.' })
      }
      data.deadline = d
    }
  }

  if (Object.keys(data).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Tidak ada perubahan.' })
  }

  const updated = await prisma.lesson.update({
    where: { id },
    data,
    select: { id: true, isActive: true, deadline: true, allowRetake: true },
  })

  return { lesson: updated }
})
