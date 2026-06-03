// Parser teks bank soal pilihan ganda -> daftar soal terstruktur.
//
// Format yang dikenali (per soal):
//   1. Teks pertanyaan (boleh beberapa baris)
//   A. Pilihan A
//   B. Pilihan B
//   C. Pilihan C
//   D. Pilihan D
//   Jawaban: B
//
// - Nomor soal: "1." atau "1)" di awal baris.
// - Pilihan: huruf tunggal "A." / "a)" dst.
// - Kunci jawaban: baris "Jawaban: B" (juga menerima "Kunci", "Kunci Jawaban", "Answer").

export type ParsedOption = { text: string; isCorrect: boolean }
export type ParsedQuestion = {
  question: string
  options: ParsedOption[]
  correctLetter: string | null
  valid: boolean
  issues: string[]
}

const RE_ANSWER = /^\s*(?:jawaban|kunci(?:\s+jawaban)?|answer)\s*[:.\-]?\s*([A-Za-z])\s*$/i
const RE_QUESTION = /^\s*(\d+)\s*[.)]\s*(.*)$/
const RE_OPTION = /^\s*([A-Za-z])\s*[.)]\s*(.*)$/

type Draft = {
  question: string
  options: { letter: string; text: string }[]
  correctLetter: string | null
}

function finalize(d: Draft): ParsedQuestion {
  const issues: string[] = []
  const question = d.question.trim()
  if (!question) issues.push('Pertanyaan kosong.')

  const options = d.options
    .map((o) => ({ letter: o.letter.toUpperCase(), text: o.text.trim() }))
    .filter((o) => o.text.length > 0)

  if (options.length < 2) issues.push('Pilihan jawaban kurang dari 2.')

  const correctLetter = d.correctLetter ? d.correctLetter.toUpperCase() : null
  if (!correctLetter) {
    issues.push('Tidak ada baris "Jawaban:".')
  } else if (!options.some((o) => o.letter === correctLetter)) {
    issues.push(`Kunci jawaban "${correctLetter}" tidak ada di antara pilihan.`)
  }

  return {
    question,
    options: options.map((o) => ({ text: o.text, isCorrect: o.letter === correctLetter })),
    correctLetter,
    valid: issues.length === 0,
    issues,
  }
}

export function parseQuizText(input: string): ParsedQuestion[] {
  const lines = (input ?? '').replace(/\r\n?/g, '\n').split('\n')
  const drafts: Draft[] = []
  let cur: Draft | null = null

  const push = () => {
    if (cur) drafts.push(cur)
    cur = null
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) continue

    const mAnswer = line.match(RE_ANSWER)
    if (mAnswer) {
      if (cur) cur.correctLetter = mAnswer[1]
      continue
    }

    const mQuestion = line.match(RE_QUESTION)
    if (mQuestion) {
      push()
      cur = { question: mQuestion[2] ?? '', options: [], correctLetter: null }
      continue
    }

    const mOption = line.match(RE_OPTION)
    if (mOption && cur) {
      cur.options.push({ letter: mOption[1], text: mOption[2] ?? '' })
      continue
    }

    // Baris lanjutan: sambung ke pilihan terakhir (kalau sudah ada pilihan)
    // atau ke teks pertanyaan.
    if (cur) {
      if (cur.options.length > 0) {
        const last = cur.options[cur.options.length - 1]
        last.text = `${last.text} ${line}`.trim()
      } else {
        cur.question = `${cur.question} ${line}`.trim()
      }
    }
  }
  push()

  return drafts.map(finalize)
}
