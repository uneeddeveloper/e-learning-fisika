<template>
  <div>
    <NuxtLink
      to="/teacher/worksheet"
      class="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-300 transition-colors hover:bg-white/6"
    >
      <ArrowLeft class="h-4 w-4" />
      Kembali ke daftar
    </NuxtLink>

    <div class="mt-4 flex flex-wrap items-end justify-between gap-4">
      <div class="min-w-0">
        <p class="text-xs font-semibold tracking-wide text-zinc-500">Hasil Worksheet</p>
        <h1 class="mt-1 truncate text-2xl font-extrabold tracking-tight text-zinc-50">
          {{ labTitle }}
        </h1>
        <p class="mt-1 text-sm text-zinc-400">{{ submissions.length }} siswa mengirim</p>
      </div>
      <Button variant="ghost" size="sm" :disabled="pending" @click="() => refresh()">
        <RotateCw class="h-4 w-4" />
        Refresh
      </Button>
    </div>

    <div class="mt-6 space-y-3">
      <p v-if="pending" class="text-sm text-zinc-500">Memuat...</p>
      <GlassCard v-else-if="!submissions.length" class="p-8 text-center">
        <p class="text-sm font-semibold text-zinc-300">Belum ada yang mengirim</p>
        <p class="mt-2 text-sm text-zinc-500">Hasil worksheet untuk lab ini masih kosong.</p>
      </GlassCard>

      <GlassCard v-for="s in submissions" :key="s.id" class="p-5">
        <button
          type="button"
          class="flex w-full items-center justify-between gap-3 text-left"
          @click="toggle(s.id)"
        >
          <div class="flex items-center gap-3">
            <div class="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-sm font-bold text-zinc-100">
              {{ initial(s.user.name) }}
            </div>
            <div class="min-w-0">
              <p class="font-bold text-zinc-50">{{ s.user.name }}</p>
              <p class="text-xs text-zinc-500">{{ s.user.email }} · {{ formatDateTime(s.updatedAt) }}</p>
            </div>
          </div>
          <ChevronDown
            class="h-5 w-5 shrink-0 text-zinc-500 transition-transform"
            :class="open[s.id] ? 'rotate-180' : ''"
          />
        </button>

        <div v-if="open[s.id]" class="mt-4 space-y-3 border-t border-white/10 pt-4">
          <div
            v-for="(a, idx) in s.answers"
            :key="a.questionId"
            class="rounded-2xl border border-white/10 bg-white/3 p-4"
          >
            <p class="text-sm font-semibold text-zinc-200">
              <span class="text-zinc-500">{{ idx + 1 }}.</span> {{ a.prompt }}
            </p>
            <p class="mt-2 whitespace-pre-wrap rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100">
              {{ a.answer || '—' }}
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, ChevronDown, RotateCw } from 'lucide-vue-next'

import Button from '~/components/ui/button/Button.vue'
import GlassCard from '~/components/ui/GlassCard.vue'

definePageMeta({
  layout: 'teacher',
  middleware: 'auth',
})

type Answer = { questionId: string; prompt: string; answer: string }
type Submission = {
  id: number
  labSlug: string
  labTitle: string
  answers: Answer[]
  submittedAt: string
  updatedAt: string
  user: { id: number; name: string; email: string }
}
type Payload = { summary: unknown[]; submissions: Submission[] }

const route = useRoute()
const slug = route.params.slug

const { data, pending, refresh } = await useFetch<Payload>('/api/labs/submissions', {
  query: { slug },
  default: () => ({ summary: [], submissions: [] }),
})

const submissions = computed(() => data.value?.submissions ?? [])
const labTitle = computed(() => submissions.value[0]?.labTitle ?? String(slug))

const open = reactive<Record<number, boolean>>({})
function toggle(id: number) {
  open[id] = !open[id]
}

function initial(name: string) {
  return name ? name.charAt(0).toUpperCase() : '?'
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}
</script>
