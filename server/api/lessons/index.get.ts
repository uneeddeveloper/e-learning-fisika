import { prisma } from '../../utils/prisma'

export default defineEventHandler(async () => {
  const lessons = await prisma.lesson.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: {
      id: true,
      title: true,
      type: true,
      videoUrl: true,
      content: true,
      order: true,
      createdAt: true,
    },
  })
  return lessons
})
