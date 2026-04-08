<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-xs font-semibold tracking-wide text-zinc-500">Frontend Layer</p>
        <h1 class="mt-1 text-2xl font-extrabold tracking-tight text-zinc-50">{{ currentMenu?.label }}</h1>
      </div>
      <span class="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-300">
        Client Side · {{ time }}
      </span>
    </div>

    <div class="grid gap-4 lg:grid-cols-[220px_1fr]">
      <GlassCard class="p-4">
        <nav class="space-y-2">
          <button
            v-for="item in menu"
            :key="item.id"
            class="w-full rounded-2xl border px-3 py-2 text-left text-sm font-semibold transition-colors"
            :class="active === item.id ? 'border-accent-blue/40 bg-accent-blue/14 text-zinc-50' : 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/6'"
            @click="active = item.id"
          >
            {{ item.icon }} {{ item.label }}
          </button>
        </nav>
      </GlassCard>

      <div class="space-y-4">
        <div v-if="active === 'reactivity'" class="grid gap-4 md:grid-cols-2">
          <GlassCard class="p-5">
            <h3 class="text-sm font-bold text-zinc-100">Reaktivitas Vue 3</h3>
            <p class="mt-2 text-xs text-zinc-500">State berubah real-time tanpa reload.</p>
            <div class="mt-4 flex items-center justify-center gap-3">
              <Button variant="secondary" size="sm" @click="count--">−</Button>
              <div class="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-center">
                <p class="text-2xl font-extrabold text-zinc-50">{{ count }}</p>
                <p class="text-xs text-zinc-500">klik</p>
              </div>
              <Button size="sm" @click="count++">+</Button>
            </div>
            <div class="mt-4 h-2 overflow-hidden rounded-full border border-white/10 bg-white/5">
              <div class="h-full bg-gradient-to-r from-accent-blue to-accent-indigo" :style="{ width: `${Math.min(count * 10, 100)}%` }" />
            </div>
            <p class="mt-3 text-xs text-zinc-400">{{ counterMessage }}</p>
          </GlassCard>

          <GlassCard class="p-5">
            <h3 class="text-sm font-bold text-zinc-100">Computed: Newton II</h3>
            <p class="mt-2 text-xs text-zinc-500">F = m × a</p>
            <div class="mt-4 grid gap-3">
              <Input v-model="massInput" type="number" placeholder="Massa (kg)" />
              <Input v-model="accelerationInput" type="number" placeholder="Percepatan (m/s²)" />
            </div>
            <div class="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p class="text-xs text-zinc-500">Result</p>
              <p class="text-xl font-extrabold text-zinc-50">{{ force }} N</p>
            </div>
          </GlassCard>
        </div>

        <div v-if="active === 'composable'" class="grid gap-4 md:grid-cols-2">
          <GlassCard class="p-5">
            <h3 class="text-sm font-bold text-zinc-100">useFetch(`/api/ping`)</h3>
            <p class="mt-2 text-xs text-zinc-500">Fetch data backend secara declarative.</p>
            <div class="mt-4 space-y-2">
              <p v-if="fetchPending" class="text-xs text-zinc-500">Fetching...</p>
              <div v-else class="space-y-2">
                <div v-for="(val, key) in pingData" :key="key" class="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <span class="text-xs text-zinc-500">{{ key }}</span>
                  <span class="text-xs font-semibold text-zinc-200">{{ val }}</span>
                </div>
              </div>
            </div>
            <div class="mt-4">
              <Button variant="secondary" size="sm" @click="refresh()">Refresh</Button>
            </div>
          </GlassCard>

          <GlassCard class="p-5">
            <h3 class="text-sm font-bold text-zinc-100">Runtime Config</h3>
            <div class="mt-4 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
              <p class="text-xs text-zinc-500">SUPABASE_URL</p>
              <p class="mt-1 text-xs font-semibold text-zinc-300">{{ maskedUrl }}</p>
            </div>
          </GlassCard>
        </div>

        <div v-if="active === 'routing'">
          <GlassCard class="p-5">
            <h3 class="text-sm font-bold text-zinc-100">File-based Routing</h3>
            <p class="mt-2 text-xs text-zinc-500">Folder `app/pages/` otomatis menjadi route.</p>
            <div class="mt-4 space-y-2">
              <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300">`/` -> `app/pages/index.vue`</div>
              <div class="rounded-xl border border-accent-blue/30 bg-accent-blue/10 px-3 py-2 text-xs font-semibold text-zinc-100">`/frontend` -> current route</div>
              <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300">`/backend` -> `app/pages/backend/index.vue`</div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Button from '~/components/ui/button/Button.vue'
import GlassCard from '~/components/ui/GlassCard.vue'
import Input from '~/components/ui/input/Input.vue'

const active = ref('reactivity')
const count = ref(0)
const massInput = ref('')
const accelerationInput = ref('')
const config = useRuntimeConfig()

const menu = [
  { id: 'reactivity', label: 'Reaktivitas', icon: '⚡' },
  { id: 'composable', label: 'Composables', icon: '🔗' },
  { id: 'routing', label: 'Routing', icon: '🗺️' },
]

const currentMenu = computed(() => menu.find(m => m.id === active.value))

const force = computed(() => {
  const mass = Number(massInput.value)
  const acceleration = Number(accelerationInput.value)
  if (!Number.isNaN(mass) && !Number.isNaN(acceleration) && mass > 0 && acceleration > 0) {
    return (mass * acceleration).toFixed(2)
  }
  return '?'
})

const counterMessage = computed(() => {
  if (count.value === 0) return 'Coba klik tombol di atas!'
  if (count.value < 5) return 'Terus klik...'
  if (count.value < 10) return 'Bagus! State berubah real-time.'
  return '🎉 Keren! Ini kekuatan Vue reaktivitas.'
})

const maskedUrl = computed(() => {
  const url = config.public.supabaseUrl as string
  return url ? url.replace(/^(https:\/\/.{8}).*/, '$1...') : 'tidak diset'
})

const { data: pingData, pending: fetchPending, refresh } = await useFetch('/api/ping')

const time = ref('')
onMounted(() => {
  const update = () => { time.value = new Date().toLocaleTimeString('id-ID') }
  update()
  setInterval(update, 1000)
})
</script>
