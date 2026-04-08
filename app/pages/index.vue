<template>
  <div class="flex min-h-[40vh] items-center justify-center text-sm text-zinc-500">
    Mengalihkan ke katalog course…
  </div>
</template>

<script setup lang="ts">
await navigateTo('/courses', { replace: true })
</script>
