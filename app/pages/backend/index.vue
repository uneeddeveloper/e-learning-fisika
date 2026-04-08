<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-xs font-semibold tracking-wide text-zinc-500">Backend Layer</p>
        <h1 class="mt-1 text-2xl font-extrabold tracking-tight text-zinc-50">{{ currentMenu?.label }}</h1>
      </div>
      <span class="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-300">
        Server Side · SSR
      </span>
    </div>

    <div class="grid gap-4 lg:grid-cols-[220px_1fr]">
      <GlassCard class="p-4">
        <nav class="space-y-2">
          <button
            v-for="item in menu"
            :key="item.id"
            class="w-full rounded-2xl border px-3 py-2 text-left text-sm font-semibold transition-colors"
            :class="active === item.id ? 'border-accent-indigo/40 bg-accent-indigo/14 text-zinc-50' : 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/6'"
            @click="active = item.id"
          >
            {{ item.icon }} {{ item.label }}
          </button>
        </nav>
      </GlassCard>

      <div class="space-y-4">
        <div v-if="active === 'server'" class="grid gap-4 md:grid-cols-2">
          <GlassCard class="p-5">
            <h3 class="text-sm font-bold text-zinc-100">Nitro Server Info</h3>
            <p class="mt-2 text-xs text-zinc-500">Sumber: GET `/api/info`.</p>
            <div class="mt-4 space-y-2">
              <p v-if="infoPending" class="text-xs text-zinc-500">fetching server info...</p>
              <div v-else class="space-y-2">
                <div v-for="(val, key) in infoData" :key="key" class="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <span class="text-xs text-zinc-500">{{ key }}</span>
                  <span class="max-w-[60%] truncate text-xs font-semibold text-zinc-200">{{ typeof val === 'object' ? JSON.stringify(val) : val }}</span>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard class="p-5">
            <h3 class="text-sm font-bold text-zinc-100">Nitro Routes</h3>
            <div class="mt-4 space-y-2">
              <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs"><span class="font-bold text-emerald-300">GET</span> <span class="text-zinc-200">/api/ping</span> <span class="text-zinc-500">→ server/api/ping.get.ts</span></div>
              <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs"><span class="font-bold text-emerald-300">GET</span> <span class="text-zinc-200">/api/info</span> <span class="text-zinc-500">→ server/api/info.get.ts</span></div>
            </div>
          </GlassCard>
        </div>

        <div v-if="active === 'database'" class="grid gap-4 md:grid-cols-2">
          <GlassCard class="p-5">
            <h3 class="text-sm font-bold text-zinc-100">Prisma Models</h3>
            <div class="mt-4 space-y-2">
              <div v-for="model in models" :key="model.name" class="rounded-xl border border-white/10 bg-white/5 p-3">
                <div class="flex items-center justify-between gap-3">
                  <p class="text-xs font-bold text-zinc-100">{{ model.name }}</p>
                  <p class="text-xs text-zinc-500">{{ model.table }}</p>
                </div>
                <div class="mt-2 flex flex-wrap gap-1">
                  <span v-for="field in model.fields" :key="field" class="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-zinc-300">{{ field }}</span>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard class="p-5">
            <h3 class="text-sm font-bold text-zinc-100">Database Connection</h3>
            <div class="mt-4 space-y-2">
              <div class="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs"><span class="text-zinc-500">Provider</span><span class="text-zinc-200">PostgreSQL (Supabase)</span></div>
              <div class="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs"><span class="text-zinc-500">Pooler</span><span class="text-zinc-200">Transaction :6543</span></div>
              <div class="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs"><span class="text-zinc-500">Region</span><span class="text-zinc-200">ap-southeast-1</span></div>
              <div class="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs"><span class="text-zinc-500">ORM</span><span class="text-zinc-200">Prisma v7</span></div>
            </div>
          </GlassCard>
        </div>

        <div v-if="active === 'middleware'">
          <GlassCard class="p-5">
            <h3 class="text-sm font-bold text-zinc-100">Middleware Flow</h3>
            <div class="mt-4 grid gap-2 md:grid-cols-4">
              <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-center text-xs text-zinc-200">Request</div>
              <div class="rounded-xl border border-accent-blue/25 bg-accent-blue/10 px-3 py-3 text-center text-xs text-zinc-100">dev-badge.ts</div>
              <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-center text-xs text-zinc-200">Route Handler</div>
              <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-center text-xs text-zinc-200">Response</div>
            </div>
            <div class="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
              <p class="text-xs text-zinc-500">Injected headers:</p>
              <p class="mt-2 text-xs text-zinc-200">`X-Rendered-By: Nuxt Backend (Nitro)`</p>
              <p class="mt-1 text-xs text-zinc-200">`X-Layer: server`</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import GlassCard from '~/components/ui/GlassCard.vue'

const active = ref('server')

const menu = [
  { id: 'server', label: 'Server Info', icon: '🖥️' },
  { id: 'database', label: 'Database', icon: '🗄️' },
  { id: 'middleware', label: 'Middleware', icon: '🔧' },
]

const currentMenu = computed(() => menu.find(m => m.id === active.value))

const { data: infoData, pending: infoPending } = await useFetch('/api/info')

const models = [
  { name: 'User', table: 'users', fields: ['id', 'name', 'email', 'role'] },
  { name: 'Course', table: 'courses', fields: ['id', 'title', 'description', 'isPublished'] },
  { name: 'Lesson', table: 'lessons', fields: ['id', 'courseId', 'title', 'type', 'order'] },
  { name: 'Enrollment', table: 'enrollments', fields: ['id', 'userId', 'courseId', 'progress'] },
  { name: 'Quiz', table: 'quizzes', fields: ['id', 'lessonId', 'question'] },
]
</script>
