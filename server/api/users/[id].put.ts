import bcrypt from 'bcryptjs'
import { prisma } from '../../utils/prisma'
import { requireTeacher } from '../../utils/auth'
import { logActivity } from '../../utils/activityLog'

const ALLOWED_ROLES = ['STUDENT', 'TEACHER', 'ADMIN'] as const
type Role = (typeof ALLOWED_ROLES)[number]

export default defineEventHandler(async (event) => {
  const actor = await requireTeacher(event)

  const userId = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(userId) || userId <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'User ID tidak valid.' })
  }

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true },
  })
  if (!target) {
    throw createError({ statusCode: 404, statusMessage: 'Pengguna tidak ditemukan.' })
  }

  const body = await readBody<{ name?: string; email?: string; password?: string; role?: string }>(event)

  const data: { name?: string; email?: string; password?: string; role?: Role } = {}
  const changes: string[] = []

  if (typeof body?.name === 'string') {
    const name = body.name.trim()
    if (!name) throw createError({ statusCode: 400, statusMessage: 'Nama tidak boleh kosong.' })
    if (name !== target.name) changes.push('nama')
    data.name = name
  }

  if (typeof body?.email === 'string') {
    const email = body.email.trim().toLowerCase()
    if (!email) throw createError({ statusCode: 400, statusMessage: 'Email tidak boleh kosong.' })
    if (email !== target.email) {
      const dup = await prisma.user.findUnique({ where: { email }, select: { id: true } })
      if (dup && dup.id !== userId) {
        throw createError({ statusCode: 409, statusMessage: 'Email sudah dipakai pengguna lain.' })
      }
      changes.push('email')
      data.email = email
    }
  }

  if (typeof body?.role === 'string') {
    const role = body.role.toUpperCase() as Role
    if (!ALLOWED_ROLES.includes(role)) {
      throw createError({ statusCode: 400, statusMessage: 'Role tidak valid.' })
    }
    // Cegah pengguna menurunkan rolenya sendiri (hindari terkunci dari akses).
    if (userId === actor.id && role !== target.role) {
      throw createError({ statusCode: 400, statusMessage: 'Anda tidak bisa mengubah role akun sendiri.' })
    }
    if (role !== target.role) changes.push(`role ${target.role}→${role}`)
    data.role = role
  }

  if (typeof body?.password === 'string' && body.password.length > 0) {
    if (body.password.length < 8) {
      throw createError({ statusCode: 400, statusMessage: 'Password minimal 8 karakter.' })
    }
    data.password = await bcrypt.hash(body.password, 10)
    changes.push('password')
  }

  if (Object.keys(data).length === 0) {
    return { user: target }
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })

  await logActivity(event, 'USER_UPDATE', {
    actor,
    detail: `Memperbarui pengguna ${user.name} (${user.email}): ${changes.join(', ') || 'tanpa perubahan'}.`,
  })

  return { user }
})
