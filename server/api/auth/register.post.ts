import bcrypt from 'bcryptjs'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ name?: string; email?: string; password?: string }>(event)

  const name = body?.name?.trim()
  const email = body?.email?.trim().toLowerCase()
  const password = body?.password ?? ''

  if (!name || !email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Nama, email, dan password wajib diisi.' })
  }
  if (password.length < 8) {
    throw createError({ statusCode: 400, statusMessage: 'Password minimal 8 karakter.' })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'Email sudah terdaftar.' })
  }

  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
    select: { id: true, name: true, email: true, role: true },
  })

  await setUserSession(event, { user })

  return { user }
})
