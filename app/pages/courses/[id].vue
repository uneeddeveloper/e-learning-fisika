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

          <!-- QUIZ (placeholder) -->
          <div v-else-if="lesson.type === 'QUIZ'">
            <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p class="text-sm font-semibold text-zinc-200">Quiz</p>
              <p class="mt-2 text-sm text-zinc-500">Fitur quiz interaktif belum tersedia.</p>
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
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'

import Button from '~/components/ui/button/Button.vue'
import GlassCard from '~/components/ui/GlassCard.vue'

definePageMeta({
  layout: 'student',
  middleware: 'auth',
})

type LessonDetail = {
  id: number
  title: string
  type: 'VIDEO' | 'READING' | 'QUIZ'
  content: string | null
  videoUrl: string | null
  order: number
  createdAt: string
  course: { id: number; title: string } | null
}

const route = useRoute()

const { data: lesson, pending } = await useFetch<LessonDetail>(
  () => `/api/lessons/${route.params.id}`,
  { default: () => null as any },
)

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
