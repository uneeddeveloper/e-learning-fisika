<template>
  <div>
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-xs font-semibold tracking-wide text-zinc-500">Teacher · Soal Latihan</p>
        <h1 class="mt-1 text-2xl font-extrabold tracking-tight text-zinc-50">
          Soal Latihan & Tes
        </h1>
        <p class="mt-2 max-w-2xl text-sm text-zinc-400">
          Buat soal pilihan ganda, lalu pantau siapa yang mengerjakan beserta nilainya.
        </p>
      </div>

      <Button size="md" @click="openCreate">
        <Plus class="h-4 w-4" />
        Buat Latihan
      </Button>
    </div>

    <div class="mt-6 grid gap-3">
      <p v-if="pending" class="text-sm text-zinc-500">Memuat...</p>
      <GlassCard v-else-if="!items || items.length === 0" class="p-8 text-center">
        <p class="text-sm font-semibold text-zinc-300">Belum ada latihan</p>
        <p class="mt-2 text-sm text-zinc-500">Klik “Buat Latihan” untuk membuat soal pertama.</p>
      </GlassCard>

      <NuxtLink
        v-for="item in items"
        :key="item.id"
        :to="`/teacher/latihan/${item.id}`"
        class="group block"
      >
        <GlassCard class="p-5 transition-all duration-200 group-hover:border-accent-blue/35">
          <div class="flex items-center justify-between gap-4">
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <span
                  class="rounded-full border px-2.5 py-0.5 text-[11px] font-semibold"
                  :class="item.allowRetake
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    : 'border-amber-500/30 bg-amber-500/10 text-amber-300'"
                >
                  {{ item.allowRetake ? 'Latihan' : 'Tes' }}
                </span>
                <span
                  class="rounded-full border px-2.5 py-0.5 text-[11px] font-semibold"
                  :class="statusBadge(item.quizStatus).class"
                >
                  {{ statusBadge(item.quizStatus).label }}
                </span>
                <p class="truncate text-base font-bold text-zinc-50">{{ item.title }}</p>
              </div>
              <p class="mt-1 text-xs text-zinc-500">
                {{ item.questionCount }} soal · {{ item.studentCount }} siswa mengerjakan
                <span v-if="item.deadline"> · deadline {{ formatDate(item.deadline) }}</span>
              </p>
            </div>
            <div class="flex items-center gap-3">
              <div class="hidden items-center gap-2 sm:flex">
                <span class="grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-white/5">
                  <Users class="h-4 w-4 text-zinc-300" />
                </span>
                <span class="text-sm font-bold text-zinc-100">{{ item.studentCount }}</span>
              </div>
              <ChevronRight class="h-4 w-4 text-zinc-600 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </GlassCard>
      </NuxtLink>
    </div>

    <!-- Dialog buat latihan -->
    <Dialog v-model:open="isCreateOpen">
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0">
          <p class="text-xs font-semibold tracking-wide text-zinc-500">Baru</p>
          <h3 class="mt-1 text-lg font-extrabold tracking-tight text-zinc-50">Buat Latihan</h3>
          <p class="mt-2 text-sm text-zinc-500">Beri judul dan pilih mode pengerjaan.</p>
        </div>
        <button
          type="button"
          class="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-zinc-300 transition-colors hover:bg-white/6"
          @click="isCreateOpen = false"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <div class="mt-5 space-y-4">
        <div>
          <label class="text-xs font-semibold text-zinc-300">Judul</label>
          <div class="mt-1.5">
            <Input v-model="title" placeholder="Contoh: Latihan Hukum Newton II" />
          </div>
        </div>

        <div>
          <label class="text-xs font-semibold text-zinc-300">Mode</label>
          <div class="mt-1.5 grid grid-cols-2 gap-2">
            <button
              type="button"
              class="rounded-xl border px-3 py-2.5 text-left transition-all"
              :class="allowRetake
                ? 'border-accent-blue/60 bg-accent-blue/15 text-zinc-50'
                : 'border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10'"
              @click="allowRetake = true"
            >
              <p class="text-sm font-semibold">Latihan</p>
              <p class="mt-0.5 text-[11px] opacity-80">Boleh diulang, ambil nilai terbaru</p>
            </button>
            <button
              type="button"
              class="rounded-xl border px-3 py-2.5 text-left transition-all"
              :class="!allowRetake
                ? 'border-amber-500/60 bg-amber-500/15 text-zinc-50'
                : 'border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10'"
              @click="allowRetake = false"
            >
              <p class="text-sm font-semibold">Tes</p>
              <p class="mt-0.5 text-[11px] opacity-80">Sekali kerjakan, nilai terkunci</p>
            </button>
          </div>
        </div>

        <p v-if="error" class="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs text-rose-300">
          {{ error }}
        </p>
      </div>

      <div class="mt-5 flex items-center justify-end gap-2">
        <Button variant="ghost" size="md" @click="isCreateOpen = false">Batal</Button>
        <Button size="md" :disabled="submitting" @click="createLatihan">
          <Plus class="h-4 w-4" />
          {{ submitting ? 'Membuat...' : 'Buat & isi soal' }}
        </Button>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ChevronRight, Plus, Users, X } from 'lucide-vue-next'

import Button from '~/components/ui/button/Button.vue'
import GlassCard from '~/components/ui/GlassCard.vue'
import Dialog from '~/components/ui/dialog/Dialog.vue'
import Input from '~/components/ui/input/Input.vue'

definePageMeta({
  layout: 'teacher',
  middleware: 'auth',
})

type QuizStatus = 'open' | 'grace' | 'expired' | 'inactive'
type LatihanItem = {
  id: number
  title: string
  allowRetake: boolean
  isActive: boolean
  deadline: string | null
  quizStatus: QuizStatus | null
  questionCount: number
  studentCount: number
  createdAt: string
}

function statusBadge(status: QuizStatus | null) {
  if (status === 'open') return { label: 'Aktif', class: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' }
  if (status === 'grace') return { label: 'Waktu habis', class: 'border-amber-500/30 bg-amber-500/10 text-amber-300' }
  if (status === 'expired') return { label: 'Kedaluwarsa', class: 'border-rose-500/30 bg-rose-500/10 text-rose-300' }
  return { label: 'Nonaktif', class: 'border-white/15 bg-white/5 text-zinc-400' }
}

const { data: items, pending, refresh } = await useFetch<LatihanItem[]>('/api/lessons', {
  query: { type: 'QUIZ' },
  default: () => [],
})

const isCreateOpen = ref(false)
const title = ref('')
const allowRetake = ref(true)
const submitting = ref(false)
const error = ref<string | null>(null)

function openCreate() {
  title.value = ''
  allowRetake.value = true
  error.value = null
  isCreateOpen.value = true
}

async function createLatihan() {
  error.value = null
  if (!title.value.trim()) {
    error.value = 'Judul wajib diisi.'
    return
  }
  submitting.value = true
  try {
    const res = await $fetch<{ lesson: { id: number } }>('/api/lessons', {
      method: 'POST',
      body: { title: title.value.trim(), type: 'QUIZ', allowRetake: allowRetake.value },
    })
    isCreateOpen.value = false
    await refresh()
    await navigateTo(`/teacher/latihan/${res.lesson.id}`)
  } catch (err: any) {
    error.value = err?.statusMessage ?? err?.data?.statusMessage ?? 'Gagal membuat latihan.'
  } finally {
    submitting.value = false
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>
