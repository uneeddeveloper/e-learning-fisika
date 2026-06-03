import { logActivity } from '../../utils/activityLog'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const user = session?.user as { id?: number; name?: string; email?: string } | undefined

  if (user) {
    await logActivity(event, 'LOGOUT', {
      actor: { id: user.id, name: user.name, email: user.email },
      detail: `${user.name ?? 'Pengguna'} keluar.`,
    })
  }

  await clearUserSession(event)
  return { ok: true }
})
