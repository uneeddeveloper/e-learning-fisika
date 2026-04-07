<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <DevBadge v-if="isDev" />
  </div>
</template>

<script setup lang="ts">
const isDev = import.meta.dev
</script>
