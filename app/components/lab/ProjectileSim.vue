<template>
  <div class="space-y-4">
    <!-- Stage -->
    <div class="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/60 to-slate-950/80">
      <svg
        :viewBox="`0 0 ${stageW} ${stageH}`"
        class="block w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <!-- Grid -->
        <defs>
          <pattern id="proj-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
          </pattern>
          <linearGradient id="proj-trail" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="rgba(59,130,246,0.95)" />
            <stop offset="1" stop-color="rgba(99,102,241,0.95)" />
          </linearGradient>
          <radialGradient id="proj-ball" cx="35%" cy="30%" r="65%">
            <stop offset="0" stop-color="#fef3c7" />
            <stop offset="1" stop-color="#f59e0b" />
          </radialGradient>
        </defs>

        <rect :width="stageW" :height="stageH" fill="url(#proj-grid)" />

        <!-- Ground -->
        <line :x1="0" :y1="groundY" :x2="stageW" :y2="groundY" stroke="rgba(255,255,255,0.25)" stroke-width="2" />

        <!-- Y axis labels -->
        <g font-size="10" fill="rgba(161,161,170,0.7)" font-family="monospace">
          <text :x="6" :y="groundY - 4">0 m</text>
          <text :x="6" :y="groundY - heightToPx(10) - 2">10</text>
          <text :x="6" :y="groundY - heightToPx(20) - 2">20</text>
          <text :x="6" :y="groundY - heightToPx(30) - 2">30</text>
        </g>

        <!-- Range marker -->
        <line
          v-if="range > 0"
          :x1="originX"
          :y1="groundY + 14"
          :x2="originX + rangeToPx(range)"
          :y2="groundY + 14"
          stroke="rgba(16,185,129,0.6)"
          stroke-width="2"
          stroke-dasharray="4 3"
        />
        <text
          v-if="range > 0"
          :x="originX + rangeToPx(range) / 2"
          :y="groundY + 28"
          text-anchor="middle"
          fill="rgba(16,185,129,0.9)"
          font-size="11"
          font-family="monospace"
        >
          R = {{ range.toFixed(1) }} m
        </text>

        <!-- Trajectory (full theoretical path) -->
        <polyline
          v-if="fullPathPoints"
          :points="fullPathPoints"
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          stroke-width="1.5"
          stroke-dasharray="3 4"
        />

        <!-- Trail (travelled path so far) -->
        <polyline
          v-if="trailPoints"
          :points="trailPoints"
          fill="none"
          stroke="url(#proj-trail)"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <!-- Velocity vector at launch -->
        <g v-if="!isPlaying && elapsed === 0">
          <line
            :x1="originX"
            :y1="groundY"
            :x2="originX + Math.cos(angleRad) * 60"
            :y2="groundY - Math.sin(angleRad) * 60"
            stroke="rgba(99,102,241,0.9)"
            stroke-width="2"
          />
          <circle :cx="originX + Math.cos(angleRad) * 60" :cy="groundY - Math.sin(angleRad) * 60" r="3" fill="rgba(99,102,241,0.9)" />
          <text
            :x="originX + Math.cos(angleRad) * 70"
            :y="groundY - Math.sin(angleRad) * 70"
            font-size="11"
            font-family="monospace"
            fill="rgba(165,180,252,0.95)"
          >
            v₀ = {{ velocity }} m/s, θ = {{ angle }}°
          </text>
        </g>

        <!-- Ball -->
        <g>
          <circle :cx="ballX" :cy="ballY" r="8" fill="url(#proj-ball)" stroke="rgba(0,0,0,0.4)" stroke-width="1" />
        </g>

        <!-- Origin -->
        <circle :cx="originX" :cy="groundY" r="3" fill="rgba(255,255,255,0.6)" />
      </svg>

      <!-- Live readout overlay -->
      <div class="pointer-events-none absolute right-3 top-3 rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs font-mono text-zinc-200 backdrop-blur">
        <div class="flex items-center gap-3">
          <span><span class="text-zinc-500">t</span> {{ elapsed.toFixed(2) }} s</span>
          <span><span class="text-zinc-500">x</span> {{ currentX.toFixed(1) }} m</span>
          <span><span class="text-zinc-500">y</span> {{ currentY.toFixed(1) }} m</span>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="grid gap-3 sm:grid-cols-2">
      <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div class="flex items-center justify-between">
          <p class="text-xs font-semibold text-zinc-300">Sudut peluncuran</p>
          <p class="text-xs font-mono font-semibold text-zinc-50">{{ angle }}°</p>
        </div>
        <input
          v-model.number="angle"
          type="range"
          min="0"
          max="90"
          step="1"
          class="mt-3 w-full accent-blue-500"
          @input="reset()"
        >
      </div>

      <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div class="flex items-center justify-between">
          <p class="text-xs font-semibold text-zinc-300">Kecepatan awal</p>
          <p class="text-xs font-mono font-semibold text-zinc-50">{{ velocity }} m/s</p>
        </div>
        <input
          v-model.number="velocity"
          type="range"
          min="5"
          max="40"
          step="1"
          class="mt-3 w-full accent-blue-500"
          @input="reset()"
        >
      </div>
    </div>

    <!-- Action buttons -->
    <div class="flex flex-wrap items-center gap-2">
      <Button size="sm" @click="toggle">
        <component :is="isPlaying ? Pause : Play" class="h-4 w-4" />
        {{ isPlaying ? 'Pause' : (elapsed > 0 ? 'Lanjut' : 'Tembak') }}
      </Button>
      <Button variant="secondary" size="sm" @click="reset()">
        <RotateCcw class="h-4 w-4" />
        Reset
      </Button>
      <div class="ml-auto flex items-center gap-2 text-xs">
        <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-zinc-300">
          R<sub>maks</sub> = {{ rangeMax.toFixed(1) }} m
        </span>
        <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-zinc-300">
          h<sub>maks</sub> = {{ heightMax.toFixed(1) }} m
        </span>
        <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-zinc-300">
          t<sub>terbang</sub> = {{ flightTime.toFixed(2) }} s
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { Pause, Play, RotateCcw } from 'lucide-vue-next'
import Button from '~/components/ui/button/Button.vue'

const angle = ref(45)
const velocity = ref(20)
const isPlaying = ref(false)
const elapsed = ref(0)

const g = 9.81

const stageW = 760
const stageH = 360
const groundY = stageH - 40
const originX = 60

const angleRad = computed(() => (angle.value * Math.PI) / 180)
const v0x = computed(() => velocity.value * Math.cos(angleRad.value))
const v0y = computed(() => velocity.value * Math.sin(angleRad.value))

const flightTime = computed(() => (2 * v0y.value) / g)
const rangeMax = computed(() => (velocity.value ** 2 * Math.sin(2 * angleRad.value)) / g)
const heightMax = computed(() => (v0y.value ** 2) / (2 * g))

const usableW = stageW - originX - 20
const maxR = computed(() => Math.max(rangeMax.value, 1))
const maxH = computed(() => Math.max(heightMax.value, 1))

const xScale = computed(() => Math.min(usableW / maxR.value, 18))
const yScale = computed(() => Math.min((groundY - 30) / maxH.value, 18))
const scale = computed(() => Math.min(xScale.value, yScale.value))

function rangeToPx(r: number) {
  return r * scale.value
}
function heightToPx(h: number) {
  return h * scale.value
}

const currentX = computed(() => v0x.value * elapsed.value)
const currentY = computed(() => Math.max(0, v0y.value * elapsed.value - 0.5 * g * elapsed.value * elapsed.value))
const range = computed(() => (elapsed.value >= flightTime.value ? rangeMax.value : currentX.value))

const ballX = computed(() => originX + currentX.value * scale.value)
const ballY = computed(() => groundY - currentY.value * scale.value)

const fullPathPoints = computed(() => {
  const steps = 60
  const T = flightTime.value
  const pts: string[] = []
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * T
    const x = v0x.value * t
    const y = v0y.value * t - 0.5 * g * t * t
    if (y < 0) break
    pts.push(`${(originX + x * scale.value).toFixed(2)},${(groundY - y * scale.value).toFixed(2)}`)
  }
  return pts.join(' ')
})

const trailPoints = computed(() => {
  const steps = 40
  const T = Math.min(elapsed.value, flightTime.value)
  if (T <= 0) return ''
  const pts: string[] = []
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * T
    const x = v0x.value * t
    const y = v0y.value * t - 0.5 * g * t * t
    pts.push(`${(originX + x * scale.value).toFixed(2)},${(groundY - y * scale.value).toFixed(2)}`)
  }
  return pts.join(' ')
})

let rafId: number | null = null
let lastTs = 0

function step(ts: number) {
  if (!isPlaying.value) return
  if (lastTs === 0) lastTs = ts
  const dt = (ts - lastTs) / 1000
  lastTs = ts
  elapsed.value = Math.min(elapsed.value + dt, flightTime.value)
  if (elapsed.value >= flightTime.value) {
    isPlaying.value = false
    rafId = null
    lastTs = 0
    return
  }
  rafId = requestAnimationFrame(step)
}

function toggle() {
  if (elapsed.value >= flightTime.value) {
    elapsed.value = 0
  }
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    lastTs = 0
    rafId = requestAnimationFrame(step)
  } else if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

function reset() {
  isPlaying.value = false
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  lastTs = 0
  elapsed.value = 0
}

watch([angle, velocity], () => {
  reset()
})

onBeforeUnmount(() => {
  if (rafId !== null) cancelAnimationFrame(rafId)
})
</script>
