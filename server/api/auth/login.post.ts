import bcrypt from 'bcryptjs'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<{ email?: string; password?: string }>(event)

    const email = body?.email?.trim().toLowerCase()
    const password = body?.password ?? ''

    if (!email || !password) {
      throw createError({ statusCode: 400, statusMessage: 'Email dan password wajib diisi.' })
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, role: true, password: true },
    })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw createError({ statusCode: 401, statusMessage: 'Email atau password salah.' })
    }

    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role }
    await setUserSession(event, { user: safeUser })

    return { user: safeUser }
  } catch (err: any) {
    // DEBUG: surface real error to client temporarily
    if (err?.statusCode) throw err
    console.error('[login] crashed:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'DEBUG: ' + (err?.message ?? String(err)),
      data: {
        name: err?.name,
        message: err?.message,
        stack: err?.stack?.split('\n').slice(0, 8).join('\n'),
      },
    })
  }
})
