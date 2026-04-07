<template>
  <div class="home">
    <div class="bg-grid" />

    <div class="content">
      <div class="logo">⚡</div>
      <h1>E-Learning Fisika</h1>
      <p class="desc">Pilih layer untuk dieksplorasi</p>

      <div class="nav-cards">
        <NuxtLink to="/frontend" class="nav-card frontend-card">
          <div class="nav-card-bg" />
          <div class="nav-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </div>
          <div class="nav-info">
            <span class="nav-label">Frontend</span>
            <span class="nav-stack">Vue 3 · Nuxt 4 · Supabase</span>
          </div>
          <div class="nav-arrow">→</div>
          <span class="nav-dot" />
        </NuxtLink>

        <NuxtLink to="/backend" class="nav-card backend-card">
          <div class="nav-card-bg" />
          <div class="nav-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            </svg>
          </div>
          <div class="nav-info">
            <span class="nav-label">Backend</span>
            <span class="nav-stack">Nitro · Prisma · PostgreSQL</span>
          </div>
          <div class="nav-arrow">→</div>
          <span class="nav-dot" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }

.home {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #09090b;
  position: relative;
  overflow: hidden;
  font-family: system-ui, sans-serif;
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent);
}

.content {
  position: relative;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
}

.logo {
  font-size: 3rem;
  filter: drop-shadow(0 0 20px rgba(250,204,21,0.5));
  animation: float 3s ease-in-out infinite;
}

h1 {
  font-size: 2.25rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.03em;
}

.desc {
  color: #52525b;
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.nav-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 420px;
}

.nav-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.07);
  text-decoration: none;
  overflow: hidden;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.nav-card:hover {
  transform: translateY(-2px);
}

.nav-card-bg {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.nav-card:hover .nav-card-bg {
  opacity: 1;
}

.frontend-card { background: rgba(99,102,241,0.08); }
.frontend-card:hover { border-color: rgba(99,102,241,0.4); }
.frontend-card .nav-card-bg {
  background: linear-gradient(135deg, rgba(99,102,241,0.15), transparent);
}

.backend-card { background: rgba(16,185,129,0.08); }
.backend-card:hover { border-color: rgba(16,185,129,0.4); }
.backend-card .nav-card-bg {
  background: linear-gradient(135deg, rgba(16,185,129,0.15), transparent);
}

.nav-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.frontend-card .nav-icon { background: rgba(99,102,241,0.15); color: #818cf8; }
.backend-card .nav-icon { background: rgba(16,185,129,0.15); color: #34d399; }

.nav-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
  flex: 1;
}

.nav-label {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
}

.nav-stack {
  font-size: 0.75rem;
  color: #52525b;
  font-family: 'SF Mono', monospace;
}

.nav-arrow {
  font-size: 1.2rem;
  color: #3f3f46;
  transition: color 0.2s, transform 0.2s;
}

.nav-card:hover .nav-arrow {
  transform: translateX(4px);
}

.frontend-card:hover .nav-arrow { color: #818cf8; }
.backend-card:hover .nav-arrow { color: #34d399; }

.nav-dot {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  animation: blink 2s ease-in-out infinite;
}

.frontend-card .nav-dot { background: #6366f1; }
.backend-card .nav-dot { background: #10b981; }

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}
</style>
