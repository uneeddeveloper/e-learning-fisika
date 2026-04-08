<template>
  <div>
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-xs font-semibold tracking-wide text-zinc-500">Courses</p>
        <h1 class="mt-1 text-2xl font-extrabold tracking-tight text-zinc-50">
          Jelajahi materi fisika
        </h1>
        <p class="mt-2 max-w-2xl text-sm text-zinc-400">
          Gallery yang breathable: whitespace rapi, card super-rounded, dan progress bar custom.
        </p>
      </div>
    </div>

    <!-- Glass Search Bar -->
    <div class="mt-6">
      <div
        class="glass-card border-glow mx-auto flex max-w-2xl items-center gap-3 rounded-3xl px-4 py-3 transition-all duration-200"
        :class="isFocus ? 'border-accent-blue/50 shadow-glow-blue' : ''"
      >
        <div class="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5">
          <Search class="h-4 w-4 text-zinc-100" />
        </div>
        <Input
          v-model="query"
          class="h-12 flex-1 border-0 bg-transparent px-0 focus:ring-0"
          placeholder="Cari: Newton, Gelombang, Termodinamika..."
          @focus="isFocus = true"
          @blur="isFocus = false"
        />
        <Button variant="secondary" size="sm" class="hidden sm:inline-flex">
          Filter
          <SlidersHorizontal class="h-4 w-4" />
        </Button>
      </div>
    </div>

    <!-- Course Grid -->
    <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="c in filteredCourses"
        :key="c.id"
        :to="`/courses/${c.id}`"
        class="block"
      >
        <GlassCard class="p-6">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <p class="text-xs font-semibold tracking-wide text-zinc-500">
              {{ c.level }}
            </p>
            <h2 class="mt-2 truncate text-lg font-extrabold tracking-tight text-zinc-50">
              {{ c.title }}
            </h2>
            <p class="mt-2 line-clamp-2 text-sm text-zinc-400">
              {{ c.description }}
            </p>
          </div>

          <div class="relative grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/5">
            <div class="pointer-events-none absolute inset-0 rounded-2xl opacity-80 blur-xl" :class="c.tone === 'indigo' ? 'bg-accent-indigo/25' : 'bg-accent-blue/20'" />
            <component :is="c.icon" class="relative h-5 w-5 text-zinc-50" />
          </div>
        </div>

        <div class="mt-5">
          <div class="flex items-center justify-between">
            <p class="text-xs font-semibold text-zinc-500">Progress</p>
            <p class="text-xs font-semibold text-zinc-300">{{ c.progress }}%</p>
          </div>

          <div class="mt-2 h-2 rounded-full bg-white/5 border border-white/10 overflow-hidden">
            <div
              class="h-full rounded-full bg-gradient-to-r from-accent-blue to-accent-indigo transition-all duration-500"
              :style="{ width: `${c.progress}%` }"
            />
          </div>

          <div class="mt-4 flex items-center justify-between">
            <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-300">
              {{ c.lessons }} lessons
            </span>
            <Button size="sm" class="pointer-events-none">
              Continue
              <ArrowRight class="h-4 w-4" />
            </Button>
          </div>
        </div>
        </GlassCard>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ArrowRight,
  Search,
  SlidersHorizontal,
} from 'lucide-vue-next'

import Button from '~/components/ui/button/Button.vue'
import GlassCard from '~/components/ui/GlassCard.vue'
import Input from '~/components/ui/input/Input.vue'
import { useCourses } from '~/composables/useCourses'

definePageMeta({
  layout: 'student',
})

type Tone = 'blue' | 'indigo'

const query = ref('')
const isFocus = ref(false)

const { courses } = useCourses()

const filteredCourses = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return courses
  return courses.filter((c) =>
    [c.title, c.description, c.level].some((v) => v.toLowerCase().includes(q)),
  )
})
</script>

