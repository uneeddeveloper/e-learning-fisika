<template>
  <NuxtLayout>
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <DevBadge v-if="isDev" />
  </NuxtLayout>
</template>

<script setup lang="ts">
const isDev = import.meta.dev
</script>
