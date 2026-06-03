import { prisma } from '../../utils/prisma'
import { requireTeacher } from '../../utils/auth'

type Answer = { questionId: string; prompt: string; answer: string }

type Row = {
  id: number
  labSlug: string
  labTitle: string
  answers: string
  submittedAt: Date
  updatedAt: Date
  userId: number
  userName: string
  userEmail: string
}

function parseAnswers(raw: string): Answer[] {
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default defineEventHandler(async (event) => {
  await requireTeacher(event)

  const query = getQuery(event)
  const slug = typeof query.slug === 'string' && query.slug.trim() ? query.slug.trim() : undefined

  // Kolom JSON `answers` dibaca via CAST ke CHAR lalu di-parse manual.
  // Driver TiDB serverless mengembalikan kolom JSON dalam keadaan sudah ter-parse,
  // sehingga Prisma client gagal men-deserialize-nya (double parse -> "[object Object]").
  // Raw query dengan CAST AS CHAR menghindari masalah tersebut.
  const rows = slug
    ? await prisma.$queryRaw<Row[]>`
        SELECT s.id, s.labSlug, s.labTitle, CAST(s.answers AS CHAR) AS answers,
               s.submittedAt, s.updatedAt,
               u.id AS userId, u.name AS userName, u.email AS userEmail
        FROM lab_submissions s JOIN users u ON u.id = s.userId
        WHERE s.labSlug = ${slug}
        ORDER BY s.updatedAt DESC`
    : await prisma.$queryRaw<Row[]>`
        SELECT s.id, s.labSlug, s.labTitle, CAST(s.answers AS CHAR) AS answers,
               s.submittedAt, s.updatedAt,
               u.id AS userId, u.name AS userName, u.email AS userEmail
        FROM lab_submissions s JOIN users u ON u.id = s.userId
        ORDER BY s.updatedAt DESC`

  const submissions = rows.map((r) => ({
    id: Number(r.id),
    labSlug: r.labSlug,
    labTitle: r.labTitle,
    answers: parseAnswers(r.answers),
    submittedAt: r.submittedAt,
    updatedAt: r.updatedAt,
    user: { id: Number(r.userId), name: r.userName, email: r.userEmail },
  }))

  // Ringkasan per lab (untuk halaman daftar guru).
  const summaryMap = new Map<string, { labSlug: string; labTitle: string; count: number; lastAt: Date }>()
  for (const s of submissions) {
    const updatedAt = new Date(s.updatedAt)
    const cur = summaryMap.get(s.labSlug)
    if (!cur) {
      summaryMap.set(s.labSlug, { labSlug: s.labSlug, labTitle: s.labTitle, count: 1, lastAt: updatedAt })
    } else {
      cur.count += 1
      if (updatedAt > cur.lastAt) cur.lastAt = updatedAt
    }
  }
  const summary = Array.from(summaryMap.values()).sort((a, b) => b.lastAt.getTime() - a.lastAt.getTime())

  return { summary, submissions }
})
