<template>
  <div class="min-h-screen bg-background">
    <div class="pointer-events-none fixed inset-0">
      <div class="absolute -top-20 left-12 h-56 w-56 rounded-full bg-accent-blue/18 blur-3xl" />
      <div class="absolute top-24 right-16 h-72 w-72 rounded-full bg-accent-indigo/18 blur-3xl" />
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] [background-size:26px_26px] opacity-[0.22]" />
    </div>

    <header class="sticky top-0 z-50 mx-auto max-w-[1200px] px-4 pb-2 pt-4">
      <div class="glass-card border-glow rounded-3xl px-4 py-3">
        <div class="flex items-center justify-between gap-4">
          <NuxtLink to="/courses" class="flex items-center gap-3 rounded-2xl px-2 py-1 transition-colors hover:bg-white/5">
            <div class="grid h-10 w-10 place-items-center rounded-2xl bg-white/5 border border-white/10">
              <Atom class="h-5 w-5 text-zinc-50" />
            </div>
            <div class="min-w-0">
              <p class="text-sm font-extrabold tracking-tight text-zinc-50">E-Learning Fisika</p>
              <p class="text-xs text-zinc-500">Student experience</p>
            </div>
          </NuxtLink>

          <nav class="flex items-center gap-2">
            <NuxtLink
              to="/courses"
              class="rounded-2xl px-4 py-2 text-sm font-semibold transition-colors"
              :class="route.path.startsWith('/courses') ? 'bg-white/6 border border-white/10 text-zinc-50' : 'text-zinc-300 hover:bg-white/5'"
            >
              Materi
            </NuxtLink>
            <NuxtLink
              to="/lab"
              class="inline-flex items-center gap-1.5 rounded-2xl px-4 py-2 text-sm font-semibold transition-colors"
              :class="route.path.startsWith('/lab') ? 'bg-white/6 border border-white/10 text-zinc-50' : 'text-zinc-300 hover:bg-white/5'"
            >
              <FlaskConical class="h-4 w-4" />
              Lab
            </NuxtLink>
            <NuxtLink
              v-if="isTeacher"
              to="/teacher"
              class="rounded-2xl px-4 py-2 text-sm font-semibold transition-colors"
              :class="route.path.startsWith('/teacher') ? 'bg-white/6 border border-white/10 text-zinc-50' : 'text-zinc-300 hover:bg-white/5'"
            >
              Teacher
            </NuxtLink>

            <div v-if="loggedIn" class="ml-2 hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 sm:flex">
              <div class="grid h-7 w-7 place-items-center rounded-xl bg-white/10 text-xs font-bold text-zinc-50">
                {{ userInitial }}
              </div>
              <div class="min-w-0">
                <p class="truncate text-xs font-semibold text-zinc-100">{{ user?.name ?? 'Guest' }}</p>
                <p class="text-[10px] uppercase tracking-wide text-zinc-500">{{ user?.role ?? '' }}</p>
              </div>
            </div>

            <button
              v-if="loggedIn"
              type="button"
              class="inline-flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-zinc-300 transition-colors hover:bg-rose-500/10 hover:text-rose-300 hover:border-rose-500/30"
              :disabled="loggingOut"
              @click="handleLogout"
            >
              <LogOut class="h-4 w-4" />
              <span class="hidden sm:inline">{{ loggingOut ? 'Keluar...' : 'Logout' }}</span>
            </button>
            <NuxtLink
              v-else
              to="/auth/login"
              class="inline-flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-zinc-300 transition-colors hover:bg-accent-blue/15 hover:text-zinc-50 hover:border-accent-blue/35"
            >
              <LogIn class="h-4 w-4" />
              <span class="hidden sm:inline">Login</span>
            </NuxtLink>
          </nav>
        </div>
      </div>
    </header>

    <main class="relative mx-auto max-w-[1200px] px-4 pb-10 pt-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Atom, FlaskConical, LogIn, LogOut } from 'lucide-vue-next'

const route = useRoute()
const { user, loggedIn, clear } = useUserSession()

const isTeacher = computed(() => {
  const role = (user.value as any)?.role
  return role === 'TEACHER' || role === 'ADMIN'
})

const userInitial = computed(() => {
  const name = (user.value as any)?.name ?? ''
  return name ? name.charAt(0).toUpperCase() : '?'
})

const loggingOut = ref(false)
async function handleLogout() {
  if (loggingOut.value) return
  loggingOut.value = true
  try {
    await clear()
    await navigateTo('/auth/login')
  } finally {
    loggingOut.value = false
  }
}
</script>

