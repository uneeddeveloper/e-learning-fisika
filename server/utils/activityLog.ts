import type { H3Event } from 'h3'
import { prisma } from './prisma'

export type ActivityAction =
  | 'LOGIN'
  | 'LOGIN_FAILED'
  | 'LOGOUT'
  | 'REGISTER'
  | 'USER_CREATE'
  | 'USER_UPDATE'
  | 'USER_DELETE'

type Actor = { id?: number | null; name?: string | null; email?: string | null }

/**
 * Mencatat satu aktivitas ke tabel activity_logs.
 * Dibungkus try/catch agar kegagalan logging tidak pernah menggagalkan alur utama.
 */
export async function logActivity(
  event: H3Event,
  action: ActivityAction,
  options: { actor?: Actor; detail?: string } = {},
) {
  try {
    const actor = options.actor
    const ip = getRequestIP(event, { xForwardedFor: true }) ?? null
    const userAgent = getRequestHeader(event, 'user-agent') ?? null

    await prisma.activityLog.create({
      data: {
        userId: actor?.id ?? null,
        actorName: actor?.name ?? null,
        actorEmail: actor?.email ?? null,
        action,
        detail: options.detail ?? null,
        ipAddress: ip,
        userAgent: userAgent ? userAgent.slice(0, 500) : null,
      },
    })
  } catch (err) {
    console.error('[activityLog] gagal mencatat aktivitas:', err)
  }
}
