import { prisma } from '../../utils/prisma'
import { requireTeacher } from '../../utils/auth'

const ACTIONS = ['LOGIN', 'LOGIN_FAILED', 'LOGOUT', 'REGISTER', 'USER_CREATE', 'USER_UPDATE', 'USER_DELETE']

export default defineEventHandler(async (event) => {
  await requireTeacher(event)

  const query = getQuery(event)
  const actionFilter = typeof query.action === 'string' ? query.action.toUpperCase() : undefined
  const limitRaw = Number(query.limit)
  const limit = Number.isInteger(limitRaw) && limitRaw > 0 && limitRaw <= 500 ? limitRaw : 100

  const where = actionFilter && ACTIONS.includes(actionFilter) ? { action: actionFilter } : undefined

  const logs = await prisma.activityLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      userId: true,
      actorName: true,
      actorEmail: true,
      action: true,
      detail: true,
      ipAddress: true,
      userAgent: true,
      createdAt: true,
      user: { select: { name: true, email: true, role: true } },
    },
  })

  return logs.map((l) => ({
    id: l.id,
    action: l.action,
    detail: l.detail,
    ipAddress: l.ipAddress,
    userAgent: l.userAgent,
    createdAt: l.createdAt,
    // Pakai data user yang masih ada; fallback ke snapshot actorName/email bila user sudah dihapus.
    actorName: l.user?.name ?? l.actorName,
    actorEmail: l.user?.email ?? l.actorEmail,
    actorRole: l.user?.role ?? null,
  }))
})
