<template>
  <div class="relative">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-xs font-semibold tracking-wide text-zinc-500">Teacher Dashboard</p>
        <h1 class="mt-1 text-2xl font-extrabold tracking-tight text-zinc-50">
          Control room untuk kelas fisika
        </h1>
        <p class="mt-2 max-w-2xl text-sm text-zinc-400">
          Prototype hi-fi: bento grid, glassmorphism, dan micro-interactions untuk workflow guru.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <Button variant="secondary" size="md">
          <Bell class="h-4 w-4" />
          Notifikasi
        </Button>
        <Button size="md">
          <Sparkles class="h-4 w-4" />
          Generate Insight
        </Button>
      </div>
    </div>

    <div class="mt-6 grid gap-4 lg:grid-cols-12">
      <!-- Stat 1 -->
      <div class="lg:col-span-4">
        <StatCard
          label="Total Students"
          :value="stats.students.value"
          :delta="stats.students.delta"
          :icon="Users"
          tone="blue"
        >
          <template #sub>
            <p class="mt-2 text-xs text-zinc-500">Last 7 days</p>
          </template>
          <template #footer>
            <div class="mt-4">
              <Sparkline :points="stats.students.trend" />
            </div>
          </template>
        </StatCard>
      </div>

      <!-- Stat 2 -->
      <div class="lg:col-span-4">
        <StatCard
          label="Active Courses"
          :value="stats.courses.value"
          :delta="stats.courses.delta"
          :icon="Layers"
          tone="indigo"
        >
          <template #sub>
            <p class="mt-2 text-xs text-zinc-500">Published & accessible</p>
          </template>
          <template #footer>
            <div class="mt-4 grid grid-cols-3 gap-2">
              <MiniBadge v-for="tag in ['Mechanics', 'Waves', 'Thermo']" :key="tag" :label="tag" />
            </div>
          </template>
        </StatCard>
      </div>

      <!-- Stat 3 -->
      <div class="lg:col-span-4">
        <StatCard
          label="Assignments to Grade"
          :value="stats.toGrade.value"
          :delta="stats.toGrade.delta"
          :icon="ClipboardCheck"
          tone="blue"
        >
          <template #sub>
            <p class="mt-2 text-xs text-zinc-500">Priority: high-impact</p>
          </template>
          <template #footer>
            <div class="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p class="text-xs font-semibold text-zinc-300">Suggested focus</p>
              <p class="text-xs font-semibold text-emerald-300">Newton Quiz</p>
            </div>
          </template>
        </StatCard>
      </div>

      <!-- Main: Recent Materials -->
      <div class="lg:col-span-7">
        <GlassCard class="p-6">
          <div class="flex items-center justify-between gap-4">
            <div>
              <h2 class="text-lg font-extrabold tracking-tight text-zinc-50">Recent Materials</h2>
              <p class="mt-1 text-sm text-zinc-500">Drafts & publish-ready items</p>
            </div>
            <Button variant="ghost" size="sm">
              <ArrowUpRight class="h-4 w-4" />
              View all
            </Button>
          </div>

          <div class="mt-5 space-y-2">
            <p v-if="coursesPending" class="text-sm text-zinc-500">Memuat...</p>
            <p v-else-if="!courses || courses.length === 0" class="text-sm text-zinc-500">
              Belum ada course. Seed database dulu (npm run db:seed).
            </p>
            <button
              v-for="c in courses"
              :key="c.id"
              class="group/material w-full rounded-2xl border border-white/10 bg-white/3 px-4 py-3 text-left transition-all duration-200 hover:bg-white/5 hover:border-accent-blue/35"
              type="button"
            >
              <div class="flex items-center justify-between gap-3">
                <div class="flex min-w-0 items-center gap-3">
                  <div class="relative grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5">
                    <div class="pointer-events-none absolute inset-0 rounded-2xl bg-accent-blue/20 opacity-70 blur-xl" />
                    <Layers class="relative h-5 w-5 text-zinc-50" />
                  </div>
                  <div class="min-w-0">
                    <p class="truncate text-sm font-bold text-zinc-50">{{ c.title }}</p>
                    <p class="mt-0.5 text-xs text-zinc-500">
                      {{ c.lessonCount }} lesson · {{ c.enrollmentCount }} siswa
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-300">
                    {{ c.isPublished ? 'Published' : 'Draft' }}
                  </span>
                  <ChevronRight class="h-4 w-4 text-zinc-600 transition-transform duration-200 group-hover/material:translate-x-0.5" />
                </div>
              </div>
            </button>
          </div>
        </GlassCard>
      </div>

      <!-- Recent Activity -->
      <div class="lg:col-span-5">
        <GlassCard class="p-6">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-extrabold tracking-tight text-zinc-50">Recent Activity</h2>
            <span class="text-xs font-semibold text-zinc-500">Live</span>
          </div>

          <div class="mt-4 space-y-2">
            <div
              v-for="a in activity"
              :key="a.id"
              class="group/activity rounded-2xl border border-white/10 bg-white/3 px-4 py-3 transition-all duration-200 hover:bg-white/5 hover:border-accent-indigo/35"
            >
              <div class="flex items-start gap-3">
                <div class="mt-0.5 grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-white/5">
                  <component :is="a.icon" class="h-4 w-4 text-zinc-50" />
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-zinc-200">
                    {{ a.title }}
                  </p>
                  <p class="mt-1 text-xs text-zinc-500">
                    {{ a.detail }}
                  </p>
                </div>
              </div>
              <div class="mt-3 flex items-center justify-between">
                <span class="text-xs text-zinc-600">{{ a.time }}</span>
                <span class="text-xs font-semibold text-zinc-400 transition-colors group-hover/activity:text-zinc-200">
                  Open →
                </span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>

    <!-- Floating quick action -->
    <div class="fixed bottom-6 right-6 z-50">
      <GlassCard class="w-[320px] p-4" :hover="false">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="text-xs font-semibold text-zinc-500">Quick Action</p>
            <p class="mt-1 text-sm font-extrabold tracking-tight text-zinc-50">
              Upload New Material
            </p>
            <p class="mt-1 text-xs text-zinc-500">
              Drag & drop nanti bisa ditambah.
            </p>
          </div>
          <div class="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 shadow-glow-blue">
            <Upload class="h-5 w-5 text-zinc-50" />
          </div>
        </div>

        <div class="mt-4 grid grid-cols-2 gap-2">
          <Button size="sm" class="w-full" @click="isUploadOpen = true">
            <Upload class="h-4 w-4" />
            Upload
          </Button>
          <Button variant="secondary" size="sm" class="w-full">
            <FileText class="h-4 w-4" />
            Template
          </Button>
        </div>
      </GlassCard>
    </div>

    <Dialog v-model:open="isUploadOpen">
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0">
          <p class="text-xs font-semibold tracking-wide text-zinc-500">Upload</p>
          <h3 class="mt-1 text-lg font-extrabold tracking-tight text-zinc-50">
            Upload New Material
          </h3>
          <p class="mt-2 text-sm text-zinc-500">
            Pilih course, tipe lesson, lalu isi judul dan konten.
          </p>
        </div>
        <button
          type="button"
          class="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-zinc-300 transition-colors hover:bg-white/6"
          @click="isUploadOpen = false"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <div class="mt-5 space-y-4">
        <div>
          <label class="text-xs font-semibold text-zinc-300">Course</label>
          <div class="relative mt-1.5">
            <select
              v-model="uploadCourseId"
              class="h-12 w-full appearance-none rounded-2xl border border-white/10 bg-white/5 pl-4 pr-10 text-sm text-zinc-100 outline-none transition-all duration-200 focus:border-accent-blue/50 focus:ring-2 focus:ring-accent-blue/20"
            >
              <option :value="null" disabled>Pilih course...</option>
              <option v-for="c in courses ?? []" :key="c.id" :value="c.id">{{ c.title }}</option>
            </select>
            <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          </div>
        </div>

        <div>
          <label class="text-xs font-semibold text-zinc-300">Type</label>
          <div class="mt-1.5 grid grid-cols-3 gap-2">
            <button
              v-for="opt in typeOptions"
              :key="opt.value"
              type="button"
              class="flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all"
              :class="uploadType === opt.value
                ? 'border-accent-blue/60 bg-accent-blue/15 text-zinc-50'
                : 'border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200'"
              @click="uploadType = opt.value"
            >
              <component :is="opt.icon" class="h-4 w-4" />
              {{ opt.label }}
            </button>
          </div>
        </div>

        <div>
          <label class="text-xs font-semibold text-zinc-300">Title</label>
          <div class="mt-1.5">
            <Input v-model="uploadTitle" placeholder="Contoh: Hukum Newton II — latihan konsep" />
          </div>
        </div>

        <div v-if="uploadType === 'READING'">
          <label class="text-xs font-semibold text-zinc-300">Content</label>
          <textarea
            v-model="uploadContent"
            rows="4"
            placeholder="Tulis materi singkat di sini..."
            class="mt-1.5 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition-all duration-200 focus:border-accent-blue/50 focus:ring-2 focus:ring-accent-blue/20"
          />
        </div>

        <div v-if="uploadType === 'VIDEO'" class="space-y-2">
          <label class="text-xs font-semibold text-zinc-300">Video URL</label>
          <Input v-model="uploadVideoUrl" placeholder="https://www.youtube.com/watch?v=..." />
          <p class="text-[11px] text-zinc-500">YouTube: watch, youtu.be, embed, shorts.</p>

          <div v-if="videoPreview" class="overflow-hidden rounded-xl border border-white/10 bg-black/40">
            <iframe
              v-if="videoPreview.kind === 'youtube'"
              :src="`https://www.youtube.com/embed/${videoPreview.id}`"
              class="aspect-video w-full"
              frameborder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
            <img
              v-else-if="videoPreview.kind === 'thumbnail'"
              :src="videoPreview.url"
              alt="Video thumbnail"
              class="aspect-video w-full object-cover"
            />
          </div>
          <p
            v-else-if="uploadVideoUrl"
            class="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-[11px] text-amber-200"
          >
            URL belum bisa di-preview. Pastikan URL YouTube valid.
          </p>
        </div>

        <p v-if="uploadError" class="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs text-rose-300">
          {{ uploadError }}
        </p>
      </div>

      <div class="sticky bottom-0 -mx-6 -mb-6 mt-5 flex items-center justify-end gap-2 border-t border-white/10 bg-zinc-950/80 px-6 py-4 backdrop-blur">
        <Button variant="ghost" size="md" @click="closeDialog">
          Cancel
        </Button>
        <Button size="md" :disabled="uploadSubmitting" @click="submitLesson">
          <Upload class="h-4 w-4" />
          {{ uploadSubmitting ? 'Menyimpan...' : 'Create lesson' }}
        </Button>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, ref } from 'vue'
import {
  ArrowUpRight,
  Bell,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Layers,
  Sparkles,
  Upload,
  Users,
  Activity as ActivityIcon,
  CheckCircle2,
  MessageSquare,
  Timer,
  Video,
  X,
} from 'lucide-vue-next'

import Button from '~/components/ui/button/Button.vue'
import GlassCard from '~/components/ui/GlassCard.vue'
import StatCard from '~/components/ui/StatCard.vue'
import Dialog from '~/components/ui/dialog/Dialog.vue'
import Input from '~/components/ui/input/Input.vue'

definePageMeta({
  layout: 'teacher',
  middleware: 'auth',
})

type CourseListItem = {
  id: number
  title: string
  description: string | null
  isPublished: boolean
  lessonCount: number
  enrollmentCount: number
}

const { data: courses, pending: coursesPending, refresh: refreshCourses } =
  await useFetch<CourseListItem[]>('/api/courses', { default: () => [] })

type LessonType = 'VIDEO' | 'READING' | 'QUIZ'

const typeOptions: { value: LessonType; label: string; icon: any }[] = [
  { value: 'VIDEO', label: 'Video', icon: Video },
  { value: 'READING', label: 'Reading', icon: FileText },
  { value: 'QUIZ', label: 'Quiz', icon: CheckCircle2 },
]

const isUploadOpen = ref(false)
const uploadCourseId = ref<number | null>(null)
const uploadType = ref<LessonType>('READING')
const uploadTitle = ref('')
const uploadContent = ref('')
const uploadVideoUrl = ref('')
const uploadSubmitting = ref(false)
const uploadError = ref<string | null>(null)

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

const videoPreview = computed<{ kind: 'youtube'; id: string } | { kind: 'thumbnail'; url: string } | null>(() => {
  const ytId = extractYouTubeId(uploadVideoUrl.value)
  if (ytId) return { kind: 'youtube', id: ytId }
  return null
})

function resetUploadForm() {
  uploadCourseId.value = null
  uploadType.value = 'READING'
  uploadTitle.value = ''
  uploadContent.value = ''
  uploadVideoUrl.value = ''
  uploadError.value = null
}

function closeDialog() {
  isUploadOpen.value = false
  resetUploadForm()
}

async function submitLesson() {
  uploadError.value = null
  if (!uploadCourseId.value) {
    uploadError.value = 'Pilih course dulu.'
    return
  }
  if (!uploadTitle.value.trim()) {
    uploadError.value = 'Judul wajib diisi.'
    return
  }

  uploadSubmitting.value = true
  try {
    await $fetch(`/api/courses/${uploadCourseId.value}/lessons`, {
      method: 'POST',
      body: {
        title: uploadTitle.value.trim(),
        type: uploadType.value,
        content: uploadContent.value || undefined,
        videoUrl: uploadVideoUrl.value || undefined,
      },
    })
    await refreshCourses()
    closeDialog()
  } catch (err: any) {
    uploadError.value = err?.statusMessage ?? err?.data?.statusMessage ?? 'Gagal menyimpan lesson.'
  } finally {
    uploadSubmitting.value = false
  }
}

const stats = computed(() => ({
  students: { value: 342, delta: '+8.2%', trend: [28, 24, 31, 29, 33, 38, 41] },
  courses: { value: 12, delta: '+1', trend: [10, 10, 11, 11, 11, 12, 12] },
  toGrade: { value: 19, delta: '-6', trend: [27, 24, 22, 21, 19, 19, 19] },
}))

const activity = [
  { id: 'a1', title: '28 students completed “Newton Quiz”', detail: 'Median score 78 · 6 need follow-up', time: '2m ago', icon: ActivityIcon },
  { id: 'a2', title: 'New comment on “Gelombang mekanik”', detail: '“Bagian interferensi masih bingung…”', time: '11m ago', icon: MessageSquare },
  { id: 'a3', title: 'Auto-reminder sent', detail: 'Assignment “Usaha & Energi” due tomorrow', time: '1h ago', icon: Timer },
]

const MiniBadge = defineComponent({
  props: { label: { type: String, required: true } },
  setup(props) {
    return () => h(
      'span',
      { class: 'inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-300' },
      props.label,
    )
  },
})

const Sparkline = defineComponent({
  props: {
    points: { type: Array as () => number[], required: true },
  },
  setup(props) {
    const path = computed(() => {
      const pts = props.points
      const max = Math.max(...pts)
      const min = Math.min(...pts)
      const range = Math.max(1, max - min)
      return pts
        .map((v, i) => {
          const x = (i / Math.max(1, pts.length - 1)) * 100
          const y = 100 - ((v - min) / range) * 100
          return `${x.toFixed(2)},${y.toFixed(2)}`
        })
        .join(' ')
    })

    return () => h('div', { class: 'rounded-2xl border border-white/10 bg-white/5 p-3' }, [
      h('div', { class: 'flex items-center justify-between' }, [
        h('p', { class: 'text-xs font-semibold text-zinc-300' }, 'Trend'),
        h('p', { class: 'text-xs text-zinc-600' }, 'sparkline'),
      ]),
      h('svg', { viewBox: '0 0 100 100', class: 'mt-2 h-10 w-full' }, [
        h('defs', {}, [
          h('linearGradient', { id: 'spark', x1: '0', y1: '0', x2: '1', y2: '0' }, [
            h('stop', { offset: '0', 'stop-color': 'rgba(59,130,246,0.9)' }),
            h('stop', { offset: '1', 'stop-color': 'rgba(99,102,241,0.9)' }),
          ]),
        ]),
        h('polyline', {
          fill: 'none',
          stroke: 'url(#spark)',
          'stroke-width': '4',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          points: path.value,
        }),
      ]),
    ])
  },
})
</script>

