import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const typeFilter = typeof query.type === 'string' ? query.type.toUpperCase() : undefined
  const where = typeFilter === 'QUIZ' || typeFilter === 'VIDEO' || typeFilter === 'READING'
    ? { type: typeFilter as 'QUIZ' | 'VIDEO' | 'READING' }
    : undefined

  const lessons = await prisma.lesson.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true,
      title: true,
      type: true,
      videoUrl: true,
      content: true,
      order: true,
      allowRetake: true,
      createdAt: true,
      _count: { select: { quizzes: true } },
    },
  })

  // Untuk daftar latihan: hitung berapa siswa unik yang sudah mengerjakan tiap lesson.
  if (typeFilter === 'QUIZ') {
    const lessonIds = lessons.map((l) => l.id)
    const quizzes = lessonIds.length
      ? await prisma.quiz.findMany({
          where: { lessonId: { in: lessonIds } },
          select: { id: true, lessonId: true },
        })
      : []

    const quizToLesson = new Map(quizzes.map((q) => [q.id, q.lessonId]))
    const quizIds = quizzes.map((q) => q.id)

    const results = quizIds.length
      ? await prisma.quizResult.findMany({
          where: { quizId: { in: quizIds } },
          select: { userId: true, quizId: true },
        })
      : []

    // Set userId unik per lesson.
    const studentsPerLesson = new Map<number, Set<number>>()
    for (const r of results) {
      const lessonId = quizToLesson.get(r.quizId)
      if (lessonId == null) continue
      if (!studentsPerLesson.has(lessonId)) studentsPerLesson.set(lessonId, new Set())
      studentsPerLesson.get(lessonId)!.add(r.userId)
    }

    return lessons.map((l) => ({
      ...l,
      questionCount: l._count.quizzes,
      studentCount: studentsPerLesson.get(l.id)?.size ?? 0,
      _count: undefined,
    }))
  }

  return lessons.map((l) => ({ ...l, questionCount: l._count.quizzes, _count: undefined }))
})
