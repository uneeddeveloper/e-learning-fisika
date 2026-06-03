import { prisma } from '../../utils/prisma'
import { requireTeacher } from '../../utils/auth'
import { logActivity } from '../../utils/activityLog'

export default defineEventHandler(async (event) => {
  const actor = await requireTeacher(event)

  const userId = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(userId) || userId <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'User ID tidak valid.' })
  }

  if (userId === actor.id) {
    throw createError({ statusCode: 400, statusMessage: 'Anda tidak bisa menghapus akun sendiri.' })
  }

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true },
  })
  if (!target) {
    throw createError({ statusCode: 404, statusMessage: 'Pengguna tidak ditemukan.' })
  }

  await prisma.user.delete({ where: { id: userId } })

  await logActivity(event, 'USER_DELETE', {
    actor,
    detail: `Menghapus pengguna ${target.name} (${target.email}), role ${target.role}.`,
  })

  return { ok: true }
})
