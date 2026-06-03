import { prisma } from '../../../utils/prisma'
import { requireUser } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)

  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug lab tidak valid.' })
  }

  const submission = await prisma.labSubmission.findUnique({
    where: { userId_labSlug: { userId: user.id, labSlug: slug } },
    select: { answers: true, submittedAt: true, updatedAt: true },
  })

  return { submission }
})
