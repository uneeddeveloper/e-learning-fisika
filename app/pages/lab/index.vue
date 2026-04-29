<template>
  <div>
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-xs font-semibold tracking-wide text-zinc-500">Virtual Lab</p>
        <h1 class="mt-1 text-2xl font-extrabold tracking-tight text-zinc-50">
          Laboratorium fisika interaktif
        </h1>
        <p class="mt-2 max-w-2xl text-sm text-zinc-400">
          Eksperimen tanpa alat — ubah variabel, amati hasil, kerjakan worksheet, dan kuatkan pemahaman konsep.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-300">
          {{ labs.length }} simulasi
        </span>
      </div>
    </div>

    <!-- Search + filter -->
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
          placeholder="Cari: parabola, gelombang, rangkaian, atom..."
          @focus="isFocus = true"
          @blur="isFocus = false"
        />
      </div>
    </div>

    <!-- Category chips -->
    <div class="mt-5 flex flex-wrap items-center gap-2">
      <button
        type="button"
        class="rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors"
        :class="activeCategory === null
          ? 'border-accent-blue/45 bg-accent-blue/15 text-zinc-50'
          : 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/8'"
        @click="activeCategory = null"
      >
        Semua
      </button>
      <button
        v-for="cat in categories"
        :key="cat"
        type="button"
        class="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors"
        :class="activeCategory === cat
          ? 'border-accent-blue/45 bg-accent-blue/15 text-zinc-50'
          : 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/8'"
        @click="activeCategory = cat"
      >
        <component :is="categoryIcon(cat)" class="h-3.5 w-3.5" />
        {{ cat }}
      </button>
    </div>

    <!-- Lab grid -->
    <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="l in filteredLabs"
        :key="l.id"
        :to="`/lab/${l.id}`"
        class="block"
      >
        <GlassCard class="p-6">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <span class="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                  {{ l.category }}
                </span>
                <span
                  v-if="l.kind === 'custom'"
                  class="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300"
                >
                  Custom
                </span>
              </div>
              <p class="mt-3 text-xs font-semibold tracking-wide text-zinc-500">
                {{ l.level }}
              </p>
              <h2 class="mt-1 truncate text-lg font-extrabold tracking-tight text-zinc-50">
                {{ l.title }}
              </h2>
              <p class="mt-2 line-clamp-2 text-sm text-zinc-400">
                {{ l.description }}
              </p>
            </div>

            <div class="relative grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/5">
              <div class="pointer-events-none absolute inset-0 rounded-2xl opacity-80 blur-xl" :class="l.tone === 'indigo' ? 'bg-accent-indigo/25' : 'bg-accent-blue/20'" />
              <component :is="l.icon" class="relative h-5 w-5 text-zinc-50" />
            </div>
          </div>

          <div class="mt-5 flex items-center justify-between">
            <span class="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-300">
              <Clock class="h-3.5 w-3.5" />
              {{ l.duration }}
            </span>
            <Button size="sm" class="pointer-events-none">
              Buka Lab
              <ArrowRight class="h-4 w-4" />
            </Button>
          </div>
        </GlassCard>
      </NuxtLink>
    </div>

    <div v-if="filteredLabs.length === 0" class="mt-10">
      <GlassCard class="p-8" :hover="false">
        <p class="text-sm font-semibold text-zinc-300">Tidak ada lab yang cocok</p>
        <p class="mt-2 text-sm text-zinc-500">Coba ubah kata kunci atau pilih kategori lain.</p>
      </GlassCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowRight, Clock, Search } from 'lucide-vue-next'

import Button from '~/components/ui/button/Button.vue'
import GlassCard from '~/components/ui/GlassCard.vue'
import Input from '~/components/ui/input/Input.vue'
import { useLabs } from '~/composables/useLabs'
import type { LabCategory } from '~/composables/useLabs'

definePageMeta({
  layout: 'student',
})

const query = ref('')
const isFocus = ref(false)
const activeCategory = ref<LabCategory | null>(null)

const { labs, categories, categoryIcon } = useLabs()

const filteredLabs = computed(() => {
  const q = query.value.trim().toLowerCase()
  return labs.filter((l) => {
    if (activeCategory.value && l.category !== activeCategory.value) return false
    if (!q) return true
    return [l.title, l.description, l.category, l.level].some((v) =>
      v.toLowerCase().includes(q),
    )
  })
})
</script>
