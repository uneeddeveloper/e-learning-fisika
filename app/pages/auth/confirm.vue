<template>
  <div class="mx-auto max-w-md">
    <GlassCard class="p-6">
      <p class="text-xs font-semibold tracking-wide text-zinc-500">Authentication</p>
      <h1 class="mt-2 text-2xl font-extrabold tracking-tight text-zinc-50">Confirming session</h1>
      <p class="mt-2 text-sm text-zinc-400">
        Callback Supabase sedang diproses. Kamu akan diarahkan otomatis.
      </p>

      <div class="mt-5">
        <Button :disabled="true" class="w-full">Please wait...</Button>
      </div>
    </GlassCard>
  </div>
</template>

<script setup lang="ts">
import Button from '~/components/ui/button/Button.vue'
import GlassCard from '~/components/ui/GlassCard.vue'
import { useRoute } from 'vue-router'

definePageMeta({ layout: 'student' })

const route = useRoute()
const user = useSupabaseUser()

watchEffect(async () => {
  if (user.value) {
    const r = route.query.redirect
    const dest = typeof r === 'string' && r.startsWith('/') ? r : '/courses'
    await navigateTo(dest)
    return
  }

  await navigateTo('/auth/login')
})
</script>

