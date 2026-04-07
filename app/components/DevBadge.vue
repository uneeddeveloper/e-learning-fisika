<template>
  <Teleport to="body">
    <div class="dev-badge-wrapper">
      <!-- Frontend Badge -->
      <div class="dev-badge frontend" :class="{ active: isMounted }">
        <div class="badge-glow frontend-glow" />
        <div class="badge-inner">
          <span class="badge-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </span>
          <span class="badge-label">Frontend</span>
          <span class="badge-dot" />
        </div>
      </div>

      <!-- Backend Badge -->
      <div class="dev-badge backend" :class="{ active: isMounted }">
        <div class="badge-glow backend-glow" />
        <div class="badge-inner">
          <span class="badge-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </span>
          <span class="badge-label">Backend</span>
          <span class="badge-dot" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const isMounted = ref(false)

onMounted(() => {
  setTimeout(() => {
    isMounted.value = true
  }, 300)
})
</script>

<style scoped>
.dev-badge-wrapper {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 99999;
  pointer-events: none;
}

.dev-badge {
  position: relative;
  opacity: 0;
  transform: translateX(20px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.dev-badge.active {
  opacity: 1;
  transform: translateX(0);
}

.dev-badge.backend.active {
  transition-delay: 0.1s;
}

.badge-glow {
  position: absolute;
  inset: -2px;
  border-radius: 14px;
  opacity: 0.6;
  filter: blur(8px);
  animation: pulse-glow 2.5s ease-in-out infinite;
}

.frontend-glow {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
}

.backend-glow {
  background: linear-gradient(135deg, #10b981, #059669);
}

.badge-inner {
  position: relative;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 12px 7px 10px;
  border-radius: 12px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  white-space: nowrap;
  cursor: default;
}

.frontend .badge-inner {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.85), rgba(139, 92, 246, 0.85));
  color: #fff;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4), inset 0 1px 0 rgba(255,255,255,0.2);
}

.backend .badge-inner {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.85), rgba(5, 150, 105, 0.85));
  color: #fff;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255,255,255,0.2);
}

.badge-icon {
  display: flex;
  align-items: center;
  opacity: 0.9;
}

.badge-label {
  line-height: 1;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  animation: blink 1.8s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
</style>
