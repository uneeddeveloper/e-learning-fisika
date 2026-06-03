import bcrypt from 'bcryptjs'
import { prisma } from '../../utils/prisma'
import { requireTeacher } from '../../utils/auth'
import { logActivity } from '../../utils/activityLog'

const ALLOWED_ROLES = ['STUDENT', 'TEACHER', 'ADMIN'] as const
type Role = (typeof ALLOWED_ROLES)[number]

export default defineEventHandler(async (event) => {
  const actor = await requireTeacher(event)

  const body = await readBody<{ name?: string; email?: string; password?: string; role?: string }>(event)
  const name = body?.name?.trim()
  const email = body?.email?.trim().toLowerCase()
  const password = body?.password ?? ''
  const role = (body?.role ?? 'STUDENT').toUpperCase() as Role

  if (!name || !email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Nama, email, dan password wajib diisi.' })
  }
  if (password.length < 8) {
    throw createError({ statusCode: 400, statusMessage: 'Password minimal 8 karakter.' })
  }
  if (!ALLOWED_ROLES.includes(role)) {
    throw createError({ statusCode: 400, statusMessage: 'Role tidak valid.' })
  }

  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } })
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'Email sudah terdaftar.' })
  }

  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { name, email, password: hashed, role },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })

  await logActivity(event, 'USER_CREATE', {
    actor,
    detail: `Membuat pengguna ${user.name} (${user.email}) dengan role ${user.role}.`,
  })

  return { user }
})
