import type { H3Event } from 'h3'

export async function requireTeacher(event: H3Event) {
  const session = await getUserSession(event)
  const user = session?.user as { id: number; role: string } | undefined

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Belum login.' })
  }
  if (user.role !== 'TEACHER' && user.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Hanya guru yang boleh aksi ini.' })
  }
  return user
}
