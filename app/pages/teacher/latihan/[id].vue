<template>
  <div>
    <NuxtLink
      to="/teacher/latihan"
      class="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-300 transition-colors hover:bg-white/6"
    >
      <ArrowLeft class="h-4 w-4" />
      Kembali ke daftar
    </NuxtLink>

    <div class="mt-4 flex flex-wrap items-end justify-between gap-4">
      <div class="min-w-0">
        <div class="flex items-center gap-2">
          <span
            v-if="quizData?.lesson"
            class="rounded-full border px-2.5 py-0.5 text-[11px] font-semibold"
            :class="quizData.lesson.allowRetake
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : 'border-amber-500/30 bg-amber-500/10 text-amber-300'"
          >
            {{ quizData.lesson.allowRetake ? 'Latihan' : 'Tes' }}
          </span>
          <p class="text-xs font-semibold tracking-wide text-zinc-500">Soal Latihan</p>
        </div>
        <h1 class="mt-1 truncate text-2xl font-extrabold tracking-tight text-zinc-50">
          {{ quizData?.lesson?.title ?? 'Memuat...' }}
        </h1>
      </div>

      <div class="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 p-1">
        <button
          type="button"
          class="rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
          :class="tab === 'soal' ? 'bg-white/10 text-zinc-50' : 'text-zinc-400 hover:text-zinc-200'"
          @click="tab = 'soal'"
        >
          Soal ({{ quizData?.quizzes?.length ?? 0 }})
        </button>
        <button
          type="button"
          class="rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
          :class="tab === 'nilai' ? 'bg-white/10 text-zinc-50' : 'text-zinc-400 hover:text-zinc-200'"
          @click="tab = 'nilai'"
        >
          Nilai
        </button>
      </div>
    </div>

    <!-- TAB SOAL -->
    <div v-if="tab === 'soal'" class="mt-6 grid gap-4 lg:grid-cols-12">
      <!-- Daftar soal -->
      <div class="lg:col-span-7 space-y-3">
        <p v-if="pending" class="text-sm text-zinc-500">Memuat...</p>
        <GlassCard v-else-if="!quizData?.quizzes?.length" class="p-8 text-center">
          <p class="text-sm font-semibold text-zinc-300">Belum ada soal</p>
          <p class="mt-2 text-sm text-zinc-500">Tambahkan soal lewat form di samping.</p>
        </GlassCard>

        <GlassCard v-for="(q, i) in quizData?.quizzes ?? []" :key="q.id" class="p-5">
          <div class="flex items-start justify-between gap-3">
            <p class="text-sm font-bold text-zinc-50">
              <span class="text-zinc-500">{{ i + 1 }}.</span> {{ q.question }}
            </p>
            <button
              type="button"
              class="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition-colors hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-300"
              :disabled="deletingId === q.id"
              @click="deleteQuiz(q.id)"
            >
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
          <ul class="mt-3 space-y-1.5">
            <li
              v-for="opt in q.options"
              :key="opt.id"
              class="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm"
              :class="opt.isCorrect
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                : 'border-white/10 bg-white/5 text-zinc-300'"
            >
              <CheckCircle2 v-if="opt.isCorrect" class="h-4 w-4 shrink-0 text-emerald-400" />
              <Circle v-else class="h-4 w-4 shrink-0 text-zinc-600" />
              {{ opt.text }}
            </li>
          </ul>
        </GlassCard>
      </div>

      <!-- Form tambah soal -->
      <div class="lg:col-span-5">
        <GlassCard class="p-5 lg:sticky lg:top-6">
          <h2 class="text-base font-extrabold tracking-tight text-zinc-50">Tambah Soal</h2>
          <p class="mt-1 text-xs text-zinc-500">Pilihan ganda, tandai satu jawaban benar.</p>

          <div class="mt-4 space-y-3">
            <div>
              <label class="text-xs font-semibold text-zinc-300">Pertanyaan</label>
              <textarea
                v-model="form.question"
                rows="2"
                placeholder="Tulis pertanyaan..."
                class="mt-1.5 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition-all focus:border-accent-blue/50 focus:ring-2 focus:ring-accent-blue/20"
              />
            </div>

            <div class="space-y-2">
              <label class="text-xs font-semibold text-zinc-300">Pilihan jawaban</label>
              <div v-for="(opt, idx) in form.options" :key="idx" class="flex items-center gap-2">
                <button
                  type="button"
                  class="grid h-9 w-9 shrink-0 place-items-center rounded-xl border transition-colors"
                  :class="form.correctIndex === idx
                    ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300'
                    : 'border-white/10 bg-white/5 text-zinc-500 hover:text-zinc-300'"
                  title="Tandai sebagai jawaban benar"
                  @click="form.correctIndex = idx"
                >
                  <CheckCircle2 v-if="form.correctIndex === idx" class="h-4 w-4" />
                  <Circle v-else class="h-4 w-4" />
                </button>
                <Input v-model="form.options[idx]" :placeholder="`Pilihan ${idx + 1}`" class="h-9" />
                <button
                  v-if="form.options.length > 2"
                  type="button"
                  class="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-zinc-500 transition-colors hover:text-rose-300"
                  @click="removeOption(idx)"
                >
                  <X class="h-4 w-4" />
                </button>
              </div>
              <button
                v-if="form.options.length < 6"
                type="button"
                class="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition-colors hover:bg-white/10"
                @click="form.options.push('')"
              >
                <Plus class="h-3.5 w-3.5" />
                Tambah pilihan
              </button>
            </div>

            <p v-if="addError" class="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs text-rose-300">
              {{ addError }}
            </p>

            <Button size="md" class="w-full" :disabled="adding" @click="addQuiz">
              <Plus class="h-4 w-4" />
              {{ adding ? 'Menyimpan...' : 'Simpan soal' }}
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>

    <!-- TAB NILAI -->
    <div v-else class="mt-6">
      <GlassCard class="p-5">
        <div class="flex items-center justify-between gap-3">
          <div>
            <h2 class="text-base font-extrabold tracking-tight text-zinc-50">Hasil Pengerjaan</h2>
            <p class="mt-1 text-xs text-zinc-500">
              {{ results?.students?.length ?? 0 }} siswa · {{ results?.total ?? 0 }} soal
            </p>
          </div>
          <Button variant="ghost" size="sm" :disabled="resultsPending" @click="() => refreshResults()">
            <RotateCw class="h-4 w-4" />
            Refresh
          </Button>
        </div>

        <p v-if="resultsPending" class="mt-4 text-sm text-zinc-500">Memuat...</p>
        <div v-else-if="!results?.students?.length" class="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-center">
          <p class="text-sm font-semibold text-zinc-300">Belum ada yang mengerjakan</p>
          <p class="mt-1 text-sm text-zinc-500">Nilai akan muncul di sini setelah siswa submit.</p>
        </div>

        <div v-else class="mt-4 overflow-hidden rounded-2xl border border-white/10">
          <table class="w-full text-left text-sm">
            <thead class="bg-white/5 text-xs uppercase tracking-wide text-zinc-400">
              <tr>
                <th class="px-4 py-3 font-semibold">Siswa</th>
                <th class="px-4 py-3 font-semibold">Benar</th>
                <th class="px-4 py-3 font-semibold">Nilai</th>
                <th class="hidden px-4 py-3 font-semibold sm:table-cell">Dikerjakan</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="s in results.students"
                :key="s.id"
                class="border-t border-white/5 transition-colors hover:bg-white/3"
              >
                <td class="px-4 py-3">
                  <p class="font-semibold text-zinc-100">{{ s.name }}</p>
                  <p class="text-xs text-zinc-500">{{ s.email }}</p>
                </td>
                <td class="px-4 py-3 text-zinc-300">{{ s.correct }}/{{ s.total }}</td>
                <td class="px-4 py-3">
                  <span
                    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold"
                    :class="scoreClass(s.score)"
                  >
                    {{ s.score }}
                  </span>
                </td>
                <td class="hidden px-4 py-3 text-xs text-zinc-500 sm:table-cell">
                  {{ formatDateTime(s.answeredAt) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, CheckCircle2, Circle, Plus, RotateCw, Trash2, X } from 'lucide-vue-next'

import Button from '~/components/ui/button/Button.vue'
import GlassCard from '~/components/ui/GlassCard.vue'
import Input from '~/components/ui/input/Input.vue'

definePageMeta({
  layout: 'teacher',
  middleware: 'auth',
})

type Option = { id: number; text: string; isCorrect: boolean }
type Quiz = { id: number; question: string; options: Option[] }
type QuizData = {
  lesson: { id: number; title: string; type: string; allowRetake: boolean }
  quizzes: Quiz[]
}
type Results = {
  lesson: { id: number; title: string; allowRetake: boolean }
  total: number
  students: { id: number; name: string; email: string; correct: number; total: number; score: number; answeredAt: string }[]
}

const route = useRoute()
const lessonId = route.params.id

const tab = ref<'soal' | 'nilai'>('soal')

const { data: quizData, pending, refresh } = await useFetch<QuizData>(
  () => `/api/lessons/${lessonId}/quizzes`,
  { default: () => null as any },
)

const { data: results, pending: resultsPending, refresh: refreshResults } = await useFetch<Results>(
  () => `/api/lessons/${lessonId}/results`,
  { default: () => null as any, immediate: false },
)

// Muat nilai saat tab dibuka pertama kali.
watch(tab, (t) => {
  if (t === 'nilai') refreshResults()
})

// --- Tambah soal ---
const form = reactive({
  question: '',
  options: ['', ''] as string[],
  correctIndex: 0,
})
const adding = ref(false)
const addError = ref<string | null>(null)

function removeOption(idx: number) {
  form.options.splice(idx, 1)
  if (form.correctIndex >= form.options.length) form.correctIndex = 0
  else if (form.correctIndex > idx) form.correctIndex -= 1
}

function resetForm() {
  form.question = ''
  form.options = ['', '']
  form.correctIndex = 0
}

async function addQuiz() {
  addError.value = null
  const question = form.question.trim()
  const options = form.options.map((t) => t.trim())
  if (!question) {
    addError.value = 'Pertanyaan wajib diisi.'
    return
  }
  if (options.filter((t) => t.length > 0).length < 2) {
    addError.value = 'Isi minimal 2 pilihan.'
    return
  }
  if (!options[form.correctIndex]) {
    addError.value = 'Jawaban benar tidak boleh kosong.'
    return
  }

  adding.value = true
  try {
    await $fetch(`/api/lessons/${lessonId}/quizzes`, {
      method: 'POST',
      body: {
        question,
        options: options.map((text, idx) => ({ text, isCorrect: idx === form.correctIndex })),
      },
    })
    resetForm()
    await refresh()
  } catch (err: any) {
    addError.value = err?.statusMessage ?? err?.data?.statusMessage ?? 'Gagal menyimpan soal.'
  } finally {
    adding.value = false
  }
}

// --- Hapus soal ---
const deletingId = ref<number | null>(null)
async function deleteQuiz(id: number) {
  if (!confirm('Hapus soal ini? Nilai terkait juga akan terhapus.')) return
  deletingId.value = id
  try {
    await $fetch(`/api/quizzes/${id}`, { method: 'DELETE' })
    await refresh()
  } catch (err: any) {
    alert(err?.statusMessage ?? err?.data?.statusMessage ?? 'Gagal menghapus soal.')
  } finally {
    deletingId.value = null
  }
}

function scoreClass(score: number) {
  if (score >= 80) return 'bg-emerald-500/15 text-emerald-300'
  if (score >= 60) return 'bg-amber-500/15 text-amber-300'
  return 'bg-rose-500/15 text-rose-300'
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}
</script>
