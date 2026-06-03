import { prisma } from '../../utils/prisma'
import { requireTeacher } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireTeacher(event)

  const query = getQuery(event)
  const slug = typeof query.slug === 'string' && query.slug.trim() ? query.slug.trim() : undefined

  const submissions = await prisma.labSubmission.findMany({
    where: slug ? { labSlug: slug } : undefined,
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      labSlug: true,
      labTitle: true,
      answers: true,
      submittedAt: true,
      updatedAt: true,
      user: { select: { id: true, name: true, email: true } },
    },
  })

  // Ringkasan per lab (untuk halaman daftar guru).
  const summaryMap = new Map<string, { labSlug: string; labTitle: string; count: number; lastAt: Date }>()
  for (const s of submissions) {
    const cur = summaryMap.get(s.labSlug)
    if (!cur) {
      summaryMap.set(s.labSlug, { labSlug: s.labSlug, labTitle: s.labTitle, count: 1, lastAt: s.updatedAt })
    } else {
      cur.count += 1
      if (s.updatedAt > cur.lastAt) cur.lastAt = s.updatedAt
    }
  }
  const summary = Array.from(summaryMap.values()).sort((a, b) => b.lastAt.getTime() - a.lastAt.getTime())

  return { summary, submissions }
})
