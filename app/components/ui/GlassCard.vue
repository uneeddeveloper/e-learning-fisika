<template>
  <div :class="classes">
    <div class="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
      <div class="absolute -inset-px rounded-[inherit] bg-gradient-to-b from-accent-blue/18 via-transparent to-accent-indigo/14 blur-[10px]" />
      <div class="absolute -inset-px rounded-[inherit] bg-gradient-to-r from-white/10 via-transparent to-white/5" />
    </div>
    <div class="relative">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '~/components/ui/cn'

const props = withDefaults(defineProps<{
  class?: string
  hover?: boolean
}>(), {
  class: '',
  hover: true,
})

const classes = computed(() => cn(
  'group relative overflow-hidden rounded-3xl glass-card border-glow shadow-[0_1px_0_rgba(255,255,255,0.06),0_18px_60px_rgba(0,0,0,0.45)]',
  props.hover ? 'transition-all duration-200 hover:scale-[1.01] hover:border-accent-blue/50 hover:[box-shadow:var(--tw-shadow),0_0_0_1px_rgba(59,130,246,0.35),0_0_28px_rgba(99,102,241,0.14)]' : '',
  props.class,
))
</script>

