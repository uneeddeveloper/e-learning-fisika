<template>
  <div class="min-h-screen bg-background">
    <div class="pointer-events-none fixed inset-0">
      <div class="absolute -top-20 left-12 h-56 w-56 rounded-full bg-accent-blue/18 blur-3xl" />
      <div class="absolute top-24 right-16 h-72 w-72 rounded-full bg-accent-indigo/18 blur-3xl" />
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] [background-size:26px_26px] opacity-[0.22]" />
    </div>

    <header class="relative mx-auto max-w-[1200px] px-4 pt-6">
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
              Courses
            </NuxtLink>
            <NuxtLink
              to="/teacher"
              class="rounded-2xl px-4 py-2 text-sm font-semibold transition-colors"
              :class="route.path.startsWith('/teacher') ? 'bg-white/6 border border-white/10 text-zinc-50' : 'text-zinc-300 hover:bg-white/5'"
            >
              Teacher
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
import { useRoute } from 'vue-router'
import { Atom } from 'lucide-vue-next'

const route = useRoute()
</script>

