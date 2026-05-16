<template>
  <div class="mx-auto max-w-md">
    <GlassCard class="p-6">
      <p class="text-xs font-semibold tracking-wide text-zinc-500">Authentication</p>
      <h1 class="mt-2 text-2xl font-extrabold tracking-tight text-zinc-50">Buat akun</h1>
      <p class="mt-2 text-sm text-zinc-400">
        Daftar untuk menyimpan progres course dan worksheet lab.
      </p>

      <form class="mt-5 space-y-3" @submit.prevent="onSubmit">
        <Input v-model="name" type="text" placeholder="Nama lengkap" autocomplete="name" />
        <Input v-model="email" type="email" placeholder="Email" autocomplete="email" />
        <Input v-model="password" type="password" placeholder="Password (min. 8 karakter)" autocomplete="new-password" />

        <p v-if="errorMessage" class="text-xs text-rose-300">{{ errorMessage }}</p>

        <div class="flex items-center gap-2">
          <Button type="submit" :disabled="loading" class="w-full">
            {{ loading ? 'Mendaftarkan...' : 'Daftar' }}
          </Button>
          <NuxtLink to="/auth/login" class="w-full">
            <Button variant="secondary" class="w-full">Login</Button>
          </NuxtLink>
        </div>
      </form>
    </GlassCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from '~/components/ui/button/Button.vue'
import GlassCard from '~/components/ui/GlassCard.vue'
import Input from '~/components/ui/input/Input.vue'

definePageMeta({ layout: 'student' })

const { fetch: refreshSession } = useUserSession()

const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

async function onSubmit() {
  errorMessage.value = ''
  loading.value = true

  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: { name: name.value, email: email.value, password: password.value },
    })
    await refreshSession()
    await navigateTo('/courses')
  } catch (err: any) {
    errorMessage.value = err?.data?.statusMessage ?? err?.statusMessage ?? 'Pendaftaran gagal.'
  } finally {
    loading.value = false
  }
}
</script>
