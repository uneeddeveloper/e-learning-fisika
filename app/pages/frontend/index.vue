<template>
  <div class="page">
    <div class="sidebar">
      <NuxtLink to="/" class="back">← Kembali</NuxtLink>
      <div class="layer-badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
        Frontend Layer
      </div>

      <nav class="nav">
        <button
          v-for="item in menu"
          :key="item.id"
          class="nav-item"
          :class="{ active: active === item.id }"
          @click="active = item.id"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          {{ item.label }}
        </button>
      </nav>

      <div class="sidebar-footer">
        <div class="tech-tag">Vue 3</div>
        <div class="tech-tag">Nuxt 4</div>
        <div class="tech-tag">Supabase</div>
      </div>
    </div>

    <main class="main">
      <div class="main-header">
        <h1>{{ currentMenu?.label }}</h1>
        <span class="render-badge">
          <span class="dot" />
          Client Side · {{ time }}
        </span>
      </div>

      <!-- Reaktivitas Vue -->
      <div v-if="active === 'reactivity'" class="section">
        <div class="demo-card">
          <h3>Reaktivitas Vue 3</h3>
          <p class="hint">State berubah langsung tanpa reload — ini kekuatan frontend.</p>
          <div class="counter-area">
            <button class="btn-minus" @click="count--">−</button>
            <div class="counter-display">
              <span class="counter-value">{{ count }}</span>
              <span class="counter-label">klik</span>
            </div>
            <button class="btn-plus" @click="count++">+</button>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${Math.min(count * 10, 100)}%` }" />
          </div>
          <p class="counter-msg">{{ counterMessage }}</p>
        </div>

        <div class="demo-card">
          <h3>Computed Property</h3>
          <p class="hint">Data turunan yang otomatis update.</p>
          <div class="input-row">
            <input v-model="mass" type="number" placeholder="Massa (kg)" class="input" />
            <span class="formula-sep">×</span>
            <input v-model="acceleration" type="number" placeholder="Percepatan (m/s²)" class="input" />
            <span class="formula-sep">=</span>
            <div class="result-box">{{ force }} N</div>
          </div>
          <p class="formula-label">F = m × a (Hukum Newton II)</p>
        </div>
      </div>

      <!-- Composables -->
      <div v-if="active === 'composable'" class="section">
        <div class="demo-card">
          <h3>useFetch Composable</h3>
          <p class="hint">Data dari backend di-fetch dan di-cache otomatis oleh Nuxt.</p>
          <div class="fetch-status">
            <div v-if="fetchPending" class="status-loading">
              <div class="spinner" />
              Fetching dari /api/ping...
            </div>
            <div v-else class="fetch-result">
              <div v-for="(val, key) in pingData" :key="key" class="fetch-row">
                <span class="fetch-key">{{ key }}</span>
                <span class="fetch-val">{{ val }}</span>
              </div>
            </div>
          </div>
          <button class="btn-refresh" @click="refresh()">↺ Refresh</button>
        </div>

        <div class="demo-card">
          <h3>useRuntimeConfig</h3>
          <p class="hint">Config yang di-inject dari Nuxt, aman untuk public vars.</p>
          <div class="config-row">
            <span class="fetch-key">SUPABASE_URL</span>
            <span class="fetch-val masked">{{ maskedUrl }}</span>
          </div>
        </div>
      </div>

      <!-- Routing -->
      <div v-if="active === 'routing'" class="section">
        <div class="demo-card">
          <h3>File-based Routing</h3>
          <p class="hint">Struktur folder <code>app/pages/</code> otomatis jadi route.</p>
          <div class="file-tree">
            <div class="file-item root">📁 app/pages/</div>
            <div class="file-item" :class="{ 'active-file': route.path === '/' }">
              &nbsp;&nbsp;📄 index.vue → <code>/</code>
            </div>
            <div class="file-item folder">&nbsp;&nbsp;📁 frontend/</div>
            <div class="file-item" :class="{ 'active-file': route.path === '/frontend' }">
              &nbsp;&nbsp;&nbsp;&nbsp;📄 index.vue → <code>/frontend</code>
              <span v-if="route.path === '/frontend'" class="you-are-here">← kamu di sini</span>
            </div>
            <div class="file-item folder">&nbsp;&nbsp;📁 backend/</div>
            <div class="file-item" :class="{ 'active-file': route.path === '/backend' }">
              &nbsp;&nbsp;&nbsp;&nbsp;📄 index.vue → <code>/backend</code>
            </div>
          </div>
          <div class="route-info">
            <span class="fetch-key">Current route</span>
            <span class="fetch-val">{{ route.path }}</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const active = ref('reactivity')
const count = ref(0)
const mass = ref<number | null>(null)
const acceleration = ref<number | null>(null)
const route = useRoute()
const config = useRuntimeConfig()

const menu = [
  { id: 'reactivity', label: 'Reaktivitas', icon: '⚡' },
  { id: 'composable', label: 'Composables', icon: '🔗' },
  { id: 'routing', label: 'Routing', icon: '🗺️' },
]

const currentMenu = computed(() => menu.find(m => m.id === active.value))

const force = computed(() => {
  if (mass.value && acceleration.value) {
    return (mass.value * acceleration.value).toFixed(2)
  }
  return '?'
})

const counterMessage = computed(() => {
  if (count.value === 0) return 'Coba klik tombol di atas!'
  if (count.value < 5) return 'Terus klik...'
  if (count.value < 10) return 'Bagus! State berubah real-time.'
  return '🎉 Keren! Ini kekuatan Vue reaktivitas.'
})

const maskedUrl = computed(() => {
  const url = config.public.supabaseUrl as string
  return url ? url.replace(/^(https:\/\/.{8}).*/, '$1...') : 'tidak diset'
})

const { data: pingData, pending: fetchPending, refresh } = await useFetch('/api/ping')

const time = ref('')
onMounted(() => {
  const update = () => { time.value = new Date().toLocaleTimeString('id-ID') }
  update()
  setInterval(update, 1000)
})
</script>

<style scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }

.page {
  display: flex;
  min-height: 100vh;
  background: #09090b;
  font-family: system-ui, sans-serif;
  color: #fff;
}

/* SIDEBAR */
.sidebar {
  width: 240px;
  flex-shrink: 0;
  background: rgba(99,102,241,0.05);
  border-right: 1px solid rgba(99,102,241,0.15);
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem;
  gap: 1rem;
}

.back {
  color: #52525b;
  text-decoration: none;
  font-size: 0.8rem;
  transition: color 0.2s;
}
.back:hover { color: #818cf8; }

.layer-badge {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 12px;
  background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1));
  border: 1px solid rgba(99,102,241,0.3);
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #a5b4fc;
  font-family: monospace;
}

.nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: #52525b;
  font-size: 0.875rem;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
}
.nav-item:hover { background: rgba(99,102,241,0.1); color: #a5b4fc; }
.nav-item.active { background: rgba(99,102,241,0.2); color: #818cf8; font-weight: 600; }
.nav-icon { font-size: 1rem; }

.sidebar-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tech-tag {
  padding: 3px 8px;
  background: rgba(99,102,241,0.1);
  border: 1px solid rgba(99,102,241,0.2);
  border-radius: 6px;
  font-size: 0.7rem;
  color: #6366f1;
  font-family: monospace;
}

/* MAIN */
.main {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.main-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.main-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
}

.render-badge {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 6px 12px;
  background: rgba(99,102,241,0.1);
  border: 1px solid rgba(99,102,241,0.2);
  border-radius: 99px;
  font-size: 0.75rem;
  color: #818cf8;
  font-family: monospace;
}

.dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #6366f1;
  animation: blink 1.5s ease-in-out infinite;
}

.section { display: flex; flex-direction: column; gap: 1rem; }

.demo-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.demo-card h3 { font-size: 1rem; font-weight: 700; color: #e4e4e7; }
.hint { font-size: 0.8rem; color: #52525b; }

/* Counter */
.counter-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.btn-minus, .btn-plus {
  width: 44px; height: 44px;
  border-radius: 12px;
  border: none;
  font-size: 1.4rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-minus { background: rgba(239,68,68,0.15); color: #f87171; }
.btn-minus:hover { background: rgba(239,68,68,0.3); }
.btn-plus { background: rgba(99,102,241,0.15); color: #818cf8; }
.btn-plus:hover { background: rgba(99,102,241,0.3); }

.counter-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}
.counter-value { font-size: 2.5rem; font-weight: 800; color: #818cf8; }
.counter-label { font-size: 0.7rem; color: #52525b; }
.counter-msg { font-size: 0.8rem; color: #a1a1aa; text-align: center; }

.progress-bar {
  height: 6px;
  background: rgba(255,255,255,0.05);
  border-radius: 99px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  border-radius: 99px;
  transition: width 0.3s ease;
}

/* Formula */
.input-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.input {
  width: 130px;
  padding: 8px 12px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  color: #fff;
  font-size: 0.875rem;
  outline: none;
}
.input:focus { border-color: #6366f1; }
.formula-sep { color: #52525b; font-size: 1.2rem; font-weight: 700; }
.result-box {
  padding: 8px 16px;
  background: rgba(99,102,241,0.2);
  border: 1px solid rgba(99,102,241,0.4);
  border-radius: 10px;
  color: #818cf8;
  font-weight: 700;
  font-size: 1rem;
  min-width: 80px;
  text-align: center;
}
.formula-label { font-size: 0.75rem; color: #52525b; font-family: monospace; }

/* Fetch */
.fetch-status { min-height: 60px; }
.status-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #52525b;
  font-size: 0.8rem;
}
.spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(99,102,241,0.3);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
.fetch-result, .config-row { display: flex; flex-direction: column; gap: 8px; }
.fetch-row { display: flex; justify-content: space-between; align-items: center; }
.fetch-key { font-size: 0.75rem; color: #52525b; font-family: monospace; }
.fetch-val {
  font-size: 0.75rem;
  color: #a5b4fc;
  font-family: monospace;
  background: rgba(99,102,241,0.1);
  padding: 2px 8px;
  border-radius: 6px;
}
.fetch-val.masked { color: #52525b; }
.btn-refresh {
  align-self: flex-start;
  padding: 6px 14px;
  background: rgba(99,102,241,0.15);
  border: 1px solid rgba(99,102,241,0.3);
  border-radius: 8px;
  color: #818cf8;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-refresh:hover { background: rgba(99,102,241,0.3); }

/* File tree */
.file-tree {
  background: rgba(0,0,0,0.3);
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.file-item {
  font-size: 0.8rem;
  color: #52525b;
  font-family: monospace;
  padding: 4px 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.file-item.root { color: #a1a1aa; }
.file-item.folder { color: #a1a1aa; }
.file-item.active-file { background: rgba(99,102,241,0.15); color: #a5b4fc; }
.file-item code { color: #818cf8; }
.you-are-here { font-size: 0.7rem; color: #6366f1; }
.route-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
