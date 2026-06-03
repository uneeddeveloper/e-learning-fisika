import { prisma } from '../../utils/prisma'
import { computeQuizStatus, isVisibleToStudent } from '../../utils/quizStatus'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const typeFilter = typeof query.type === 'string' ? query.type.toUpperCase() : undefined
  const where = typeFilter === 'QUIZ' || typeFilter === 'VIDEO' || typeFilter === 'READING'
    ? { type: typeFilter as 'QUIZ' | 'VIDEO' | 'READING' }
    : undefined

  const session = await getUserSession(event)
  const role = (session?.user as { role?: string } | undefined)?.role
  const isTeacher = role === 'TEACHER' || role === 'ADMIN'

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
      isActive: true,
      deadline: true,
      createdAt: true,
      _count: { select: { quizzes: true } },
    },
  })

  // Lampirkan status untuk lesson QUIZ.
  const withStatus = lessons.map((l) => ({
    ...l,
    questionCount: l._count.quizzes,
    quizStatus: l.type === 'QUIZ' ? computeQuizStatus(l.isActive, l.deadline) : null,
    _count: undefined,
  }))

  // Untuk daftar latihan (guru): hitung jumlah siswa unik yang sudah mengerjakan.
  if (typeFilter === 'QUIZ') {
    const lessonIds = withStatus.map((l) => l.id)
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

    const studentsPerLesson = new Map<number, Set<number>>()
    for (const r of results) {
      const lessonId = quizToLesson.get(r.quizId)
      if (lessonId == null) continue
      if (!studentsPerLesson.has(lessonId)) studentsPerLesson.set(lessonId, new Set())
      studentsPerLesson.get(lessonId)!.add(r.userId)
    }

    return withStatus.map((l) => ({ ...l, studentCount: studentsPerLesson.get(l.id)?.size ?? 0 }))
  }

  // Siswa tidak melihat quiz yang nonaktif/kedaluwarsa.
  const visible = isTeacher
    ? withStatus
    : withStatus.filter((l) => l.type !== 'QUIZ' || (l.quizStatus != null && isVisibleToStudent(l.quizStatus)))

  return visible
})
