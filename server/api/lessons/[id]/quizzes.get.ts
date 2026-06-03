import { prisma } from '../../../utils/prisma'
import { computeQuizStatus, canWorkOnQuiz } from '../../../utils/quizStatus'

export default defineEventHandler(async (event) => {
  const lessonId = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(lessonId) || lessonId <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Lesson ID tidak valid.' })
  }

  const session = await getUserSession(event)
  const user = session?.user as { id: number; role: string } | undefined
  const isTeacher = user?.role === 'TEACHER' || user?.role === 'ADMIN'

  const lessonRow = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { id: true, title: true, type: true, allowRetake: true, isActive: true, deadline: true },
  })
  if (!lessonRow) {
    throw createError({ statusCode: 404, statusMessage: 'Lesson tidak ditemukan.' })
  }

  const status = computeQuizStatus(lessonRow.isActive, lessonRow.deadline)
  const canWork = canWorkOnQuiz(status)
  const lesson = { ...lessonRow, status, canWork }

  // Siswa tidak boleh membuka quiz yang sudah nonaktif/kedaluwarsa.
  if (!isTeacher && (status === 'inactive' || status === 'expired')) {
    throw createError({ statusCode: 403, statusMessage: 'Latihan ini sedang tidak aktif.' })
  }

  const quizzes = await prisma.quiz.findMany({
    where: { lessonId },
    orderBy: { id: 'asc' },
    select: {
      id: true,
      question: true,
      options: {
        orderBy: { id: 'asc' },
        select: {
          id: true,
          text: true,
          // Kunci jawaban hanya dibuka untuk guru.
          isCorrect: isTeacher,
        },
      },
    },
  })

  // Status pengerjaan siswa (untuk mengunci Tes & menampilkan nilai terakhir).
  let myResult: { submitted: boolean; score: number; correct: number; total: number } | null = null
  if (user && !isTeacher && quizzes.length > 0) {
    const quizIds = quizzes.map((q) => q.id)
    const myResults = await prisma.quizResult.findMany({
      where: { userId: user.id, quizId: { in: quizIds } },
      select: { isCorrect: true },
    })
    if (myResults.length > 0) {
      const correct = myResults.filter((r) => r.isCorrect).length
      const total = quizzes.length
      myResult = {
        submitted: true,
        correct,
        total,
        score: Math.round((correct / total) * 100),
      }
    }
  }

  return { lesson, quizzes, myResult }
})
