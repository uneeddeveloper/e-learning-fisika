<template>
  <div class="min-h-screen bg-background">
    <div class="pointer-events-none fixed inset-0">
      <div class="absolute -top-16 left-16 h-60 w-60 rounded-full bg-accent-blue/18 blur-3xl" />
      <div class="absolute top-24 right-10 h-80 w-80 rounded-full bg-accent-indigo/16 blur-3xl" />
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] [background-size:24px_24px] opacity-[0.22]" />
    </div>

    <header class="relative mx-auto max-w-[1200px] px-4 pt-6">
      <div class="glass-card border-glow rounded-3xl px-4 py-3">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <NuxtLink to="/courses" class="flex items-center gap-3 rounded-2xl px-2 py-1 transition-colors hover:bg-white/5">
            <div class="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5">
              <Atom class="h-5 w-5 text-zinc-100" />
            </div>
            <div>
              <p class="text-sm font-extrabold tracking-tight text-zinc-50">E-Learning Fisika</p>
              <p class="text-xs text-zinc-500">Space-Science UI Prototype</p>
            </div>
          </NuxtLink>

          <nav class="flex flex-wrap items-center gap-2">
            <NavPill to="/courses" :active="route.path.startsWith('/courses')">Courses</NavPill>
            <NavPill to="/teacher" :active="route.path.startsWith('/teacher')">Teacher</NavPill>
            <NavPill to="/auth/login" :active="route.path.startsWith('/auth')">Masuk</NavPill>
            <NavPill to="/frontend" :active="route.path.startsWith('/frontend')">Dev</NavPill>
            <NavPill to="/backend" :active="route.path.startsWith('/backend')">API</NavPill>
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
import { defineComponent, h, resolveComponent } from 'vue'
import { Atom } from 'lucide-vue-next'
import { useRoute } from 'vue-router'

const route = useRoute()

const NavPill = defineComponent({
  props: {
    to: { type: String, required: true },
    active: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    return () => h(resolveComponent('NuxtLink') as any, {
      to: props.to,
      class: [
        'rounded-2xl px-4 py-2 text-sm font-semibold transition-colors',
        props.active
          ? 'bg-white/6 border border-white/10 text-zinc-50'
          : 'text-zinc-300 hover:bg-white/5',
      ],
    }, slots.default ? slots.default() : '')
  },
})
</script>

