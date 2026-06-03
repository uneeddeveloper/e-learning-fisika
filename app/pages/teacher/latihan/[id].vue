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

    <!-- Pengaturan: aktif/nonaktif + deadline -->
    <GlassCard class="mt-6 p-5">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <span
            class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold"
            :class="statusBadge.class"
          >
            <component :is="statusBadge.icon" class="h-3.5 w-3.5" />
            {{ statusBadge.label }}
          </span>
          <p v-if="quizData?.lesson?.deadline" class="text-xs text-zinc-500">
            Deadline: {{ formatDateTime(quizData.lesson.deadline) }}
          </p>
          <p v-else class="text-xs text-zinc-500">Tanpa deadline</p>
        </div>

        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors"
          :class="quizData?.lesson?.isActive
            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15'
            : 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10'"
          :disabled="savingSettings"
          @click="toggleActive"
        >
          <Power class="h-4 w-4" />
          {{ quizData?.lesson?.isActive ? 'Aktif — klik untuk nonaktifkan' : 'Nonaktif — klik untuk aktifkan' }}
        </button>
      </div>

      <div class="mt-4 flex flex-wrap items-end gap-3 border-t border-white/10 pt-4">
        <div class="min-w-[220px]">
          <label class="text-xs font-semibold text-zinc-300">Batas waktu pengerjaan (deadline)</label>
          <input
            v-model="deadlineInput"
            type="datetime-local"
            class="mt-1.5 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-zinc-100 outline-none transition-all focus:border-accent-blue/50 focus:ring-2 focus:ring-accent-blue/20 [color-scheme:dark]"
          >
        </div>
        <Button size="md" :disabled="savingSettings" @click="saveDeadline">
          <Save class="h-4 w-4" />
          Simpan deadline
        </Button>
        <Button
          v-if="quizData?.lesson?.deadline"
          variant="ghost"
          size="md"
          :disabled="savingSettings"
          @click="clearDeadline"
        >
          Hapus deadline
        </Button>
      </div>
      <p class="mt-2 text-[11px] text-zinc-500">
        Setelah deadline lewat, latihan terkunci 1 hari (siswa lihat “waktu pengerjaan habis”), lalu otomatis nonaktif.
      </p>
      <p v-if="settingsError" class="mt-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs text-rose-300">
        {{ settingsError }}
      </p>
    </GlassCard>

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
            <div class="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                class="grid h-8 w-8 place-items-center rounded-xl border bg-white/5 transition-colors"
                :class="editingQuizId === q.id
                  ? 'border-accent-blue/50 text-accent-blue'
                  : 'border-white/10 text-zinc-400 hover:border-accent-blue/30 hover:bg-accent-blue/10 hover:text-zinc-100'"
                title="Edit soal"
                @click="startEdit(q)"
              >
                <Pencil class="h-4 w-4" />
              </button>
              <button
                type="button"
                class="grid h-8 w-8 place-items-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition-colors hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-300"
                :disabled="deletingId === q.id"
                title="Hapus soal"
                @click="deleteQuiz(q.id)"
              >
                <Trash2 class="h-4 w-4" />
              </button>
            </div>
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

      <!-- Form tambah / edit soal -->
      <div class="lg:col-span-5">
        <GlassCard class="p-5 lg:sticky lg:top-6">
          <div class="flex items-start justify-between gap-2">
            <div>
              <h2 class="text-base font-extrabold tracking-tight text-zinc-50">
                {{ editingQuizId ? 'Edit Soal' : 'Tambah Soal' }}
              </h2>
              <p class="mt-1 text-xs text-zinc-500">Pilihan ganda, tandai satu jawaban benar.</p>
            </div>
            <button
              v-if="editingQuizId"
              type="button"
              class="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition-colors hover:bg-white/10"
              @click="cancelEdit"
            >
              Batal edit
            </button>
          </div>

          <button
            v-if="!editingQuizId"
            type="button"
            class="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-accent-blue/40 bg-accent-blue/10 px-3 py-2.5 text-sm font-semibold text-zinc-100 transition-colors hover:bg-accent-blue/15"
            @click="openImport"
          >
            <Upload class="h-4 w-4" />
            Impor dari Word (.docx)
          </button>
          <div v-if="!editingQuizId" class="mt-4 flex items-center gap-3">
            <span class="h-px flex-1 bg-white/10" />
            <span class="text-[11px] font-semibold uppercase tracking-wide text-zinc-600">atau isi manual</span>
            <span class="h-px flex-1 bg-white/10" />
          </div>

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

            <Button size="md" class="w-full" :disabled="adding" @click="saveQuiz">
              <component :is="editingQuizId ? Save : Plus" class="h-4 w-4" />
              {{ adding ? 'Menyimpan...' : editingQuizId ? 'Simpan perubahan' : 'Simpan soal' }}
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>

    <!-- Dialog Impor dari Word -->
    <Dialog v-model:open="isImportOpen">
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0">
          <p class="text-xs font-semibold tracking-wide text-zinc-500">Impor</p>
          <h3 class="mt-1 text-lg font-extrabold tracking-tight text-zinc-50">Impor Soal dari Word</h3>
          <p class="mt-2 text-sm text-zinc-500">Unggah file .docx, periksa pratinjau, lalu simpan.</p>
        </div>
        <button
          type="button"
          class="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-zinc-300 transition-colors hover:bg-white/6"
          @click="isImportOpen = false"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <!-- Panduan format -->
      <div class="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p class="text-xs font-semibold text-zinc-300">Format penulisan di Word:</p>
        <pre class="mt-2 whitespace-pre-wrap rounded-xl border border-white/10 bg-black/30 p-3 text-[11px] leading-relaxed text-zinc-300">1. Apa satuan SI untuk gaya?
A. Joule
B. Newton
C. Watt
D. Pascal
Jawaban: B</pre>
        <p class="mt-2 text-[11px] text-zinc-500">
          Nomor soal "1." atau "1)", pilihan "A."–"E.", dan kunci di baris "Jawaban: B"
          (boleh juga "Kunci Jawaban"). Rumus/simbol berupa gambar tidak terbaca.
        </p>
      </div>

      <!-- Pilih file -->
      <div class="mt-4">
        <input
          ref="fileInput"
          type="file"
          accept=".docx"
          class="block w-full text-sm text-zinc-300 file:mr-3 file:rounded-xl file:border-0 file:bg-accent-blue/20 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-zinc-100 hover:file:bg-accent-blue/30"
          @change="onFileChange"
        >
        <p v-if="importError" class="mt-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs text-rose-300">
          {{ importError }}
        </p>
      </div>

      <!-- Pratinjau -->
      <div v-if="parsing" class="mt-4 text-sm text-zinc-500">Membaca file...</div>

      <div v-else-if="parsed.length" class="mt-4">
        <div class="flex items-center justify-between gap-2">
          <p class="text-sm font-semibold text-zinc-200">
            Pratinjau: {{ validCount }} valid
            <span v-if="invalidCount" class="text-rose-300">· {{ invalidCount }} bermasalah</span>
          </p>
        </div>

        <div class="mt-3 max-h-[40vh] space-y-2 overflow-y-auto pr-1">
          <div
            v-for="(q, i) in parsed"
            :key="i"
            class="rounded-2xl border p-3"
            :class="q.valid ? 'border-white/10 bg-white/3' : 'border-rose-500/30 bg-rose-500/10'"
          >
            <div class="flex items-start gap-2">
              <CheckCircle2 v-if="q.valid" class="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              <AlertTriangle v-else class="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold text-zinc-100">
                  <span class="text-zinc-500">{{ i + 1 }}.</span> {{ q.question || '(pertanyaan kosong)' }}
                </p>
                <ul class="mt-1.5 space-y-1">
                  <li
                    v-for="(opt, oi) in q.options"
                    :key="oi"
                    class="flex items-center gap-1.5 text-xs"
                    :class="opt.isCorrect ? 'font-semibold text-emerald-300' : 'text-zinc-400'"
                  >
                    <span class="text-zinc-600">{{ optionLetter(oi) }}.</span>
                    {{ opt.text }}
                    <CheckCircle2 v-if="opt.isCorrect" class="h-3 w-3" />
                  </li>
                </ul>
                <p v-if="q.issues.length" class="mt-1.5 text-[11px] font-semibold text-rose-300">
                  {{ q.issues.join(' ') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-5 flex items-center justify-end gap-2">
        <Button variant="ghost" size="md" @click="isImportOpen = false">Batal</Button>
        <Button size="md" :disabled="importing || validCount === 0" @click="saveImported">
          <Save class="h-4 w-4" />
          {{ importing ? 'Menyimpan...' : `Simpan ${validCount} soal` }}
        </Button>
      </div>
    </Dialog>

    <!-- TAB NILAI -->
    <div v-if="tab === 'nilai'" class="mt-6">
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
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { AlertTriangle, ArrowLeft, CheckCircle2, Circle, Clock, Pencil, Plus, Power, RotateCw, Save, Trash2, Upload, X, XCircle } from 'lucide-vue-next'

import Button from '~/components/ui/button/Button.vue'
import GlassCard from '~/components/ui/GlassCard.vue'
import Input from '~/components/ui/input/Input.vue'
import Dialog from '~/components/ui/dialog/Dialog.vue'

definePageMeta({
  layout: 'teacher',
  middleware: 'auth',
})

type QuizStatus = 'open' | 'grace' | 'expired' | 'inactive'
type Option = { id: number; text: string; isCorrect: boolean }
type Quiz = { id: number; question: string; options: Option[] }
type QuizData = {
  lesson: {
    id: number
    title: string
    type: string
    allowRetake: boolean
    isActive: boolean
    deadline: string | null
    status: QuizStatus
    canWork: boolean
  }
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

// --- Pengaturan: aktif/nonaktif + deadline ---
const savingSettings = ref(false)
const settingsError = ref<string | null>(null)
const deadlineInput = ref('')

// Sinkronkan input deadline dengan data dari server (format datetime-local lokal).
watch(() => quizData.value?.lesson?.deadline, (d) => {
  deadlineInput.value = d ? toLocalInput(d) : ''
}, { immediate: true })

const statusBadge = computed(() => {
  const s = quizData.value?.lesson?.status
  if (s === 'open') return { label: 'Aktif', class: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300', icon: CheckCircle2 }
  if (s === 'grace') return { label: 'Waktu habis (terkunci)', class: 'border-amber-500/30 bg-amber-500/10 text-amber-300', icon: AlertTriangle }
  if (s === 'expired') return { label: 'Kedaluwarsa (nonaktif)', class: 'border-rose-500/30 bg-rose-500/10 text-rose-300', icon: Clock }
  return { label: 'Nonaktif', class: 'border-white/15 bg-white/5 text-zinc-400', icon: XCircle }
})

async function patchSettings(body: Record<string, unknown>) {
  savingSettings.value = true
  settingsError.value = null
  try {
    await $fetch(`/api/lessons/${lessonId}/settings`, { method: 'PATCH', body })
    await refresh()
  } catch (err: any) {
    settingsError.value = err?.statusMessage ?? err?.data?.statusMessage ?? 'Gagal menyimpan pengaturan.'
  } finally {
    savingSettings.value = false
  }
}

function toggleActive() {
  patchSettings({ isActive: !quizData.value?.lesson?.isActive })
}

function saveDeadline() {
  if (!deadlineInput.value) {
    settingsError.value = 'Pilih tanggal & jam deadline dulu, atau gunakan “Hapus deadline”.'
    return
  }
  patchSettings({ deadline: new Date(deadlineInput.value).toISOString() })
}

function clearDeadline() {
  patchSettings({ deadline: null })
}

// ISO -> nilai input datetime-local (waktu lokal).
function toLocalInput(iso: string) {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// --- Tambah / edit soal ---
const form = reactive({
  question: '',
  options: ['', ''] as string[],
  correctIndex: 0,
})
const adding = ref(false)
const addError = ref<string | null>(null)
const editingQuizId = ref<number | null>(null)

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

function startEdit(q: Quiz) {
  editingQuizId.value = q.id
  addError.value = null
  form.question = q.question
  form.options = q.options.map((o) => o.text)
  const idx = q.options.findIndex((o) => o.isCorrect)
  form.correctIndex = idx >= 0 ? idx : 0
  // Gulir ke atas agar form (sticky) terlihat di layar kecil.
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}

function cancelEdit() {
  editingQuizId.value = null
  addError.value = null
  resetForm()
}

async function saveQuiz() {
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
    const body = {
      question,
      // Hanya kirim pilihan yang terisi; sesuaikan kembali penanda jawaban benar.
      options: options
        .map((text, idx) => ({ text, isCorrect: idx === form.correctIndex }))
        .filter((o) => o.text.length > 0),
    }
    if (editingQuizId.value) {
      await $fetch(`/api/quizzes/${editingQuizId.value}`, { method: 'PUT', body })
    } else {
      await $fetch(`/api/lessons/${lessonId}/quizzes`, { method: 'POST', body })
    }
    cancelEdit()
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

// --- Impor dari Word (.docx) ---
type ParsedOption = { text: string; isCorrect: boolean }
type ParsedQuestion = { question: string; options: ParsedOption[]; valid: boolean; issues: string[] }

const isImportOpen = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const parsing = ref(false)
const importing = ref(false)
const importError = ref<string | null>(null)
const parsed = ref<ParsedQuestion[]>([])

const validCount = computed(() => parsed.value.filter((q) => q.valid).length)
const invalidCount = computed(() => parsed.value.length - validCount.value)

function optionLetter(idx: number) {
  return String.fromCharCode(65 + idx)
}

function openImport() {
  importError.value = null
  parsed.value = []
  if (fileInput.value) fileInput.value.value = ''
  isImportOpen.value = true
}

async function onFileChange(e: Event) {
  importError.value = null
  parsed.value = []
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  parsing.value = true
  try {
    const fd = new FormData()
    fd.append('file', file)
    const res = await $fetch<{ total: number; validCount: number; questions: ParsedQuestion[] }>(
      '/api/quizzes/parse-docx',
      { method: 'POST', body: fd },
    )
    parsed.value = res.questions
    if (res.total === 0) {
      importError.value = 'Tidak ada soal terbaca. Periksa format penulisan di Word.'
    }
  } catch (err: any) {
    importError.value = err?.statusMessage ?? err?.data?.statusMessage ?? 'Gagal membaca file.'
  } finally {
    parsing.value = false
  }
}

async function saveImported() {
  if (validCount.value === 0 || importing.value) return
  importing.value = true
  importError.value = null
  try {
    const questions = parsed.value
      .filter((q) => q.valid)
      .map((q) => ({ question: q.question, options: q.options }))
    const res = await $fetch<{ created: number; skipped: number }>(
      `/api/lessons/${lessonId}/quizzes-bulk`,
      { method: 'POST', body: { questions } },
    )
    isImportOpen.value = false
    await refresh()
    alert(`${res.created} soal berhasil diimpor.`)
  } catch (err: any) {
    importError.value = err?.statusMessage ?? err?.data?.statusMessage ?? 'Gagal menyimpan soal.'
  } finally {
    importing.value = false
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
