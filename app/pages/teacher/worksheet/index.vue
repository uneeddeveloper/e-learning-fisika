<template>
  <div>
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-xs font-semibold tracking-wide text-zinc-500">Teacher · Virtual Lab</p>
        <h1 class="mt-1 text-2xl font-extrabold tracking-tight text-zinc-50">
          Hasil Worksheet Lab
        </h1>
        <p class="mt-2 max-w-2xl text-sm text-zinc-400">
          Jawaban worksheet yang dikirim siswa setelah mengerjakan simulasi lab.
        </p>
      </div>
      <Button variant="ghost" size="sm" :disabled="pending" @click="() => refresh()">
        <RotateCw class="h-4 w-4" />
        Refresh
      </Button>
    </div>

    <div class="mt-6 grid gap-3">
      <p v-if="pending" class="text-sm text-zinc-500">Memuat...</p>
      <GlassCard v-else-if="!data?.summary?.length" class="p-8 text-center">
        <p class="text-sm font-semibold text-zinc-300">Belum ada worksheet masuk</p>
        <p class="mt-2 text-sm text-zinc-500">Hasil akan muncul di sini setelah siswa mengirim worksheet dari halaman Lab.</p>
      </GlassCard>

      <NuxtLink
        v-for="item in data?.summary ?? []"
        :key="item.labSlug"
        :to="`/teacher/worksheet/${item.labSlug}`"
        class="group block"
      >
        <GlassCard class="p-5 transition-all duration-200 group-hover:border-accent-blue/35">
          <div class="flex items-center justify-between gap-4">
            <div class="min-w-0">
              <p class="truncate text-base font-bold text-zinc-50">{{ item.labTitle }}</p>
              <p class="mt-1 text-xs text-zinc-500">
                {{ item.count }} siswa mengirim · terakhir {{ formatDateTime(item.lastAt) }}
              </p>
            </div>
            <div class="flex items-center gap-3">
              <span class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-bold text-zinc-100">
                <Users class="h-4 w-4 text-zinc-400" />
                {{ item.count }}
              </span>
              <ChevronRight class="h-4 w-4 text-zinc-600 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </GlassCard>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronRight, RotateCw, Users } from 'lucide-vue-next'

import Button from '~/components/ui/button/Button.vue'
import GlassCard from '~/components/ui/GlassCard.vue'

definePageMeta({
  layout: 'teacher',
  middleware: 'auth',
})

type Summary = { labSlug: string; labTitle: string; count: number; lastAt: string }
type Payload = { summary: Summary[]; submissions: unknown[] }

const { data, pending, refresh } = await useFetch<Payload>('/api/labs/submissions', {
  default: () => ({ summary: [], submissions: [] }),
})

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}
</script>
