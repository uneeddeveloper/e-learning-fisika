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
            <p v-if="lessonsPending" class="text-sm text-zinc-500">Memuat...</p>
            <p v-else-if="!lessons || lessons.length === 0" class="text-sm text-zinc-500">
              Belum ada materi. Klik Upload untuk tambah.
            </p>
            <button
              v-for="l in lessons"
              :key="l.id"
              class="group/material w-full rounded-2xl border border-white/10 bg-white/3 px-4 py-3 text-left transition-all duration-200 hover:bg-white/5 hover:border-accent-blue/35"
              type="button"
            >
              <div class="flex items-center justify-between gap-3">
                <div class="flex min-w-0 items-center gap-3">
                  <div class="relative grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5">
                    <div class="pointer-events-none absolute inset-0 rounded-2xl bg-accent-blue/20 opacity-70 blur-xl" />
                    <component :is="lessonIcon(l.type)" class="relative h-5 w-5 text-zinc-50" />
                  </div>
                  <div class="min-w-0">
                    <p class="truncate text-sm font-bold text-zinc-50">{{ l.title }}</p>
                    <p class="mt-0.5 text-xs text-zinc-500">
                      {{ lessonMeta(l) }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-300">
                    {{ l.type }}
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

  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h } from 'vue'
import {
  ArrowUpRight,
  Bell,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Layers,
  Sparkles,
  Users,
  Activity as ActivityIcon,
  CheckCircle2,
  MessageSquare,
  Timer,
  Video,
} from 'lucide-vue-next'

import Button from '~/components/ui/button/Button.vue'
import GlassCard from '~/components/ui/GlassCard.vue'
import StatCard from '~/components/ui/StatCard.vue'

definePageMeta({
  layout: 'teacher',
  middleware: 'auth',
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

const { data: lessons, pending: lessonsPending } =
  await useFetch<LessonItem[]>('/api/lessons', { default: () => [] })

function lessonIcon(type: LessonItem['type']) {
  if (type === 'VIDEO') return Video
  if (type === 'QUIZ') return CheckCircle2
  return FileText
}

function lessonMeta(l: LessonItem) {
  const date = new Date(l.createdAt)
  const formatted = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  if (l.type === 'VIDEO') return `Video · ${formatted}`
  if (l.type === 'QUIZ') return `Quiz · ${formatted}`
  return `Reading · ${formatted}`
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

