<template>
  <div>
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-xs font-semibold tracking-wide text-zinc-500">Teacher · Keamanan</p>
        <h1 class="mt-1 text-2xl font-extrabold tracking-tight text-zinc-50">
          Manajemen Pengguna
        </h1>
        <p class="mt-2 max-w-2xl text-sm text-zinc-400">
          Tambah, ubah role, reset password, atau hapus akun siswa & guru.
        </p>
      </div>

      <Button size="md" @click="openCreate">
        <UserPlus class="h-4 w-4" />
        Tambah Pengguna
      </Button>
    </div>

    <!-- Toolbar: search & filter role -->
    <div class="mt-6 flex flex-wrap items-center gap-3">
      <div class="glass-card flex min-w-[240px] flex-1 items-center gap-2 rounded-2xl px-3 py-2">
        <Search class="h-4 w-4 text-zinc-500" />
        <input
          v-model="query"
          placeholder="Cari nama atau email..."
          class="h-8 flex-1 border-0 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 outline-none"
        >
      </div>
      <div class="flex items-center gap-1.5">
        <button
          v-for="opt in roleFilters"
          :key="opt.value"
          type="button"
          class="rounded-xl border px-3 py-2 text-xs font-semibold transition-all"
          :class="roleFilter === opt.value
            ? 'border-accent-blue/60 bg-accent-blue/15 text-zinc-50'
            : 'border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200'"
          @click="roleFilter = opt.value"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <div class="mt-5 grid gap-3">
      <p v-if="pending" class="text-sm text-zinc-500">Memuat...</p>
      <GlassCard v-else-if="filtered.length === 0" class="p-8 text-center">
        <p class="text-sm font-semibold text-zinc-300">Tidak ada pengguna</p>
        <p class="mt-2 text-sm text-zinc-500">Coba ubah pencarian/filter, atau tambah pengguna baru.</p>
      </GlassCard>

      <GlassCard v-for="u in filtered" :key="u.id" class="p-4">
        <div class="flex items-center justify-between gap-4">
          <div class="flex min-w-0 items-center gap-3">
            <div class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/10 text-sm font-bold text-zinc-50">
              {{ initial(u.name) }}
            </div>
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <p class="truncate text-sm font-bold text-zinc-50">{{ u.name }}</p>
                <span class="rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide" :class="roleBadge(u.role)">
                  {{ u.role }}
                </span>
                <span v-if="u.id === currentUserId" class="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-zinc-400">
                  Anda
                </span>
              </div>
              <p class="mt-0.5 truncate text-xs text-zinc-500">
                {{ u.email }} · {{ u.quizResultCount }} jawaban kuis · daftar {{ formatDate(u.createdAt) }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 transition-colors hover:bg-white/10"
              title="Edit"
              @click="openEdit(u)"
            >
              <Pencil class="h-4 w-4" />
            </button>
            <button
              type="button"
              class="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition-colors hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-40"
              title="Hapus"
              :disabled="u.id === currentUserId || deletingId === u.id"
              @click="removeUser(u)"
            >
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
        </div>
      </GlassCard>
    </div>

    <!-- Dialog create/edit -->
    <Dialog v-model:open="isOpen">
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0">
          <p class="text-xs font-semibold tracking-wide text-zinc-500">{{ editingId ? 'Edit' : 'Baru' }}</p>
          <h3 class="mt-1 text-lg font-extrabold tracking-tight text-zinc-50">
            {{ editingId ? 'Edit Pengguna' : 'Tambah Pengguna' }}
          </h3>
        </div>
        <button
          type="button"
          class="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-zinc-300 transition-colors hover:bg-white/6"
          @click="isOpen = false"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <div class="mt-5 space-y-4">
        <div>
          <label class="text-xs font-semibold text-zinc-300">Nama</label>
          <div class="mt-1.5">
            <Input v-model="form.name" placeholder="Nama lengkap" />
          </div>
        </div>

        <div>
          <label class="text-xs font-semibold text-zinc-300">Email</label>
          <div class="mt-1.5">
            <Input v-model="form.email" type="email" placeholder="email@contoh.com" />
          </div>
        </div>

        <div>
          <label class="text-xs font-semibold text-zinc-300">Role</label>
          <div class="mt-1.5 grid grid-cols-3 gap-2">
            <button
              v-for="opt in roleOptions"
              :key="opt.value"
              type="button"
              class="rounded-xl border px-3 py-2 text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40"
              :class="form.role === opt.value
                ? 'border-accent-blue/60 bg-accent-blue/15 text-zinc-50'
                : 'border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200'"
              :disabled="editingId === currentUserId"
              @click="form.role = opt.value"
            >
              {{ opt.label }}
            </button>
          </div>
          <p v-if="editingId === currentUserId" class="mt-1.5 text-[11px] text-zinc-500">
            Anda tidak bisa mengubah role akun sendiri.
          </p>
        </div>

        <div>
          <label class="text-xs font-semibold text-zinc-300">
            {{ editingId ? 'Password baru (opsional)' : 'Password' }}
          </label>
          <div class="mt-1.5">
            <Input
              v-model="form.password"
              type="password"
              :placeholder="editingId ? 'Kosongkan jika tidak diubah' : 'Minimal 8 karakter'"
            />
          </div>
        </div>

        <p v-if="error" class="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs text-rose-300">
          {{ error }}
        </p>
      </div>

      <div class="mt-5 flex items-center justify-end gap-2">
        <Button variant="ghost" size="md" @click="isOpen = false">Batal</Button>
        <Button size="md" :disabled="submitting" @click="submit">
          <UserPlus class="h-4 w-4" />
          {{ submitting ? 'Menyimpan...' : editingId ? 'Simpan perubahan' : 'Buat pengguna' }}
        </Button>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { Pencil, Search, Trash2, UserPlus, X } from 'lucide-vue-next'

import Button from '~/components/ui/button/Button.vue'
import GlassCard from '~/components/ui/GlassCard.vue'
import Dialog from '~/components/ui/dialog/Dialog.vue'
import Input from '~/components/ui/input/Input.vue'

definePageMeta({
  layout: 'teacher',
  middleware: 'auth',
})

type Role = 'STUDENT' | 'TEACHER' | 'ADMIN'
type UserItem = {
  id: number
  name: string
  email: string
  role: Role
  createdAt: string
  quizResultCount: number
  labSubmissionCount: number
}

const { user } = useUserSession()
const currentUserId = computed(() => (user.value as { id?: number } | null)?.id ?? null)

const { data: users, pending, refresh } = await useFetch<UserItem[]>('/api/users', {
  default: () => [],
})

const query = ref('')
const roleFilter = ref<'ALL' | Role>('ALL')
const roleFilters: { value: 'ALL' | Role; label: string }[] = [
  { value: 'ALL', label: 'Semua' },
  { value: 'STUDENT', label: 'Siswa' },
  { value: 'TEACHER', label: 'Guru' },
  { value: 'ADMIN', label: 'Admin' },
]
const roleOptions: { value: Role; label: string }[] = [
  { value: 'STUDENT', label: 'Siswa' },
  { value: 'TEACHER', label: 'Guru' },
  { value: 'ADMIN', label: 'Admin' },
]

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return (users.value ?? []).filter((u) => {
    if (roleFilter.value !== 'ALL' && u.role !== roleFilter.value) return false
    if (!q) return true
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  })
})

function roleBadge(role: Role) {
  if (role === 'ADMIN') return 'border-rose-500/30 bg-rose-500/10 text-rose-300'
  if (role === 'TEACHER') return 'border-accent-blue/40 bg-accent-blue/15 text-accent-blue'
  return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
}

function initial(name: string) {
  return name ? name.charAt(0).toUpperCase() : '?'
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

const isOpen = ref(false)
const editingId = ref<number | null>(null)
const submitting = ref(false)
const error = ref<string | null>(null)

const form = reactive({
  name: '',
  email: '',
  role: 'STUDENT' as Role,
  password: '',
})

function resetForm() {
  form.name = ''
  form.email = ''
  form.role = 'STUDENT'
  form.password = ''
  error.value = null
}

function openCreate() {
  editingId.value = null
  resetForm()
  isOpen.value = true
}

function openEdit(u: UserItem) {
  editingId.value = u.id
  error.value = null
  form.name = u.name
  form.email = u.email
  form.role = u.role
  form.password = ''
  isOpen.value = true
}

async function submit() {
  error.value = null
  if (!form.name.trim() || !form.email.trim()) {
    error.value = 'Nama dan email wajib diisi.'
    return
  }
  if (!editingId.value && form.password.length < 8) {
    error.value = 'Password minimal 8 karakter.'
    return
  }
  submitting.value = true
  try {
    if (editingId.value) {
      const body: Record<string, unknown> = {
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
      }
      if (form.password) body.password = form.password
      await $fetch(`/api/users/${editingId.value}`, { method: 'PUT', body })
    } else {
      await $fetch('/api/users', {
        method: 'POST',
        body: {
          name: form.name.trim(),
          email: form.email.trim(),
          role: form.role,
          password: form.password,
        },
      })
    }
    isOpen.value = false
    await refresh()
  } catch (err: any) {
    error.value = err?.statusMessage ?? err?.data?.statusMessage ?? 'Gagal menyimpan pengguna.'
  } finally {
    submitting.value = false
  }
}

const deletingId = ref<number | null>(null)
async function removeUser(u: UserItem) {
  if (u.id === currentUserId.value) return
  if (!confirm(`Hapus pengguna “${u.name}” (${u.email})? Semua data terkait akan ikut terhapus.`)) return
  deletingId.value = u.id
  try {
    await $fetch(`/api/users/${u.id}`, { method: 'DELETE' })
    await refresh()
  } catch (err: any) {
    alert(err?.statusMessage ?? err?.data?.statusMessage ?? 'Gagal menghapus pengguna.')
  } finally {
    deletingId.value = null
  }
}
</script>
