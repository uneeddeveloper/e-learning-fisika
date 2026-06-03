import { prisma } from '../../../utils/prisma'
import { requireUser } from '../../../utils/auth'

type Answer = { questionId: string; prompt: string; answer: string }

type Row = {
  answers: string
  submittedAt: Date
  updatedAt: Date
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
  const user = await requireUser(event)

  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug lab tidak valid.' })
  }

  // Kolom JSON `answers` dibaca via CAST ke CHAR lalu di-parse manual — lihat catatan
  // di server/api/labs/submissions.get.ts (driver TiDB serverless + Prisma double parse).
  const rows = await prisma.$queryRaw<Row[]>`
    SELECT CAST(answers AS CHAR) AS answers, submittedAt, updatedAt
    FROM lab_submissions
    WHERE userId = ${user.id} AND labSlug = ${slug}
    LIMIT 1`

  const row = rows[0]
  const submission = row
    ? { answers: parseAnswers(row.answers), submittedAt: row.submittedAt, updatedAt: row.updatedAt }
    : null

  return { submission }
})
