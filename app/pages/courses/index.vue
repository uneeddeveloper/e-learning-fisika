<template>
  <div>
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-xs font-semibold tracking-wide text-zinc-500">Materi</p>
        <h1 class="mt-1 text-2xl font-extrabold tracking-tight text-zinc-50">
          Materi Fisika
        </h1>
        <p class="mt-2 max-w-2xl text-sm text-zinc-400">
          Semua materi yang diunggah oleh guru.
        </p>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="mt-6">
      <div
        class="glass-card border-glow mx-auto flex max-w-2xl items-center gap-3 rounded-3xl px-4 py-3 transition-all duration-200"
        :class="isFocus ? 'border-accent-blue/50 shadow-glow-blue' : ''"
      >
        <div class="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5">
          <Search class="h-4 w-4 text-zinc-100" />
        </div>
        <Input
          v-model="query"
          class="h-12 flex-1 border-0 bg-transparent px-0 focus:ring-0"
          placeholder="Cari materi: judul atau topik..."
          @focus="isFocus = true"
          @blur="isFocus = false"
        />
      </div>
    </div>

    <!-- States -->
    <p v-if="pending" class="mt-8 text-center text-sm text-zinc-500">Memuat materi...</p>
    <div v-else-if="!filtered || filtered.length === 0" class="mt-8">
      <GlassCard class="p-8 text-center">
        <p class="text-sm font-semibold text-zinc-300">
          {{ query ? 'Tidak ada materi yang cocok.' : 'Belum ada materi.' }}
        </p>
        <p class="mt-2 text-sm text-zinc-500">
          {{ query ? 'Coba kata kunci lain.' : 'Guru belum mengunggah materi apapun.' }}
        </p>
      </GlassCard>
    </div>

    <!-- Lesson Grid -->
    <div v-else class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="l in filtered"
        :key="l.id"
        :to="`/courses/${l.id}`"
        class="block"
      >
        <GlassCard class="h-full p-6 transition-all duration-200 hover:border-accent-blue/35">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <p class="text-xs font-semibold tracking-wide text-zinc-500">
                {{ typeLabel(l.type) }}
              </p>
              <h2 class="mt-2 line-clamp-2 text-lg font-extrabold tracking-tight text-zinc-50">
                {{ l.title }}
              </h2>
              <p v-if="l.content" class="mt-2 line-clamp-2 text-sm text-zinc-400">
                {{ l.content }}
              </p>
            </div>

            <div class="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5">
              <div class="pointer-events-none absolute inset-0 rounded-2xl bg-accent-blue/20 opacity-80 blur-xl" />
              <component :is="typeIcon(l.type)" class="relative h-5 w-5 text-zinc-50" />
            </div>
          </div>

          <!-- YouTube thumbnail for VIDEO -->
          <div
            v-if="l.type === 'VIDEO' && youtubeId(l.videoUrl)"
            class="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/40"
          >
            <img
              :src="`https://img.youtube.com/vi/${youtubeId(l.videoUrl)}/hqdefault.jpg`"
              :alt="l.title"
              class="aspect-video w-full object-cover"
            >
          </div>

          <div class="mt-4 flex items-center justify-between">
            <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-300">
              {{ formatDate(l.createdAt) }}
            </span>
            <Button size="sm" class="pointer-events-none">
              Buka
              <ArrowRight class="h-4 w-4" />
            </Button>
          </div>
        </GlassCard>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Search,
  Video,
} from 'lucide-vue-next'

import Button from '~/components/ui/button/Button.vue'
import GlassCard from '~/components/ui/GlassCard.vue'
import Input from '~/components/ui/input/Input.vue'

definePageMeta({
  layout: 'student',
})

type LessonItem = {
  id: number
  title: string
  type: 'VIDEO' | 'READING' | 'QUIZ'
  videoUrl: string | null
  content: string | null
  order: number
  createdAt: string
}

const query = ref('')
const isFocus = ref(false)

const { data: lessons, pending } = await useFetch<LessonItem[]>('/api/lessons', {
  default: () => [],
})

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return lessons.value
  return (lessons.value ?? []).filter((l) =>
    [l.title, l.content ?? ''].some((v) => v.toLowerCase().includes(q)),
  )
})

function typeLabel(type: LessonItem['type']) {
  if (type === 'VIDEO') return 'Video'
  if (type === 'QUIZ') return 'Quiz'
  return 'Reading'
}

function typeIcon(type: LessonItem['type']) {
  if (type === 'VIDEO') return Video
  if (type === 'QUIZ') return CheckCircle2
  return FileText
}

function youtubeId(url: string | null): string | null {
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>
