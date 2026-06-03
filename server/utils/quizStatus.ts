export type QuizStatus = 'open' | 'grace' | 'expired' | 'inactive'

const DAY_MS = 24 * 60 * 60 * 1000

/**
 * Menentukan status quiz dari toggle aktif + deadline.
 * - inactive : dimatikan guru.
 * - open     : aktif & belum lewat deadline (bisa dikerjakan).
 * - grace    : lewat deadline tapi masih < 1 hari (tampil, terkunci).
 * - expired  : lewat deadline + 1 hari (otomatis nonaktif).
 */
export function computeQuizStatus(
  isActive: boolean,
  deadline: Date | string | null,
  now: Date = new Date(),
): QuizStatus {
  if (!isActive) return 'inactive'
  if (!deadline) return 'open'

  const d = new Date(deadline).getTime()
  const t = now.getTime()

  if (t < d) return 'open'
  if (t < d + DAY_MS) return 'grace'
  return 'expired'
}

/** Quiz hanya bisa dikerjakan saat status open. */
export function canWorkOnQuiz(status: QuizStatus): boolean {
  return status === 'open'
}

/** Siswa hanya melihat quiz yang open atau grace. */
export function isVisibleToStudent(status: QuizStatus): boolean {
  return status === 'open' || status === 'grace'
}
