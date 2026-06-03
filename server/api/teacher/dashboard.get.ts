import { prisma } from '../../utils/prisma'
import { requireTeacher } from '../../utils/auth'

const DAY_MS = 24 * 60 * 60 * 1000

type Notification = {
  id: string
  type: 'worksheet' | 'quiz' | 'register' | 'security'
  title: string
  detail: string | null
  time: Date
  link: string
}

export default defineEventHandler(async (event) => {
  await requireTeacher(event)

  // —— Rentang 7 hari terakhir (mulai dari awal hari, 6 hari lalu) ——
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const weekStart = new Date(startOfToday.getTime() - 6 * DAY_MS)

  const [
    students,
    materi,
    quizzes,
    labSubmissions,
    recentStudents,
    labSubs,
    newStudents,
    failedLogins,
    recentResults,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.lesson.count({ where: { type: { in: ['VIDEO', 'READING'] } } }),
    prisma.lesson.count({ where: { type: 'QUIZ' } }),
    prisma.labSubmission.count(),
    prisma.user.findMany({
      where: { role: 'STUDENT', createdAt: { gte: weekStart } },
      select: { createdAt: true },
    }),
    prisma.labSubmission.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 10,
      select: { id: true, labSlug: true, labTitle: true, updatedAt: true, user: { select: { name: true } } },
    }),
    prisma.user.findMany({
      where: { role: 'STUDENT' },
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: { id: true, name: true, createdAt: true },
    }),
    prisma.activityLog.findMany({
      where: { action: 'LOGIN_FAILED' },
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: { id: true, actorEmail: true, ipAddress: true, createdAt: true },
    }),
    prisma.quizResult.findMany({
      orderBy: { answeredAt: 'desc' },
      take: 150,
      select: {
        userId: true,
        answeredAt: true,
        quiz: { select: { lessonId: true, lesson: { select: { title: true } } } },
        user: { select: { name: true } },
      },
    }),
  ])

  // —— Tren pendaftaran siswa per hari (7 angka, lama → baru) untuk sparkline ——
  const studentTrend = Array.from({ length: 7 }, () => 0)
  for (const u of recentStudents) {
    const d = new Date(u.createdAt)
    d.setHours(0, 0, 0, 0)
    const idx = Math.round((d.getTime() - weekStart.getTime()) / DAY_MS)
    if (idx >= 0 && idx < 7) studentTrend[idx] = (studentTrend[idx] ?? 0) + 1
  }
  const studentsNew7d = recentStudents.length

  // —— Kelompokkan hasil kuis terbaru per (siswa, lesson) → satu notifikasi "selesai" ——
  const quizSeen = new Set<string>()
  const labSubs7d = labSubs.filter((s) => new Date(s.updatedAt).getTime() >= weekStart.getTime()).length

  const notifications: Notification[] = []

  for (const s of labSubs) {
    notifications.push({
      id: `lab-${s.id}`,
      type: 'worksheet',
      title: `${s.user.name} mengirim worksheet`,
      detail: s.labTitle,
      time: s.updatedAt,
      link: `/teacher/worksheet/${s.labSlug}`,
    })
  }

  for (const r of recentResults) {
    const lessonId = r.quiz?.lessonId
    if (lessonId == null) continue
    const key = `${r.userId}-${lessonId}`
    if (quizSeen.has(key)) continue
    quizSeen.add(key)
    notifications.push({
      id: `quiz-${key}`,
      type: 'quiz',
      title: `${r.user.name} menyelesaikan latihan`,
      detail: r.quiz?.lesson?.title ?? 'Latihan',
      time: r.answeredAt,
      link: `/teacher/latihan/${lessonId}`,
    })
  }

  for (const u of newStudents) {
    notifications.push({
      id: `reg-${u.id}`,
      type: 'register',
      title: `${u.name} bergabung sebagai siswa`,
      detail: null,
      time: u.createdAt,
      link: '/teacher/pengguna',
    })
  }

  for (const f of failedLogins) {
    notifications.push({
      id: `sec-${f.id}`,
      type: 'security',
      title: 'Percobaan login gagal',
      detail: [f.actorEmail, f.ipAddress].filter(Boolean).join(' · ') || null,
      time: f.createdAt,
      link: '/teacher/aktivitas',
    })
  }

  notifications.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

  return {
    stats: {
      students,
      studentsNew7d,
      studentTrend,
      materi,
      quizzes,
      labSubmissions,
      labSubmissions7d: labSubs7d,
    },
    notifications: notifications.slice(0, 15),
  }
})
