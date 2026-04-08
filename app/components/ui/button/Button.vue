<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="classes"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '~/components/ui/cn'

type Variant = 'default' | 'secondary' | 'ghost'
type Size = 'sm' | 'md'

const props = withDefaults(defineProps<{
  variant?: Variant
  size?: Size
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  class?: string
}>(), {
  variant: 'default',
  size: 'md',
  disabled: false,
  type: 'button',
  class: '',
})

const classes = computed(() => {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-200 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background ' +
    'disabled:opacity-50 disabled:pointer-events-none active:translate-y-[1px]'

  const size =
    props.size === 'sm'
      ? 'h-9 px-3 text-sm'
      : 'h-10 px-4 text-sm'

  const variant =
    props.variant === 'secondary'
      ? 'bg-white/6 text-zinc-100 border border-white/10 hover:bg-white/8 hover:border-accent-indigo/35 shadow-glow-indigo'
      : props.variant === 'ghost'
        ? 'bg-transparent text-zinc-200 hover:bg-white/5 border border-white/10'
        : 'bg-accent-blue/18 text-zinc-50 border border-accent-blue/25 hover:bg-accent-blue/24 hover:border-accent-blue/45 shadow-glow-blue'

  return cn(base, size, variant, props.class)
})
</script>

