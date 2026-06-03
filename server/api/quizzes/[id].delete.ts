import { prisma } from '../../utils/prisma'
import { requireTeacher } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireTeacher(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Quiz ID tidak valid.' })
  }

  const quiz = await prisma.quiz.findUnique({ where: { id }, select: { id: true } })
  if (!quiz) {
    throw createError({ statusCode: 404, statusMessage: 'Soal tidak ditemukan.' })
  }

  // relationMode = "prisma" tidak melakukan cascade di DB, jadi hapus relasi manual.
  // Dijalankan berurutan (bukan prisma.$transaction([...])) karena batch transaction
  // lewat driver TiDB serverless gagal di runtime serverless Vercel. Urutan anak->induk
  // mencegah baris yatim bila terputus di tengah.
  await prisma.quizResult.deleteMany({ where: { quizId: id } })
  await prisma.option.deleteMany({ where: { quizId: id } })
  await prisma.quiz.delete({ where: { id } })

  return { ok: true }
})
