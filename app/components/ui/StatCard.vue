<template>
  <GlassCard class="p-5">
    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0">
        <p class="text-xs font-semibold tracking-wide text-zinc-400">
          {{ label }}
        </p>
        <div class="mt-2 flex items-baseline gap-2">
          <p class="text-2xl font-extrabold tracking-tight text-zinc-50">
            {{ value }}
          </p>
          <p v-if="delta" class="text-xs font-semibold" :class="deltaClass">
            {{ delta }}
          </p>
        </div>
        <slot name="sub" />
      </div>

      <div
        class="relative grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/5"
        :class="iconGlowClass"
      >
        <div class="pointer-events-none absolute inset-0 rounded-2xl opacity-80 blur-xl" :class="iconBlurBgClass" />
        <component :is="icon" class="relative h-5 w-5 text-zinc-50" />
      </div>
    </div>

    <slot name="footer" />
  </GlassCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import GlassCard from '~/components/ui/GlassCard.vue'

const props = withDefaults(defineProps<{
  label: string
  value: string | number
  delta?: string
  tone?: 'blue' | 'indigo'
  icon: Component
}>(), {
  delta: '',
  tone: 'blue',
})

const deltaClass = computed(() => {
  const isUp = String(props.delta).trim().startsWith('+')
  return isUp ? 'text-emerald-300' : 'text-rose-300'
})

const iconGlowClass = computed(() => (
  props.tone === 'indigo'
    ? 'shadow-glow-indigo'
    : 'shadow-glow-blue'
))

const iconBlurBgClass = computed(() => (
  props.tone === 'indigo'
    ? 'bg-accent-indigo/20'
    : 'bg-accent-blue/18'
))
</script>

