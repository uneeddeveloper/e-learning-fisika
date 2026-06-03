import { prisma } from '../../../utils/prisma'
import { requireUser } from '../../../utils/auth'

type AnswerInput = { questionId?: string; prompt?: string; answer?: string }

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)

  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug lab tidak valid.' })
  }

  const body = await readBody<{ labTitle?: string; answers?: AnswerInput[] }>(event)
  const labTitle = body?.labTitle?.trim() || slug
  const rawAnswers = Array.isArray(body?.answers) ? body!.answers! : []

  const answers = rawAnswers
    .map((a) => ({
      questionId: String(a?.questionId ?? '').trim(),
      prompt: String(a?.prompt ?? '').trim(),
      answer: String(a?.answer ?? '').trim(),
    }))
    .filter((a) => a.questionId.length > 0)

  if (answers.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Worksheet masih kosong.' })
  }

  // Upsert: satu submission per siswa per lab. Mengisi ulang akan memperbarui jawaban.
  const submission = await prisma.labSubmission.upsert({
    where: { userId_labSlug: { userId: user.id, labSlug: slug } },
    create: { userId: user.id, labSlug: slug, labTitle, answers },
    update: { labTitle, answers },
    select: { id: true, submittedAt: true, updatedAt: true },
  })

  return { ok: true, submission }
})
