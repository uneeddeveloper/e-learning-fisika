<template>
  <div v-if="course">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div class="min-w-0">
        <NuxtLink to="/courses" class="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-300 transition-colors hover:bg-white/6">
          <ArrowLeft class="h-4 w-4" />
          Back to courses
        </NuxtLink>

        <p class="mt-4 text-xs font-semibold tracking-wide text-zinc-500">{{ course.level }}</p>
        <h1 class="mt-1 text-2xl font-extrabold tracking-tight text-zinc-50">
          {{ course.title }}
        </h1>
        <p class="mt-2 max-w-2xl text-sm text-zinc-400">
          {{ course.description }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <Button variant="secondary" size="md">
          <Bookmark class="h-4 w-4" />
          Save
        </Button>
        <Button size="md">
          <Play class="h-4 w-4" />
          Continue
        </Button>
      </div>
    </div>

    <div class="mt-6 grid gap-4 lg:grid-cols-12">
      <div class="lg:col-span-8">
        <GlassCard class="p-6">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <h2 class="text-lg font-extrabold tracking-tight text-zinc-50">Learning Path</h2>
              <p class="mt-1 text-sm text-zinc-500">Modules yang tersusun untuk flow belajar cepat.</p>
            </div>
            <div class="relative grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/5">
              <div class="pointer-events-none absolute inset-0 rounded-2xl opacity-80 blur-xl" :class="course.tone === 'indigo' ? 'bg-accent-indigo/25' : 'bg-accent-blue/20'" />
              <component :is="course.icon" class="relative h-5 w-5 text-zinc-50" />
            </div>
          </div>

          <div class="mt-5 space-y-2">
            <button
              v-for="m in course.modules"
              :key="m.id"
              type="button"
              class="group/module w-full rounded-2xl border border-white/10 bg-white/3 px-4 py-3 text-left transition-all duration-200 hover:bg-white/5 hover:border-accent-blue/35"
            >
              <div class="flex items-center justify-between gap-3">
                <div class="flex min-w-0 items-center gap-3">
                  <div class="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5">
                    <component :is="moduleIcon(m.type)" class="h-4 w-4 text-zinc-50" />
                  </div>
                  <div class="min-w-0">
                    <p class="truncate text-sm font-bold text-zinc-50">
                      {{ m.title }}
                    </p>
                    <p class="mt-0.5 text-xs text-zinc-500">
                      {{ moduleLabel(m.type) }} · {{ m.duration }}
                    </p>
                  </div>
                </div>
                <ChevronRight class="h-4 w-4 text-zinc-600 transition-transform duration-200 group-hover/module:translate-x-0.5" />
              </div>
            </button>
          </div>
        </GlassCard>
      </div>

      <div class="lg:col-span-4">
        <GlassCard class="p-6">
          <h2 class="text-lg font-extrabold tracking-tight text-zinc-50">Progress</h2>
          <p class="mt-1 text-sm text-zinc-500">Tetap smooth, tanpa noise visual.</p>

          <div class="mt-4">
            <div class="flex items-center justify-between">
              <p class="text-xs font-semibold text-zinc-500">Completion</p>
              <p class="text-xs font-semibold text-zinc-300">{{ course.progress }}%</p>
            </div>
            <div class="mt-2 h-2 rounded-full bg-white/5 border border-white/10 overflow-hidden">
              <div
                class="h-full rounded-full bg-gradient-to-r from-accent-blue to-accent-indigo transition-all duration-500"
                :style="{ width: `${course.progress}%` }"
              />
            </div>
          </div>

          <div class="mt-5 grid gap-2">
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs font-semibold text-zinc-300">Next up</p>
              <p class="mt-1 text-sm font-bold text-zinc-50">
                {{ course.modules[0]?.title ?? '—' }}
              </p>
              <p class="mt-1 text-xs text-zinc-500">Recommended based on your pace.</p>
            </div>

            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs font-semibold text-zinc-300">Achievement</p>
              <div class="mt-2 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(16,185,129,0.15),0_18px_50px_rgba(16,185,129,0.10)]">
                    <Award class="h-4 w-4 text-zinc-50" />
                  </div>
                  <div>
                    <p class="text-sm font-bold text-zinc-50">Consistency</p>
                    <p class="text-xs text-zinc-500">3-day streak</p>
                  </div>
                </div>
                <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-emerald-300">
                  +120 XP
                </span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  </div>

  <div v-else class="mx-auto max-w-2xl">
    <GlassCard class="p-8">
      <p class="text-sm font-semibold text-zinc-300">Course not found</p>
      <p class="mt-2 text-sm text-zinc-500">Periksa URL course id atau kembali ke gallery.</p>
      <div class="mt-4">
        <NuxtLink to="/courses">
          <Button size="md">
            <ArrowLeft class="h-4 w-4" />
            Back to courses
          </Button>
        </NuxtLink>
      </div>
    </GlassCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowLeft,
  Award,
  Bookmark,
  ChevronRight,
  FileText,
  HelpCircle,
  Play,
  Video,
} from 'lucide-vue-next'

import Button from '~/components/ui/button/Button.vue'
import GlassCard from '~/components/ui/GlassCard.vue'
import { useCourses } from '~/composables/useCourses'

definePageMeta({
  layout: 'student',
  middleware: 'auth',
})

const route = useRoute()
const { courses } = useCourses()

const course = computed(() => courses.find(c => c.id === String(route.params.id)))

function moduleLabel(type: 'video' | 'reading' | 'quiz') {
  if (type === 'video') return 'Video'
  if (type === 'reading') return 'Reading'
  return 'Quiz'
}

function moduleIcon(type: 'video' | 'reading' | 'quiz') {
  if (type === 'video') return Video
  if (type === 'reading') return FileText
  return HelpCircle
}
</script>

