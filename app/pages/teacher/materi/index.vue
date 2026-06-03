<template>
  <div>
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-xs font-semibold tracking-wide text-zinc-500">Teacher · Materi</p>
        <h1 class="mt-1 text-2xl font-extrabold tracking-tight text-zinc-50">
          Kelola Materi
        </h1>
        <p class="mt-2 max-w-2xl text-sm text-zinc-400">
          Tambah, ubah, atau hapus materi video & bacaan. Quiz dikelola di menu Soal Latihan.
        </p>
      </div>

      <Button size="md" @click="openCreate">
        <Upload class="h-4 w-4" />
        Tambah Materi
      </Button>
    </div>

    <div class="mt-6 grid gap-3">
      <p v-if="pending" class="text-sm text-zinc-500">Memuat...</p>
      <GlassCard v-else-if="materiList.length === 0" class="p-8 text-center">
        <p class="text-sm font-semibold text-zinc-300">Belum ada materi</p>
        <p class="mt-2 text-sm text-zinc-500">Klik “Tambah Materi” untuk membuat materi pertama.</p>
      </GlassCard>

      <GlassCard v-for="l in materiList" :key="l.id" class="p-4">
        <div class="flex items-center justify-between gap-4">
          <div class="flex min-w-0 items-center gap-3">
            <div class="relative grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5">
              <component :is="typeIcon(l.type)" class="h-5 w-5 text-zinc-50" />
            </div>
            <div class="min-w-0">
              <p class="truncate text-sm font-bold text-zinc-50">{{ l.title }}</p>
              <p class="mt-0.5 text-xs text-zinc-500">{{ typeLabel(l.type) }} · {{ formatDate(l.createdAt) }}</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 transition-colors hover:bg-white/10"
              title="Edit"
              @click="openEdit(l)"
            >
              <Pencil class="h-4 w-4" />
            </button>
            <button
              type="button"
              class="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition-colors hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-300"
              title="Hapus"
              :disabled="deletingId === l.id"
              @click="removeLesson(l)"
            >
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
        </div>
      </GlassCard>
    </div>

    <!-- Dialog create/edit -->
    <Dialog v-model:open="isOpen">
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0">
          <p class="text-xs font-semibold tracking-wide text-zinc-500">{{ editingId ? 'Edit' : 'Baru' }}</p>
          <h3 class="mt-1 text-lg font-extrabold tracking-tight text-zinc-50">
            {{ editingId ? 'Edit Materi' : 'Tambah Materi' }}
          </h3>
          <p class="mt-2 text-sm text-zinc-500">Pilih tipe materi, lalu isi detailnya.</p>
        </div>
        <button
          type="button"
          class="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-zinc-300 transition-colors hover:bg-white/6"
          @click="isOpen = false"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <div class="mt-5 space-y-4">
        <div>
          <label class="text-xs font-semibold text-zinc-300">Type</label>
          <div class="mt-1.5 grid grid-cols-3 gap-2">
            <button
              v-for="opt in typeOptions"
              :key="opt.value"
              type="button"
              class="flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all"
              :class="form.type === opt.value
                ? 'border-accent-blue/60 bg-accent-blue/15 text-zinc-50'
                : 'border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200'"
              @click="form.type = opt.value"
            >
              <component :is="opt.icon" class="h-4 w-4" />
              {{ opt.label }}
            </button>
          </div>
        </div>

        <div>
          <label class="text-xs font-semibold text-zinc-300">Title</label>
          <div class="mt-1.5">
            <Input v-model="form.title" placeholder="Contoh: Hukum Newton II — latihan konsep" />
          </div>
        </div>

        <div v-if="form.type === 'READING'">
          <label class="text-xs font-semibold text-zinc-300">Content</label>
          <textarea
            v-model="form.content"
            rows="4"
            placeholder="Tulis materi singkat di sini..."
            class="mt-1.5 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition-all duration-200 focus:border-accent-blue/50 focus:ring-2 focus:ring-accent-blue/20"
          />
        </div>

        <div v-if="form.type === 'VIDEO'" class="space-y-2">
          <label class="text-xs font-semibold text-zinc-300">Video URL</label>
          <Input v-model="form.videoUrl" placeholder="https://www.youtube.com/watch?v=..." />
          <p class="text-[11px] text-zinc-500">YouTube: watch, youtu.be, embed, shorts.</p>

          <div v-if="videoPreviewId" class="overflow-hidden rounded-xl border border-white/10 bg-black/40">
            <iframe
              :src="`https://www.youtube.com/embed/${videoPreviewId}`"
              class="aspect-video w-full"
              frameborder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
          </div>
          <p
            v-else-if="form.videoUrl"
            class="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-[11px] text-amber-200"
          >
            URL belum bisa di-preview. Pastikan URL YouTube valid.
          </p>
        </div>

        <p v-if="error" class="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs text-rose-300">
          {{ error }}
        </p>
      </div>

      <div class="mt-5 flex items-center justify-end gap-2">
        <Button variant="ghost" size="md" @click="isOpen = false">Batal</Button>
        <Button size="md" :disabled="submitting" @click="submit">
          <Upload class="h-4 w-4" />
          {{ submitting ? 'Menyimpan...' : editingId ? 'Simpan perubahan' : 'Buat materi' }}
        </Button>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { FileText, Pencil, Trash2, Upload, Video, X } from 'lucide-vue-next'

import Button from '~/components/ui/button/Button.vue'
import GlassCard from '~/components/ui/GlassCard.vue'
import Dialog from '~/components/ui/dialog/Dialog.vue'
import Input from '~/components/ui/input/Input.vue'

definePageMeta({
  layout: 'teacher',
  middleware: 'auth',
})

// Materi non-quiz. Quiz dikelola terpisah di menu Soal Latihan.
type MateriType = 'VIDEO' | 'READING'
type LessonItem = {
  id: number
  title: string
  type: 'VIDEO' | 'READING' | 'QUIZ'
  videoUrl: string | null
  content: string | null
  order: number
  allowRetake: boolean
  createdAt: string
}

const { data: lessons, pending, refresh } = await useFetch<LessonItem[]>('/api/lessons', {
  default: () => [],
})

// Sembunyikan quiz dari manajemen materi.
const materiList = computed(() => (lessons.value ?? []).filter((l) => l.type !== 'QUIZ'))

const typeOptions: { value: MateriType; label: string; icon: any }[] = [
  { value: 'VIDEO', label: 'Video', icon: Video },
  { value: 'READING', label: 'Reading', icon: FileText },
]

function typeIcon(type: LessonItem['type']) {
  if (type === 'VIDEO') return Video
  return FileText
}
function typeLabel(type: LessonItem['type']) {
  if (type === 'VIDEO') return 'Video'
  return 'Reading'
}

const isOpen = ref(false)
const editingId = ref<number | null>(null)
const submitting = ref(false)
const error = ref<string | null>(null)

const form = reactive({
  type: 'READING' as MateriType,
  title: '',
  content: '',
  videoUrl: '',
})

function resetForm() {
  form.type = 'READING'
  form.title = ''
  form.content = ''
  form.videoUrl = ''
  error.value = null
}

function openCreate() {
  editingId.value = null
  resetForm()
  isOpen.value = true
}

function openEdit(l: LessonItem) {
  editingId.value = l.id
  error.value = null
  form.type = (l.type === 'VIDEO' ? 'VIDEO' : 'READING')
  form.title = l.title
  form.content = l.content ?? ''
  form.videoUrl = l.videoUrl ?? ''
  isOpen.value = true
}

function extractYouTubeId(raw: string): string | null {
  const url = raw.trim()
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
}

const videoPreviewId = computed(() => extractYouTubeId(form.videoUrl))

async function submit() {
  error.value = null
  if (!form.title.trim()) {
    error.value = 'Judul wajib diisi.'
    return
  }
  submitting.value = true
  try {
    const body = {
      title: form.title.trim(),
      type: form.type,
      content: form.type === 'READING' ? form.content || undefined : undefined,
      videoUrl: form.type === 'VIDEO' ? form.videoUrl || undefined : undefined,
    }
    if (editingId.value) {
      await $fetch(`/api/lessons/${editingId.value}`, { method: 'PUT', body })
    } else {
      await $fetch('/api/lessons', { method: 'POST', body })
    }
    isOpen.value = false
    await refresh()
  } catch (err: any) {
    error.value = err?.statusMessage ?? err?.data?.statusMessage ?? 'Gagal menyimpan materi.'
  } finally {
    submitting.value = false
  }
}

const deletingId = ref<number | null>(null)
async function removeLesson(l: LessonItem) {
  const extra = l.type === 'QUIZ' ? ' Semua soal & nilai terkait juga akan terhapus.' : ''
  if (!confirm(`Hapus materi “${l.title}”?${extra}`)) return
  deletingId.value = l.id
  try {
    await $fetch(`/api/lessons/${l.id}`, { method: 'DELETE' })
    await refresh()
  } catch (err: any) {
    alert(err?.statusMessage ?? err?.data?.statusMessage ?? 'Gagal menghapus materi.')
  } finally {
    deletingId.value = null
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>
