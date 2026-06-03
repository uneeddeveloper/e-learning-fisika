<template>
  <div>
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-xs font-semibold tracking-wide text-zinc-500">Teacher · Keamanan</p>
        <h1 class="mt-1 text-2xl font-extrabold tracking-tight text-zinc-50">
          Log Aktivitas
        </h1>
        <p class="mt-2 max-w-2xl text-sm text-zinc-400">
          Jejak audit keamanan: login, logout, pendaftaran, dan perubahan akun pengguna.
        </p>
      </div>

      <Button variant="secondary" size="md" :disabled="pending" @click="refresh()">
        <RefreshCw class="h-4 w-4" :class="pending ? 'animate-spin' : ''" />
        Muat ulang
      </Button>
    </div>

    <!-- Filter aksi -->
    <div class="mt-6 flex flex-wrap items-center gap-1.5">
      <button
        v-for="opt in actionFilters"
        :key="opt.value"
        type="button"
        class="rounded-xl border px-3 py-2 text-xs font-semibold transition-all"
        :class="actionFilter === opt.value
          ? 'border-accent-blue/60 bg-accent-blue/15 text-zinc-50'
          : 'border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200'"
        @click="actionFilter = opt.value"
      >
        {{ opt.label }}
      </button>
    </div>

    <div class="mt-5 grid gap-2">
      <p v-if="pending" class="text-sm text-zinc-500">Memuat...</p>
      <GlassCard v-else-if="logs.length === 0" class="p-8 text-center">
        <p class="text-sm font-semibold text-zinc-300">Belum ada aktivitas</p>
        <p class="mt-2 text-sm text-zinc-500">Log akan muncul saat ada login, logout, atau perubahan akun.</p>
      </GlassCard>

      <GlassCard v-for="l in logs" :key="l.id" class="p-4">
        <div class="flex items-start gap-3">
          <div class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border" :class="meta(l.action).iconWrap">
            <component :is="meta(l.action).icon" class="h-5 w-5" />
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <span class="rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide" :class="meta(l.action).badge">
                {{ meta(l.action).label }}
              </span>
              <p class="truncate text-sm font-bold text-zinc-50">
                {{ l.actorName ?? 'Tidak diketahui' }}
                <span v-if="l.actorEmail" class="font-normal text-zinc-500">· {{ l.actorEmail }}</span>
              </p>
            </div>

            <p v-if="l.detail" class="mt-1 text-xs text-zinc-400">{{ l.detail }}</p>

            <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-zinc-600">
              <span>{{ formatDateTime(l.createdAt) }}</span>
              <span v-if="l.ipAddress" class="inline-flex items-center gap-1">
                <Globe class="h-3 w-3" /> {{ l.ipAddress }}
              </span>
              <span v-if="l.userAgent" class="truncate max-w-[280px]" :title="l.userAgent">
                {{ shortUA(l.userAgent) }}
              </span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Globe,
  LogIn,
  LogOut,
  RefreshCw,
  ShieldAlert,
  UserCog,
  UserMinus,
  UserPlus,
} from 'lucide-vue-next'

import Button from '~/components/ui/button/Button.vue'
import GlassCard from '~/components/ui/GlassCard.vue'

definePageMeta({
  layout: 'teacher',
  middleware: 'auth',
})

type ActionCode =
  | 'LOGIN'
  | 'LOGIN_FAILED'
  | 'LOGOUT'
  | 'REGISTER'
  | 'USER_CREATE'
  | 'USER_UPDATE'
  | 'USER_DELETE'

type LogItem = {
  id: number
  action: ActionCode
  detail: string | null
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
  actorName: string | null
  actorEmail: string | null
  actorRole: string | null
}

const actionFilter = ref<'ALL' | ActionCode>('ALL')
const actionFilters: { value: 'ALL' | ActionCode; label: string }[] = [
  { value: 'ALL', label: 'Semua' },
  { value: 'LOGIN', label: 'Login' },
  { value: 'LOGIN_FAILED', label: 'Login Gagal' },
  { value: 'LOGOUT', label: 'Logout' },
  { value: 'REGISTER', label: 'Daftar' },
  { value: 'USER_CREATE', label: 'Buat User' },
  { value: 'USER_UPDATE', label: 'Ubah User' },
  { value: 'USER_DELETE', label: 'Hapus User' },
]

const { data: logs, pending, refresh } = await useFetch<LogItem[]>('/api/activity-logs', {
  default: () => [],
  // useFetch otomatis memuat ulang saat query reaktif ini berubah.
  query: computed(() => (actionFilter.value === 'ALL' ? {} : { action: actionFilter.value })),
})

const META: Record<ActionCode, { label: string; icon: any; iconWrap: string; badge: string }> = {
  LOGIN: {
    label: 'Login', icon: LogIn,
    iconWrap: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    badge: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  },
  LOGIN_FAILED: {
    label: 'Login Gagal', icon: ShieldAlert,
    iconWrap: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
    badge: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
  },
  LOGOUT: {
    label: 'Logout', icon: LogOut,
    iconWrap: 'border-white/10 bg-white/5 text-zinc-300',
    badge: 'border-white/10 bg-white/5 text-zinc-300',
  },
  REGISTER: {
    label: 'Daftar', icon: UserPlus,
    iconWrap: 'border-accent-blue/40 bg-accent-blue/15 text-accent-blue',
    badge: 'border-accent-blue/40 bg-accent-blue/15 text-accent-blue',
  },
  USER_CREATE: {
    label: 'Buat User', icon: UserPlus,
    iconWrap: 'border-accent-blue/40 bg-accent-blue/15 text-accent-blue',
    badge: 'border-accent-blue/40 bg-accent-blue/15 text-accent-blue',
  },
  USER_UPDATE: {
    label: 'Ubah User', icon: UserCog,
    iconWrap: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    badge: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  },
  USER_DELETE: {
    label: 'Hapus User', icon: UserMinus,
    iconWrap: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
    badge: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
  },
}

function meta(action: string) {
  return META[action as ActionCode] ?? {
    label: action, icon: ShieldAlert,
    iconWrap: 'border-white/10 bg-white/5 text-zinc-300',
    badge: 'border-white/10 bg-white/5 text-zinc-300',
  }
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function shortUA(ua: string) {
  // Ambil nama browser yang umum agar ringkas.
  const m = ua.match(/(Edg|OPR|Chrome|Firefox|Safari)\/[\d.]+/)
  if (m) {
    const name = m[1] === 'Edg' ? 'Edge' : m[1] === 'OPR' ? 'Opera' : m[1]
    return name
  }
  return ua.slice(0, 40)
}
</script>
