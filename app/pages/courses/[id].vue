<template>
  <div v-if="lesson">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div class="min-w-0">
        <NuxtLink
          to="/courses"
          class="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-300 transition-colors hover:bg-white/6"
        >
          <ArrowLeft class="h-4 w-4" />
          Kembali ke materi
        </NuxtLink>

        <p class="mt-4 text-xs font-semibold tracking-wide text-zinc-500">
          {{ typeLabel(lesson.type) }} · {{ formatDate(lesson.createdAt) }}
        </p>
        <h1 class="mt-1 text-2xl font-extrabold tracking-tight text-zinc-50">
          {{ lesson.title }}
        </h1>
      </div>
    </div>

    <div class="mt-6 grid gap-4 lg:grid-cols-12">
      <!-- Main content -->
      <div class="lg:col-span-8">
        <GlassCard class="p-6">
          <!-- VIDEO -->
          <div v-if="lesson.type === 'VIDEO'">
            <div v-if="youtubeEmbedId" class="overflow-hidden rounded-2xl border border-white/10 bg-black/60">
              <iframe
                :src="`https://www.youtube.com/embed/${youtubeEmbedId}`"
                class="aspect-video w-full"
                frameborder="0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              />
            </div>
            <div v-else-if="lesson.videoUrl" class="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
              <p class="text-sm font-semibold text-amber-200">Format video tidak didukung untuk preview.</p>
              <a
                :href="lesson.videoUrl"
                target="_blank"
                rel="noopener"
                class="mt-1 inline-block text-xs text-amber-100 underline"
              >Buka link asli</a>
            </div>
            <div v-else class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-500">
              Tidak ada URL video.
            </div>
          </div>

          <!-- READING -->
          <div v-else-if="lesson.type === 'READING'">
            <div class="prose prose-invert max-w-none">
              <p v-if="lesson.content" class="whitespace-pre-wrap text-sm leading-relaxed text-zinc-200">
                {{ lesson.content }}
              </p>
              <p v-else class="text-sm text-zinc-500">Konten kosong.</p>
            </div>
          </div>

          <!-- QUIZ -->
          <div v-else-if="lesson.type === 'QUIZ'">
            <div class="mb-4 flex flex-wrap items-center gap-2">
              <span
                class="rounded-full border px-2.5 py-0.5 text-[11px] font-semibold"
                :class="lesson.allowRetake
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                  : 'border-amber-500/30 bg-amber-500/10 text-amber-300'"
              >
                {{ lesson.allowRetake ? 'Latihan · boleh diulang' : 'Tes · sekali kerjakan' }}
              </span>
              <span
                v-if="lesson.deadline"
                class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold"
                :class="lesson.canWork
                  ? 'border-white/10 bg-white/5 text-zinc-300'
                  : 'border-rose-500/30 bg-rose-500/10 text-rose-300'"
              >
                <Clock class="h-3 w-3" />
                Deadline: {{ formatDateTime(lesson.deadline) }}
              </span>
            </div>

            <div
              v-if="lesson.quizStatus === 'expired' || lesson.quizStatus === 'inactive'"
              class="rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
            >
              <p class="text-sm font-bold text-zinc-200">Latihan tidak aktif</p>
              <p class="mt-1 text-sm text-zinc-500">Latihan ini sedang tidak tersedia.</p>
            </div>

            <p v-else-if="quizPending" class="text-sm text-zinc-500">Memuat soal...</p>

            <div v-else-if="!quizzes.length" class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p class="text-sm text-zinc-500">Belum ada soal pada latihan ini.</p>
            </div>

            <!-- Hasil setelah submit / sudah pernah dikerjakan -->
            <div v-else-if="finished" class="space-y-4">
              <div class="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
                <p class="text-xs font-semibold uppercase tracking-wide text-zinc-500">Nilai kamu</p>
                <p class="mt-2 text-5xl font-extrabold tracking-tight" :class="scoreColor(resultScore)">
                  {{ resultScore }}
                </p>
                <p class="mt-1 text-sm text-zinc-400">{{ resultCorrect }} benar dari {{ resultTotal }} soal</p>

                <div class="mt-4 flex items-center justify-center gap-2">
                  <Button v-if="lesson.allowRetake && lesson.canWork" size="md" @click="retry">
                    <RotateCw class="h-4 w-4" />
                    Kerjakan ulang
                  </Button>
                  <span v-else-if="!lesson.canWork" class="text-xs text-rose-300/90">Waktu pengerjaan sudah habis.</span>
                  <span v-else class="text-xs text-amber-300/90">Tes terkunci — tidak bisa diulang.</span>
                </div>
              </div>
            </div>

            <!-- Terkunci: waktu pengerjaan habis (grace period) -->
            <div v-else-if="!lesson.canWork" class="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-4">
              <p class="text-sm font-bold text-rose-200">Waktu pengerjaan habis</p>
              <p class="mt-1 text-sm text-rose-100/80">
                Latihan ini sudah melewati batas deadline, jadi tidak bisa dikerjakan lagi.
              </p>
            </div>

            <!-- Form pengerjaan: satu soal per layar -->
            <div v-else class="space-y-5">
              <!-- Navigator nomor soal -->
              <div class="flex flex-wrap items-center gap-2">
                <button
                  v-for="(q, i) in quizzes"
                  :key="q.id"
                  type="button"
                  class="grid h-9 w-9 place-items-center rounded-xl border text-sm font-bold transition-all"
                  :class="navClass(q, i)"
                  :title="`Soal ${i + 1}${answers[q.id] !== undefined ? ' (sudah dijawab)' : ''}`"
                  @click="currentIndex = i"
                >
                  {{ i + 1 }}
                </button>
                <span class="ml-auto text-xs font-semibold text-zinc-400">
                  {{ answeredCount }}/{{ quizzes.length }} terjawab
                </span>
              </div>

              <!-- Soal aktif -->
              <div v-if="currentQuestion" class="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p class="text-xs font-semibold tracking-wide text-zinc-500">
                  Soal {{ currentIndex + 1 }} dari {{ quizzes.length }}
                </p>
                <p class="mt-1 text-sm font-bold text-zinc-50">{{ currentQuestion.question }}</p>
                <div class="mt-4 grid gap-2">
                  <button
                    v-for="opt in currentQuestion.options"
                    :key="opt.id"
                    type="button"
                    class="flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-all"
                    :class="answers[currentQuestion.id] === opt.id
                      ? 'border-accent-blue/60 bg-accent-blue/15 text-zinc-50'
                      : 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10'"
                    @click="answers[currentQuestion.id] = opt.id"
                  >
                    <span
                      class="grid h-5 w-5 shrink-0 place-items-center rounded-full border"
                      :class="answers[currentQuestion.id] === opt.id ? 'border-accent-blue bg-accent-blue/30' : 'border-white/20'"
                    >
                      <span v-if="answers[currentQuestion.id] === opt.id" class="h-2 w-2 rounded-full bg-zinc-50" />
                    </span>
                    {{ opt.text }}
                  </button>
                </div>
              </div>

              <p v-if="submitError" class="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs text-rose-300">
                {{ submitError }}
              </p>

              <!-- Navigasi & submit -->
              <div class="flex items-center justify-between gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  :disabled="currentIndex === 0"
                  @click="currentIndex = Math.max(0, currentIndex - 1)"
                >
                  <ChevronLeft class="h-4 w-4" />
                  Sebelumnya
                </Button>

                <Button
                  v-if="currentIndex < quizzes.length - 1"
                  size="md"
                  @click="currentIndex = Math.min(quizzes.length - 1, currentIndex + 1)"
                >
                  Berikutnya
                  <ChevronRight class="h-4 w-4" />
                </Button>
                <Button
                  v-else
                  size="md"
                  :disabled="submitting"
                  @click="submitQuiz"
                >
                  <Send class="h-4 w-4" />
                  {{ submitting ? 'Mengirim...' : 'Kumpulkan jawaban' }}
                </Button>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      <!-- Sidebar -->
      <div class="lg:col-span-4">
        <GlassCard class="p-6">
          <h2 class="text-lg font-extrabold tracking-tight text-zinc-50">Info</h2>

          <div class="mt-5 grid gap-2">
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs font-semibold text-zinc-300">Tipe</p>
              <p class="mt-1 text-sm font-bold text-zinc-50">{{ typeLabel(lesson.type) }}</p>
            </div>

            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs font-semibold text-zinc-300">Diunggah</p>
              <p class="mt-1 text-sm font-bold text-zinc-50">{{ formatDate(lesson.createdAt) }}</p>
            </div>

            <div
              v-if="lesson.type === 'QUIZ'"
              class="rounded-2xl border p-4"
              :class="lesson.deadline && !lesson.canWork
                ? 'border-rose-500/30 bg-rose-500/10'
                : 'border-white/10 bg-white/5'"
            >
              <p class="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                <Clock class="h-3.5 w-3.5" />
                Deadline
              </p>
              <p class="mt-1 text-sm font-bold text-zinc-50">
                {{ lesson.deadline ? formatDateTime(lesson.deadline) : 'Tanpa batas waktu' }}
              </p>
              <p v-if="lesson.deadline && !lesson.canWork" class="mt-1 text-xs font-semibold text-rose-300">
                Waktu pengerjaan sudah habis
              </p>
              <p v-else-if="lesson.deadline" class="mt-1 text-xs text-emerald-300">
                Masih bisa dikerjakan
              </p>
            </div>

            <div v-if="lesson.course" class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs font-semibold text-zinc-300">Course</p>
              <p class="mt-1 text-sm font-bold text-zinc-50">{{ lesson.course.title }}</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  </div>

  <p v-else-if="pending" class="text-center text-sm text-zinc-500">Memuat...</p>

  <div v-else class="mx-auto max-w-2xl">
    <GlassCard class="p-8">
      <p class="text-sm font-semibold text-zinc-300">Materi tidak ditemukan</p>
      <p class="mt-2 text-sm text-zinc-500">Periksa URL atau kembali ke daftar materi.</p>
      <div class="mt-4">
        <NuxtLink to="/courses">
          <Button size="md">
            <ArrowLeft class="h-4 w-4" />
            Kembali ke materi
          </Button>
        </NuxtLink>
      </div>
    </GlassCard>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, ChevronLeft, ChevronRight, Clock, RotateCw, Send } from 'lucide-vue-next'

import Button from '~/components/ui/button/Button.vue'
import GlassCard from '~/components/ui/GlassCard.vue'

definePageMeta({
  layout: 'student',
  middleware: 'auth',
})

type QuizStatus = 'open' | 'grace' | 'expired' | 'inactive'
type LessonDetail = {
  id: number
  title: string
  type: 'VIDEO' | 'READING' | 'QUIZ'
  content: string | null
  videoUrl: string | null
  order: number
  allowRetake: boolean
  deadline: string | null
  quizStatus: QuizStatus | null
  canWork: boolean
  createdAt: string
  course: { id: number; title: string } | null
}

type QuizOption = { id: number; text: string }
type QuizItem = { id: number; question: string; options: QuizOption[] }
type MyResult = { submitted: boolean; score: number; correct: number; total: number } | null
type QuizPayload = { quizzes: QuizItem[]; myResult: MyResult }

const route = useRoute()

const { data: lesson, pending } = await useFetch<LessonDetail>(
  () => `/api/lessons/${route.params.id}`,
  { default: () => null as any },
)

// --- Quiz state ---
const quizzes = ref<QuizItem[]>([])
const answers = reactive<Record<number, number>>({})
const quizPending = ref(false)
const submitting = ref(false)
const submitError = ref<string | null>(null)

const finished = ref(false)
const resultScore = ref(0)
const resultCorrect = ref(0)
const resultTotal = ref(0)

const answeredCount = computed(() => Object.keys(answers).length)

// Navigasi satu soal per layar.
const currentIndex = ref(0)
const currentQuestion = computed(() => quizzes.value[currentIndex.value] ?? null)

function navClass(q: QuizItem, i: number) {
  const answered = answers[q.id] !== undefined
  const current = i === currentIndex.value
  const cls = answered
    ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-200'
    : 'border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10'
  return current ? `${cls} ring-2 ring-accent-blue ring-offset-2 ring-offset-background` : cls
}

async function loadQuiz() {
  if (!lesson.value || lesson.value.type !== 'QUIZ') return
  // Quiz nonaktif/kedaluwarsa tidak punya soal yang bisa dimuat (server menolak).
  if (lesson.value.quizStatus === 'expired' || lesson.value.quizStatus === 'inactive') return
  quizPending.value = true
  try {
    const data = await $fetch<QuizPayload>(`/api/lessons/${lesson.value.id}/quizzes`)
    quizzes.value = data.quizzes
    currentIndex.value = 0
    if (data.myResult?.submitted) {
      finished.value = true
      resultScore.value = data.myResult.score
      resultCorrect.value = data.myResult.correct
      resultTotal.value = data.myResult.total
    }
  } finally {
    quizPending.value = false
  }
}

watch(lesson, () => loadQuiz(), { immediate: true })

async function submitQuiz() {
  submitError.value = null
  if (answeredCount.value < quizzes.value.length) {
    submitError.value = 'Jawab semua soal dulu sebelum mengumpulkan.'
    return
  }
  submitting.value = true
  try {
    const payload = Object.entries(answers).map(([quizId, optionId]) => ({
      quizId: Number(quizId),
      optionId,
    }))
    const res = await $fetch<{ score: number; correct: number; total: number }>(
      `/api/lessons/${lesson.value!.id}/submit`,
      { method: 'POST', body: { answers: payload } },
    )
    resultScore.value = res.score
    resultCorrect.value = res.correct
    resultTotal.value = res.total
    finished.value = true
  } catch (err: any) {
    submitError.value = err?.statusMessage ?? err?.data?.statusMessage ?? 'Gagal mengumpulkan jawaban.'
  } finally {
    submitting.value = false
  }
}

function retry() {
  for (const k of Object.keys(answers)) delete answers[Number(k)]
  finished.value = false
  submitError.value = null
  currentIndex.value = 0
}

function scoreColor(score: number) {
  if (score >= 80) return 'text-emerald-300'
  if (score >= 60) return 'text-amber-300'
  return 'text-rose-300'
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

const youtubeEmbedId = computed(() => {
  const url = lesson.value?.videoUrl
  if (!url) return null
  const patterns = [
    /(?:youtube\.com\/watch\?(?:.*&)?v=)([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /youtube\.com\/embed\/([\w-]{11})/,
    /youtube\.com\/shorts\/([\w-]{11})/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
})

function typeLabel(type: LessonDetail['type']) {
  if (type === 'VIDEO') return 'Video'
  if (type === 'QUIZ') return 'Quiz'
  return 'Reading'
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>
