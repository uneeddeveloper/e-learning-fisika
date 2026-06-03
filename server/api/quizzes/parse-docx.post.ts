import mammoth from 'mammoth'
import { requireTeacher } from '../../utils/auth'
import { parseQuizText } from '../../utils/parseQuizText'

// Menerima upload file .docx, mengekstrak teks, lalu mengurai jadi daftar soal
// untuk pratinjau. TIDAK menyimpan apa pun ke database.
export default defineEventHandler(async (event) => {
  await requireTeacher(event)

  const parts = await readMultipartFormData(event)
  const file = parts?.find((p) => p.name === 'file' && p.filename)
  if (!file || !file.data?.length) {
    throw createError({ statusCode: 400, statusMessage: 'File tidak ditemukan.' })
  }

  const name = (file.filename ?? '').toLowerCase()
  if (!name.endsWith('.docx')) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Format harus .docx (Word). File .doc lama tidak didukung — simpan ulang sebagai .docx.',
    })
  }

  let text = ''
  try {
    const result = await mammoth.extractRawText({ buffer: file.data })
    text = result.value ?? ''
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Gagal membaca file Word. Pastikan file tidak rusak.' })
  }

  const questions = parseQuizText(text)
  const validCount = questions.filter((q) => q.valid).length

  return {
    total: questions.length,
    validCount,
    questions,
  }
})
