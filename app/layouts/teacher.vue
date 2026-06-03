<template>
  <div class="min-h-screen bg-background">
    <div class="pointer-events-none fixed inset-0">
      <div class="absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-accent-indigo/20 blur-3xl" />
      <div class="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent-blue/18 blur-3xl" />
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] [background-size:24px_24px] opacity-[0.25]" />
    </div>

    <div class="relative mx-auto max-w-[1200px] px-4 py-6">
      <div class="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside class="lg:sticky lg:top-6 lg:h-[calc(100vh-48px)]">
          <div class="glass-card border-glow rounded-3xl p-4">
            <div class="flex items-center justify-between gap-3 px-2 py-2">
              <div class="min-w-0">
                <p class="text-sm font-extrabold tracking-tight text-zinc-50">Teacher Portal</p>
                <p class="text-xs text-zinc-400">Space-Science prototype</p>
              </div>
              <div class="grid h-10 w-10 place-items-center rounded-2xl bg-white/5 border border-white/10">
                <GraduationCap class="h-5 w-5 text-zinc-50" />
              </div>
            </div>

            <nav class="mt-3 space-y-1">
              <NuxtLink
                to="/teacher"
                class="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-semibold transition-colors"
                :class="route.path === '/teacher' ? 'bg-white/6 text-zinc-50 border border-white/10' : 'text-zinc-300 hover:bg-white/5'"
              >
                <LayoutDashboard class="h-4 w-4" />
                Dashboard
              </NuxtLink>
              <NuxtLink
                to="/courses"
                class="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-semibold transition-colors"
                :class="route.path.startsWith('/courses') ? 'bg-white/6 text-zinc-50 border border-white/10' : 'text-zinc-300 hover:bg-white/5'"
              >
                <LibraryBig class="h-4 w-4" />
                Student Gallery
              </NuxtLink>
              <NuxtLink
                to="/teacher/latihan"
                class="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-semibold transition-colors"
                :class="route.path.startsWith('/teacher/latihan') ? 'bg-white/6 text-zinc-50 border border-white/10' : 'text-zinc-300 hover:bg-white/5'"
              >
                <ClipboardList class="h-4 w-4" />
                Soal Latihan
              </NuxtLink>
              <NuxtLink
                to="/lab"
                class="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-semibold transition-colors"
                :class="route.path.startsWith('/lab') ? 'bg-white/6 text-zinc-50 border border-white/10' : 'text-zinc-300 hover:bg-white/5'"
              >
                <FlaskConical class="h-4 w-4" />
                Virtual Lab
              </NuxtLink>
            </nav>

            <div class="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
              <div class="flex items-center gap-2.5">
                <div class="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-sm font-bold text-zinc-50">
                  {{ userInitial }}
                </div>
                <div class="min-w-0">
                  <p class="truncate text-xs font-semibold text-zinc-100">{{ user?.name ?? 'Guest' }}</p>
                  <p class="text-[10px] uppercase tracking-wide text-zinc-500">{{ user?.role ?? '' }}</p>
                </div>
              </div>
              <button
                type="button"
                class="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-300 transition-colors hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-300"
                :disabled="loggingOut"
                @click="handleLogout"
              >
                <LogOut class="h-3.5 w-3.5" />
                {{ loggingOut ? 'Keluar...' : 'Logout' }}
              </button>
            </div>
          </div>
        </aside>

        <main>
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ClipboardList, FlaskConical, GraduationCap, LayoutDashboard, LibraryBig, LogOut } from 'lucide-vue-next'

const route = useRoute()
const { user, clear } = useUserSession()

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

