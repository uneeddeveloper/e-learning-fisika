<template>
  <input
    :value="modelValue"
    :placeholder="placeholder"
    :type="type"
    :class="classes"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  >
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '~/components/ui/cn'

const props = withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
  type?: string
  class?: string
}>(), {
  modelValue: '',
  placeholder: '',
  type: 'text',
  class: '',
})

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const classes = computed(() => cn(
  'h-12 w-full rounded-2xl bg-white/5 border border-white/10 px-4 text-sm text-zinc-100 ' +
    'placeholder:text-zinc-500 outline-none transition-all duration-200 ' +
    'focus:border-accent-blue/50 focus:ring-2 focus:ring-accent-blue/20',
  props.class,
))
</script>

