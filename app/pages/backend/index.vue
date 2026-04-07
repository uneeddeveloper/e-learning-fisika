<template>
  <div class="page">
    <div class="sidebar">
      <NuxtLink to="/" class="back">← Kembali</NuxtLink>
      <div class="layer-badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
        Backend Layer
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
        <div class="tech-tag">Nitro</div>
        <div class="tech-tag">Prisma</div>
        <div class="tech-tag">PostgreSQL</div>
      </div>
    </div>

    <main class="main">
      <div class="main-header">
        <h1>{{ currentMenu?.label }}</h1>
        <span class="render-badge">
          <span class="dot" />
          Server Side · SSR
        </span>
      </div>

      <!-- Server Info -->
      <div v-if="active === 'server'" class="section">
        <div class="terminal">
          <div class="terminal-bar">
            <div class="terminal-dots">
              <span /><span /><span />
            </div>
            <span class="terminal-title">nitro server — /api/info</span>
          </div>
          <div class="terminal-body">
            <div v-if="infoPending" class="term-line">
              <span class="term-prompt">$</span>
              <span class="term-text blink-cursor">fetching server info...</span>
            </div>
            <template v-else>
              <div class="term-line">
                <span class="term-prompt">$</span>
                <span class="term-text dim">GET /api/info → 200 OK</span>
              </div>
              <div v-for="(val, key) in infoData" :key="key" class="term-line">
                <span class="term-key">{{ key }}</span>
                <span class="term-sep">:</span>
                <span class="term-val">{{ typeof val === 'object' ? JSON.stringify(val) : val }}</span>
              </div>
            </template>
          </div>
        </div>

        <div class="demo-card">
          <h3>Nitro Server Routes</h3>
          <p class="hint">File di <code>server/api/</code> otomatis jadi REST endpoint.</p>
          <div class="route-list">
            <div class="route-item">
              <span class="method get">GET</span>
              <span class="route-path">/api/ping</span>
              <span class="route-file">server/api/ping.get.ts</span>
            </div>
            <div class="route-item">
              <span class="method get">GET</span>
              <span class="route-path">/api/info</span>
              <span class="route-file">server/api/info.get.ts</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Database -->
      <div v-if="active === 'database'" class="section">
        <div class="demo-card">
          <h3>Prisma Schema</h3>
          <p class="hint">Model yang sudah di-push ke Supabase PostgreSQL.</p>
          <div class="schema-list">
            <div v-for="model in models" :key="model.name" class="schema-item">
              <div class="schema-header">
                <span class="schema-icon">🗂</span>
                <span class="schema-name">{{ model.name }}</span>
                <span class="schema-table">{{ model.table }}</span>
              </div>
              <div class="schema-fields">
                <span v-for="field in model.fields" :key="field" class="schema-field">{{ field }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="demo-card">
          <h3>Koneksi Database</h3>
          <p class="hint">Prisma menggunakan Transaction Pooler Supabase untuk performa optimal.</p>
          <div class="db-status">
            <div class="db-status-row">
              <span class="fetch-key">Provider</span>
              <span class="fetch-val">PostgreSQL (Supabase)</span>
            </div>
            <div class="db-status-row">
              <span class="fetch-key">Pooler</span>
              <span class="fetch-val">Transaction (port 6543)</span>
            </div>
            <div class="db-status-row">
              <span class="fetch-key">Region</span>
              <span class="fetch-val">ap-southeast-1 (Singapore)</span>
            </div>
            <div class="db-status-row">
              <span class="fetch-key">ORM</span>
              <span class="fetch-val">Prisma v7</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Middleware -->
      <div v-if="active === 'middleware'" class="section">
        <div class="demo-card">
          <h3>Server Middleware</h3>
          <p class="hint">Kode yang berjalan di server sebelum setiap request diproses.</p>
          <div class="middleware-flow">
            <div class="flow-item request">
              <span class="flow-icon">🌐</span>
              <span>Request masuk</span>
            </div>
            <div class="flow-arrow">↓</div>
            <div class="flow-item middleware">
              <span class="flow-icon">🔧</span>
              <span><code>server/middleware/dev-badge.ts</code></span>
              <span class="flow-sub">Inject header X-Layer: server</span>
            </div>
            <div class="flow-arrow">↓</div>
            <div class="flow-item handler">
              <span class="flow-icon">⚙️</span>
              <span>Route handler</span>
            </div>
            <div class="flow-arrow">↓</div>
            <div class="flow-item response">
              <span class="flow-icon">📤</span>
              <span>Response dikirim</span>
            </div>
          </div>
        </div>

        <div class="terminal">
          <div class="terminal-bar">
            <div class="terminal-dots"><span /><span /><span /></div>
            <span class="terminal-title">server/middleware/dev-badge.ts</span>
          </div>
          <div class="terminal-body code">
            <div class="term-line"><span class="code-keyword">export default</span> <span class="code-fn">defineEventHandler</span><span class="code-dim">((event) => {'{'}</span></div>
            <div class="term-line"><span class="code-dim">&nbsp;&nbsp;setResponseHeader(event,</span></div>
            <div class="term-line"><span class="code-str">&nbsp;&nbsp;&nbsp;&nbsp;'X-Rendered-By'</span><span class="code-dim">,</span> <span class="code-str">'Nuxt Backend'</span><span class="code-dim">)</span></div>
            <div class="term-line"><span class="code-dim">{'}'}</span><span class="code-dim">)</span></div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const active = ref('server')

const menu = [
  { id: 'server', label: 'Server Info', icon: '🖥️' },
  { id: 'database', label: 'Database', icon: '🗄️' },
  { id: 'middleware', label: 'Middleware', icon: '🔧' },
]

const currentMenu = computed(() => menu.find(m => m.id === active.value))

const { data: infoData, pending: infoPending } = await useFetch('/api/info')

const models = [
  { name: 'User', table: 'users', fields: ['id', 'name', 'email', 'role'] },
  { name: 'Course', table: 'courses', fields: ['id', 'title', 'description', 'isPublished'] },
  { name: 'Lesson', table: 'lessons', fields: ['id', 'courseId', 'title', 'type', 'order'] },
  { name: 'Enrollment', table: 'enrollments', fields: ['id', 'userId', 'courseId', 'progress'] },
  { name: 'Quiz', table: 'quizzes', fields: ['id', 'lessonId', 'question'] },
]
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
  background: rgba(16,185,129,0.04);
  border-right: 1px solid rgba(16,185,129,0.15);
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
.back:hover { color: #34d399; }

.layer-badge {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 12px;
  background: linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.1));
  border: 1px solid rgba(16,185,129,0.3);
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #6ee7b7;
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
.nav-item:hover { background: rgba(16,185,129,0.1); color: #6ee7b7; }
.nav-item.active { background: rgba(16,185,129,0.15); color: #34d399; font-weight: 600; }
.nav-icon { font-size: 1rem; }

.sidebar-footer { display: flex; flex-wrap: wrap; gap: 6px; }
.tech-tag {
  padding: 3px 8px;
  background: rgba(16,185,129,0.1);
  border: 1px solid rgba(16,185,129,0.2);
  border-radius: 6px;
  font-size: 0.7rem;
  color: #10b981;
  font-family: monospace;
}

/* MAIN */
.main { flex: 1; padding: 2rem; overflow-y: auto; }

.main-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.main-header h1 { font-size: 1.5rem; font-weight: 700; }

.render-badge {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 6px 12px;
  background: rgba(16,185,129,0.1);
  border: 1px solid rgba(16,185,129,0.2);
  border-radius: 99px;
  font-size: 0.75rem;
  color: #34d399;
  font-family: monospace;
}

.dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #10b981;
  animation: blink 1.5s ease-in-out infinite;
}

.section { display: flex; flex-direction: column; gap: 1rem; }

/* TERMINAL */
.terminal {
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(16,185,129,0.2);
  background: #0d1117;
}

.terminal-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: rgba(16,185,129,0.08);
  border-bottom: 1px solid rgba(16,185,129,0.15);
}

.terminal-dots { display: flex; gap: 6px; }
.terminal-dots span {
  width: 10px; height: 10px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
}

.terminal-title { font-size: 0.75rem; color: #52525b; font-family: monospace; }

.terminal-body {
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.term-line {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.8rem;
}

.term-prompt { color: #10b981; font-weight: 700; }
.term-text { color: #a1a1aa; }
.term-text.dim { color: #3f3f46; }
.term-key { color: #6ee7b7; min-width: 100px; }
.term-sep { color: #3f3f46; }
.term-val { color: #a5f3d0; }
.blink-cursor::after {
  content: '▋';
  animation: blink 1s step-end infinite;
}

.terminal-body.code { gap: 2px; }
.code-keyword { color: #f472b6; }
.code-fn { color: #34d399; }
.code-dim { color: #3f3f46; }
.code-str { color: #fbbf24; }

/* DEMO CARD */
.demo-card {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.demo-card h3 { font-size: 1rem; font-weight: 700; color: #e4e4e7; }
.hint { font-size: 0.8rem; color: #52525b; }
.hint code { color: #34d399; background: rgba(16,185,129,0.1); padding: 1px 5px; border-radius: 4px; }

/* ROUTES */
.route-list { display: flex; flex-direction: column; gap: 8px; }
.route-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: rgba(0,0,0,0.3);
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.8rem;
}
.method {
  padding: 2px 8px;
  border-radius: 5px;
  font-size: 0.7rem;
  font-weight: 700;
}
.method.get { background: rgba(16,185,129,0.2); color: #34d399; }
.route-path { color: #e4e4e7; flex: 1; }
.route-file { color: #52525b; font-size: 0.7rem; }

/* SCHEMA */
.schema-list { display: flex; flex-direction: column; gap: 10px; }
.schema-item {
  padding: 12px;
  background: rgba(0,0,0,0.2);
  border: 1px solid rgba(16,185,129,0.1);
  border-radius: 10px;
}
.schema-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.schema-icon { font-size: 0.9rem; }
.schema-name { font-size: 0.875rem; font-weight: 700; color: #e4e4e7; font-family: monospace; }
.schema-table { font-size: 0.7rem; color: #52525b; font-family: monospace; }
.schema-fields { display: flex; flex-wrap: wrap; gap: 5px; }
.schema-field {
  padding: 2px 8px;
  background: rgba(16,185,129,0.08);
  border: 1px solid rgba(16,185,129,0.15);
  border-radius: 5px;
  font-size: 0.7rem;
  color: #6ee7b7;
  font-family: monospace;
}

/* DB STATUS */
.db-status { display: flex; flex-direction: column; gap: 8px; }
.db-status-row { display: flex; justify-content: space-between; align-items: center; }
.fetch-key { font-size: 0.75rem; color: #52525b; font-family: monospace; }
.fetch-val {
  font-size: 0.75rem;
  color: #6ee7b7;
  font-family: monospace;
  background: rgba(16,185,129,0.08);
  padding: 2px 8px;
  border-radius: 6px;
}

/* MIDDLEWARE FLOW */
.middleware-flow {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}
.flow-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 0.8rem;
  width: 100%;
}
.flow-item.request { background: rgba(59,130,246,0.1); color: #93c5fd; }
.flow-item.middleware { background: rgba(16,185,129,0.12); color: #6ee7b7; flex-direction: column; align-items: flex-start; }
.flow-item.handler { background: rgba(250,204,21,0.1); color: #fde047; }
.flow-item.response { background: rgba(99,102,241,0.1); color: #a5b4fc; }
.flow-sub { font-size: 0.7rem; color: #52525b; margin-left: 24px; }
.flow-item code { color: #34d399; font-family: monospace; }
.flow-arrow { color: #27272a; font-size: 1.2rem; padding-left: 20px; }

@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
</style>
