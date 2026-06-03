<template>
  <div class="relative">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-xs font-semibold tracking-wide text-zinc-500">Teacher Dashboard</p>
        <h1 class="mt-1 text-2xl font-extrabold tracking-tight text-zinc-50">
          Control room untuk kelas fisika
        </h1>
        <p class="mt-2 max-w-2xl text-sm text-zinc-400">
          Ringkasan aktivitas kelas secara real-time: siswa, materi, latihan, dan worksheet lab.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <!-- Notifikasi -->
        <div ref="notifRoot" class="relative">
          <Button variant="secondary" size="md" @click="toggleNotif">
            <span class="relative">
              <Bell class="h-4 w-4" />
              <span
                v-if="unreadCount > 0"
                class="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-none text-white"
              >
                {{ unreadCount > 9 ? '9+' : unreadCount }}
              </span>
            </span>
            Notifikasi
          </Button>

          <!-- Dropdown -->
          <div
            v-if="notifOpen"
            class="absolute right-0 z-50 mt-2 w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-3xl glass-card border-glow shadow-[0_1px_0_rgba(255,255,255,0.06),0_28px_90px_rgba(0,0,0,0.60)]"
          >
            <div class="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <p class="text-sm font-extrabold tracking-tight text-zinc-50">Notifikasi</p>
              <span class="text-xs font-semibold text-zinc-500">{{ notifications.length }} terbaru</span>
            </div>

            <div class="max-h-[60vh] overflow-y-auto">
              <p v-if="notifications.length === 0" class="px-4 py-8 text-center text-sm text-zinc-500">
                Belum ada aktivitas.
              </p>
              <NuxtLink
                v-for="n in notifications"
                :key="n.id"
                :to="n.link"
                class="flex items-start gap-3 border-b border-white/5 px-4 py-3 transition-colors last:border-0 hover:bg-white/5"
                @click="notifOpen = false"
              >
                <div class="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-2xl border" :class="notifMeta(n.type).wrap">
                  <component :is="notifMeta(n.type).icon" class="h-4 w-4" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-semibold text-zinc-100">{{ n.title }}</p>
                  <p v-if="n.detail" class="truncate text-xs text-zinc-500">{{ n.detail }}</p>
                  <p class="mt-0.5 text-[11px] text-zinc-600">{{ timeAgo(n.time) }}</p>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 grid gap-4 lg:grid-cols-12">
      <!-- Stat 1: Total Siswa -->
      <div class="lg:col-span-4">
        <StatCard
          label="Total Siswa"
          :value="stats.students"
          :delta="stats.studentsNew7d > 0 ? `+${stats.studentsNew7d}` : ''"
          :icon="Users"
          tone="blue"
        >
          <template #sub>
            <p class="mt-2 text-xs text-zinc-500">{{ stats.studentsNew7d }} bergabung dalam 7 hari</p>
          </template>
          <template #footer>
            <div class="mt-4">
              <Sparkline :points="stats.studentTrend" />
            </div>
          </template>
        </StatCard>
      </div>

      <!-- Stat 2: Materi -->
      <div class="lg:col-span-4">
        <StatCard
          label="Materi Terbit"
          :value="stats.materi"
          :icon="Layers"
          tone="indigo"
        >
          <template #sub>
            <p class="mt-2 text-xs text-zinc-500">Video & bacaan untuk siswa</p>
          </template>
          <template #footer>
            <div class="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p class="text-xs font-semibold text-zinc-300">Latihan & kuis</p>
              <p class="text-xs font-semibold text-accent-blue">{{ stats.quizzes }} latihan</p>
            </div>
          </template>
        </StatCard>
      </div>

      <!-- Stat 3: Worksheet Lab -->
      <div class="lg:col-span-4">
        <StatCard
          label="Worksheet Lab Masuk"
          :value="stats.labSubmissions"
          :delta="stats.labSubmissions7d > 0 ? `+${stats.labSubmissions7d}` : ''"
          :icon="ClipboardCheck"
          tone="blue"
        >
          <template #sub>
            <p class="mt-2 text-xs text-zinc-500">Dikirim siswa, siap ditinjau</p>
          </template>
          <template #footer>
            <NuxtLink
              to="/teacher/worksheet"
              class="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:border-accent-blue/35 hover:bg-white/8"
            >
              <p class="text-xs font-semibold text-zinc-300">Tinjau worksheet</p>
              <ArrowUpRight class="h-4 w-4 text-zinc-400" />
            </NuxtLink>
          </template>
        </StatCard>
      </div>

      <!-- Main: Recent Materials -->
      <div class="lg:col-span-7">
        <GlassCard class="p-6">
          <div class="flex items-center justify-between gap-4">
            <div>
              <h2 class="text-lg font-extrabold tracking-tight text-zinc-50">Materi Terbaru</h2>
              <p class="mt-1 text-sm text-zinc-500">Materi & latihan yang baru diunggah</p>
            </div>
            <NuxtLink to="/teacher/materi">
              <Button variant="ghost" size="sm">
                <ArrowUpRight class="h-4 w-4" />
                Kelola
              </Button>
            </NuxtLink>
          </div>

          <div class="mt-5 space-y-2">
            <p v-if="lessonsPending" class="text-sm text-zinc-500">Memuat...</p>
            <p v-else-if="!recentLessons || recentLessons.length === 0" class="text-sm text-zinc-500">
              Belum ada materi. Tambahkan dari menu Kelola Materi.
            </p>
            <NuxtLink
              v-for="l in recentLessons"
              :key="l.id"
              :to="l.type === 'QUIZ' ? `/teacher/latihan/${l.id}` : '/teacher/materi'"
              class="group/material block w-full rounded-2xl border border-white/10 bg-white/3 px-4 py-3 text-left transition-all duration-200 hover:bg-white/5 hover:border-accent-blue/35"
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
            </NuxtLink>
          </div>
        </GlassCard>
      </div>

      <!-- Recent Activity -->
      <div class="lg:col-span-5">
        <GlassCard class="p-6">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-extrabold tracking-tight text-zinc-50">Aktivitas Terbaru</h2>
            <button
              type="button"
              class="text-xs font-semibold text-zinc-500 transition-colors hover:text-zinc-300"
              :disabled="dashboardPending"
              @click="() => refreshDashboard()"
            >
              {{ dashboardPending ? 'Memuat...' : 'Segarkan' }}
            </button>
          </div>

          <div class="mt-4 space-y-2">
            <p v-if="!notifications.length" class="rounded-2xl border border-white/10 bg-white/3 px-4 py-6 text-center text-sm text-zinc-500">
              Belum ada aktivitas siswa.
            </p>
            <NuxtLink
              v-for="a in notifications.slice(0, 7)"
              :key="a.id"
              :to="a.link"
              class="group/activity block rounded-2xl border border-white/10 bg-white/3 px-4 py-3 transition-all duration-200 hover:bg-white/5 hover:border-accent-indigo/35"
            >
              <div class="flex items-start gap-3">
                <div class="mt-0.5 grid h-9 w-9 place-items-center rounded-2xl border" :class="notifMeta(a.type).wrap">
                  <component :is="notifMeta(a.type).icon" class="h-4 w-4" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-semibold text-zinc-200">{{ a.title }}</p>
                  <p v-if="a.detail" class="mt-0.5 truncate text-xs text-zinc-500">{{ a.detail }}</p>
                </div>
                <span class="shrink-0 text-[11px] text-zinc-600">{{ timeAgo(a.time) }}</span>
              </div>
            </NuxtLink>
          </div>
        </GlassCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  ArrowUpRight,
  Bell,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Layers,
  NotebookPen,
  ShieldAlert,
  UserPlus,
  Users,
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

type NotifType = 'worksheet' | 'quiz' | 'register' | 'security'
type Notification = {
  id: string
  type: NotifType
  title: string
  detail: string | null
  time: string
  link: string
}
type DashboardData = {
  stats: {
    students: number
    studentsNew7d: number
    studentTrend: number[]
    materi: number
    quizzes: number
    labSubmissions: number
    labSubmissions7d: number
  }
  notifications: Notification[]
}

const { data: dashboard, pending: dashboardPending, refresh: refreshDashboard } =
  await useFetch<DashboardData>('/api/teacher/dashboard', {
    default: () => ({
      stats: { students: 0, studentsNew7d: 0, studentTrend: [0, 0, 0, 0, 0, 0, 0], materi: 0, quizzes: 0, labSubmissions: 0, labSubmissions7d: 0 },
      notifications: [],
    }),
  })

const stats = computed(() => dashboard.value.stats)
const notifications = computed(() => dashboard.value.notifications)

const { data: lessons, pending: lessonsPending } =
  await useFetch<LessonItem[]>('/api/lessons', { default: () => [] })

const recentLessons = computed(() => (lessons.value ?? []).slice(0, 6))

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

function notifMeta(type: NotifType) {
  if (type === 'worksheet') return { icon: NotebookPen, wrap: 'border-accent-blue/40 bg-accent-blue/15 text-accent-blue' }
  if (type === 'quiz') return { icon: CheckCircle2, wrap: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' }
  if (type === 'register') return { icon: UserPlus, wrap: 'border-accent-indigo/40 bg-accent-indigo/15 text-accent-indigo' }
  return { icon: ShieldAlert, wrap: 'border-rose-500/30 bg-rose-500/10 text-rose-300' }
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'Baru saja'
  if (min < 60) return `${min} menit lalu`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr} jam lalu`
  const day = Math.floor(hr / 24)
  if (day < 7) return `${day} hari lalu`
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

// —— Notifikasi: dropdown + badge belum dibaca (disimpan di localStorage) ——
const SEEN_KEY = 'teacher_notif_seen_at'
const notifOpen = ref(false)
const lastSeenAt = ref<number>(0)
const notifRoot = ref<HTMLElement | null>(null)

const unreadCount = computed(() =>
  notifications.value.filter((n) => new Date(n.time).getTime() > lastSeenAt.value).length,
)

function toggleNotif() {
  notifOpen.value = !notifOpen.value
  if (notifOpen.value) {
    // Tandai semua sebagai terbaca saat panel dibuka.
    lastSeenAt.value = Date.now()
    if (import.meta.client) localStorage.setItem(SEEN_KEY, String(lastSeenAt.value))
  }
}

function onClickOutside(e: MouseEvent) {
  if (notifOpen.value && notifRoot.value && !notifRoot.value.contains(e.target as Node)) {
    notifOpen.value = false
  }
}

onMounted(() => {
  const saved = Number(localStorage.getItem(SEEN_KEY))
  if (Number.isFinite(saved) && saved > 0) lastSeenAt.value = saved
  document.addEventListener('click', onClickOutside)
})
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))

const Sparkline = defineComponent({
  props: {
    points: { type: Array as () => number[], required: true },
  },
  setup(props) {
    const path = computed(() => {
      const pts = props.points.length ? props.points : [0]
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
        h('p', { class: 'text-xs font-semibold text-zinc-300' }, 'Pendaftaran 7 hari'),
        h('p', { class: 'text-xs text-zinc-600' }, 'tren'),
      ]),
      h('svg', { viewBox: '0 0 100 100', class: 'mt-2 h-10 w-full', preserveAspectRatio: 'none' }, [
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
