<template>
  <div v-if="lab">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div class="min-w-0">
        <NuxtLink to="/lab" class="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-300 transition-colors hover:bg-white/6">
          <ArrowLeft class="h-4 w-4" />
          Semua Lab
        </NuxtLink>

        <div class="mt-4 flex flex-wrap items-center gap-2">
          <span class="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
            {{ lab.category }}
          </span>
          <span class="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
            {{ lab.level }}
          </span>
          <span
            v-if="lab.kind === 'custom'"
            class="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300"
          >
            Simulasi Custom
          </span>
          <span
            v-else
            class="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-400"
          >
            PhET Simulation
          </span>
        </div>
        <h1 class="mt-3 text-2xl font-extrabold tracking-tight text-zinc-50">
          {{ lab.title }}
        </h1>
        <p class="mt-2 max-w-2xl text-sm text-zinc-400">
          {{ lab.description }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <Button variant="secondary" size="md" @click="resetWorksheet">
          <RotateCcw class="h-4 w-4" />
          Reset jawaban
        </Button>
        <Button size="md" :disabled="!worksheetComplete" @click="submitWorksheet">
          <Send class="h-4 w-4" />
          {{ submitted ? 'Terkirim' : 'Kirim worksheet' }}
        </Button>
      </div>
    </div>

    <div class="mt-6 grid gap-4 lg:grid-cols-12">
      <!-- Simulation -->
      <div class="lg:col-span-8">
        <GlassCard class="p-6" :hover="false">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-lg font-extrabold tracking-tight text-zinc-50">Simulasi</h2>
              <p class="mt-1 text-sm text-zinc-500">
                {{ lab.kind === 'custom' ? 'Eksperimen interaktif di-render langsung di browser.' : 'Disediakan oleh PhET Interactive Simulations (University of Colorado Boulder).' }}
              </p>
            </div>
            <div class="relative grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/5">
              <div class="pointer-events-none absolute inset-0 rounded-2xl opacity-80 blur-xl" :class="lab.tone === 'indigo' ? 'bg-accent-indigo/25' : 'bg-accent-blue/20'" />
              <component :is="lab.icon" class="relative h-5 w-5 text-zinc-50" />
            </div>
          </div>

          <div class="mt-5">
            <ProjectileSim v-if="lab.kind === 'custom' && lab.customComponent === 'projectile'" />

            <div v-else-if="lab.kind === 'phet' && lab.embedUrl" class="overflow-hidden rounded-3xl border border-white/10 bg-black">
              <div class="relative aspect-video w-full">
                <iframe
                  :src="lab.embedUrl"
                  class="absolute inset-0 h-full w-full"
                  allow="fullscreen"
                  allowfullscreen
                  loading="lazy"
                  title="PhET Simulation"
                />
              </div>
              <div class="flex items-center justify-between gap-2 border-t border-white/10 px-4 py-2 text-xs text-zinc-500">
                <span>Klik di dalam simulasi untuk berinteraksi.</span>
                <a
                  :href="lab.embedUrl"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-semibold text-zinc-300 hover:bg-white/8"
                >
                  Buka full-screen
                  <ExternalLink class="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </GlassCard>

        <!-- Worksheet -->
        <GlassCard class="mt-4 p-6" :hover="false">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-lg font-extrabold tracking-tight text-zinc-50">Worksheet</h2>
              <p class="mt-1 text-sm text-zinc-500">
                Isi setelah kamu bermain dengan simulasi. Tetap rapi & ringkas.
              </p>
            </div>
            <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-300">
              {{ answeredCount }} / {{ lab.worksheet.length }} terisi
            </span>
          </div>

          <div class="mt-5 space-y-3">
            <div
              v-for="(q, idx) in lab.worksheet"
              :key="q.id"
              class="rounded-2xl border border-white/10 bg-white/3 p-4 transition-colors focus-within:border-accent-blue/35 hover:bg-white/5"
            >
              <div class="flex items-start gap-3">
                <div class="grid h-8 w-8 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5 text-xs font-bold text-zinc-300">
                  {{ idx + 1 }}
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-semibold text-zinc-100">{{ q.prompt }}</p>
                  <p v-if="q.hint" class="mt-1 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-zinc-400">
                    <Lightbulb class="h-3 w-3" />
                    {{ q.hint }}
                  </p>
                  <textarea
                    v-model="answers[q.id]"
                    rows="3"
                    placeholder="Tulis jawabanmu di sini..."
                    class="mt-3 w-full resize-y rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition-all duration-200 focus:border-accent-blue/50 focus:ring-2 focus:ring-accent-blue/20"
                  />
                </div>
              </div>
            </div>
          </div>

          <div v-if="submitted" class="mt-4 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
            Worksheet tersimpan secara lokal. Guru akan melihat hasilnya saat backend submission diaktifkan.
          </div>
        </GlassCard>
      </div>

      <!-- Sidebar: objectives + tips -->
      <div class="lg:col-span-4 space-y-4">
        <GlassCard class="p-6" :hover="false">
          <h2 class="text-lg font-extrabold tracking-tight text-zinc-50">Tujuan Pembelajaran</h2>
          <p class="mt-1 text-sm text-zinc-500">Yang akan kamu capai di lab ini.</p>

          <ul class="mt-4 space-y-2">
            <li
              v-for="(obj, idx) in lab.objectives"
              :key="idx"
              class="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/3 px-3 py-2.5"
            >
              <div class="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5">
                <Check class="h-3.5 w-3.5 text-emerald-300" />
              </div>
              <p class="text-sm text-zinc-200">{{ obj }}</p>
            </li>
          </ul>
        </GlassCard>

        <GlassCard class="p-6" :hover="false">
          <h2 class="text-lg font-extrabold tracking-tight text-zinc-50">Cara mengerjakan</h2>
          <ol class="mt-3 space-y-2 text-sm text-zinc-300">
            <li class="flex items-start gap-3">
              <span class="grid h-6 w-6 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-xs font-bold">1</span>
              <span>Eksplor simulasi: ubah variabel, amati apa yang berubah.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="grid h-6 w-6 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-xs font-bold">2</span>
              <span>Catat hasil yang signifikan; cocokkan dengan teori.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="grid h-6 w-6 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-xs font-bold">3</span>
              <span>Jawab worksheet dengan kalimatmu sendiri, ringkas tapi argumentatif.</span>
            </li>
          </ol>
        </GlassCard>

        <GlassCard class="p-6" :hover="false">
          <div class="flex items-start gap-3">
            <div class="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5">
              <Sparkles class="h-5 w-5 text-zinc-50" />
            </div>
            <div>
              <p class="text-sm font-bold text-zinc-50">Tips kuat</p>
              <p class="mt-1 text-sm text-zinc-400">
                Mulai dari kondisi ekstrem (mis. nol atau maksimum) untuk membangun intuisi sebelum coba kasus tengah.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  </div>

  <div v-else class="mx-auto max-w-2xl">
    <GlassCard class="p-8" :hover="false">
      <p class="text-sm font-semibold text-zinc-300">Lab tidak ditemukan</p>
      <p class="mt-2 text-sm text-zinc-500">Periksa URL atau kembali ke katalog lab.</p>
      <div class="mt-4">
        <NuxtLink to="/lab">
          <Button size="md">
            <ArrowLeft class="h-4 w-4" />
            Kembali ke Lab
          </Button>
        </NuxtLink>
      </div>
    </GlassCard>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowLeft,
  Check,
  ExternalLink,
  Lightbulb,
  RotateCcw,
  Send,
  Sparkles,
} from 'lucide-vue-next'

import Button from '~/components/ui/button/Button.vue'
import GlassCard from '~/components/ui/GlassCard.vue'
import ProjectileSim from '~/components/lab/ProjectileSim.vue'
import { useLabs } from '~/composables/useLabs'

definePageMeta({
  layout: 'student',
})

const route = useRoute()
const { labs } = useLabs()

const lab = computed(() => labs.find(l => l.id === String(route.params.id)))

const answers = reactive<Record<string, string>>({})
const submitted = ref(false)

watch(lab, (l) => {
  if (!l) return
  for (const q of l.worksheet) {
    if (!(q.id in answers)) answers[q.id] = ''
  }
}, { immediate: true })

const answeredCount = computed(() => {
  if (!lab.value) return 0
  return lab.value.worksheet.filter(q => (answers[q.id] || '').trim().length > 0).length
})

const worksheetComplete = computed(() => {
  if (!lab.value) return false
  return answeredCount.value === lab.value.worksheet.length
})

function resetWorksheet() {
  if (!lab.value) return
  for (const q of lab.value.worksheet) answers[q.id] = ''
  submitted.value = false
}

function submitWorksheet() {
  if (!worksheetComplete.value) return
  submitted.value = true
}
</script>
