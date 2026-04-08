<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
      @keydown.esc="emit('update:open', false)"
    >
      <div
        class="absolute inset-0 bg-black/60 backdrop-blur-sm"
        @click="emit('update:open', false)"
      />

      <div
        ref="panel"
        class="relative w-full max-w-xl rounded-3xl glass-card border-glow shadow-[0_1px_0_rgba(255,255,255,0.06),0_28px_90px_rgba(0,0,0,0.60)]"
        role="dialog"
        aria-modal="true"
        tabindex="-1"
      >
        <div class="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-b from-accent-blue/16 via-transparent to-accent-indigo/14 blur-[10px]" />
        <div class="relative p-6">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const panel = ref<HTMLElement | null>(null)

watch(() => props.open, async (v) => {
  if (!v) return
  await nextTick()
  panel.value?.focus()
})

onMounted(() => {
  // Keep minimal; focus handling is handled via watch.
})
</script>

