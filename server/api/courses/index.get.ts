import { prisma } from '../../utils/prisma'

export default defineEventHandler(async () => {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: 'asc' },
    include: {
      _count: { select: { lessons: true, enrollments: true } },
    },
  })

  return courses.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    isPublished: c.isPublished,
    lessonCount: c._count.lessons,
    enrollmentCount: c._count.enrollments,
    createdAt: c.createdAt,
  }))
})
