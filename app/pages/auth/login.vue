<template>
  <div class="mx-auto max-w-md">
    <GlassCard class="p-6">
      <p class="text-xs font-semibold tracking-wide text-zinc-500">Authentication</p>
      <h1 class="mt-2 text-2xl font-extrabold tracking-tight text-zinc-50">Sign in</h1>
      <p class="mt-2 text-sm text-zinc-400">
        Masuk untuk membuka course dan mengikuti materi. Katalog course bisa dijelajahi tanpa login.
      </p>

      <form class="mt-5 space-y-3" @submit.prevent="onSubmit">
        <Input v-model="email" type="email" placeholder="Email" autocomplete="email" />
        <Input v-model="password" type="password" placeholder="Password" autocomplete="current-password" />

        <p v-if="errorMessage" class="text-xs text-rose-300">{{ errorMessage }}</p>
        <p v-if="successMessage" class="text-xs text-emerald-300">{{ successMessage }}</p>

        <div class="flex items-center gap-2">
          <Button type="submit" :disabled="loading" class="w-full">
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </Button>
          <NuxtLink to="/" class="w-full">
            <Button variant="secondary" class="w-full">Home</Button>
          </NuxtLink>
        </div>

        <p class="pt-2 text-center text-xs text-zinc-500">
          Belum punya akun?
          <NuxtLink to="/auth/register" class="font-semibold text-accent-blue hover:underline">
            Daftar di sini
          </NuxtLink>
        </p>
      </form>
    </GlassCard>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import Button from '~/components/ui/button/Button.vue'
import GlassCard from '~/components/ui/GlassCard.vue'
import Input from '~/components/ui/input/Input.vue'

definePageMeta({ layout: 'student' })

const route = useRoute()
const { fetch: refreshSession } = useUserSession()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const redirectAfterLogin = computed(() => {
  const r = route.query.redirect
  return typeof r === 'string' && r.startsWith('/') ? r : '/courses'
})

async function onSubmit() {
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true

  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    })
    await refreshSession()
    successMessage.value = 'Signed in. Redirecting...'
    await navigateTo(redirectAfterLogin.value)
  } catch (err: any) {
    errorMessage.value = err?.data?.statusMessage ?? err?.statusMessage ?? 'Login gagal. Coba lagi.'
  } finally {
    loading.value = false
  }
}
</script>
