import { prisma } from '../../utils/prisma'
import { requireTeacher } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireTeacher(event)

  const query = getQuery(event)
  const roleFilter = typeof query.role === 'string' ? query.role.toUpperCase() : undefined
  const search = typeof query.q === 'string' ? query.q.trim() : ''

  const where: Record<string, unknown> = {}
  if (roleFilter === 'STUDENT' || roleFilter === 'TEACHER' || roleFilter === 'ADMIN') {
    where.role = roleFilter
  }
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
    ]
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { quizResults: true, labSubmissions: true } },
    },
  })

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt,
    quizResultCount: u._count.quizResults,
    labSubmissionCount: u._count.labSubmissions,
  }))
})
