<script setup lang="ts">
import { useRouter } from 'vue-router'
import { toolRegistry } from '@/tools/registry'

const router = useRouter()

function navigateTo(name: string) {
  router.push({ name })
}
</script>

<template>
  <div class="home">
    <div class="home-header">
      <h1 class="home-title">Swiss Kit</h1>
      <p class="home-subtitle">开发者常用工具集合</p>
      <div class="home-divider" />
    </div>

    <div class="tool-grid">
      <button
        v-for="tool in toolRegistry"
        :key="tool.name"
        class="tool-tile"
        @click="navigateTo(tool.name)"
      >
        <div class="tile-icon-area" :style="{ background: `var(${tool.gradientVar})` }">
          <svg
            class="tile-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path :d="tool.icon" />
          </svg>
        </div>
        <span class="tile-title">{{ tool.title }}</span>
        <span class="tile-desc">{{ tool.description }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.home {
  max-width: 720px;
  margin: 0 auto;
}

.home-header {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.home-title {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 2.5rem;
  margin: 0;
  background: var(--brand-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.home-subtitle {
  color: var(--color-text-secondary);
  margin: var(--space-sm) 0 0;
  font-size: 1rem;
}

.home-divider {
  width: 60px;
  height: 3px;
  background: var(--brand-gradient);
  border-radius: 2px;
  margin: var(--space-lg) auto 0;
}

.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
}

.tool-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xl) var(--space-md) var(--space-lg);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  cursor: pointer;
  font-family: var(--font-body);
  color: var(--color-text);
  transition:
    transform var(--transition-normal),
    box-shadow var(--transition-normal),
    border-color var(--transition-normal);
  box-shadow: var(--shadow-sm);
}

.tool-tile:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-accent);
}

.tool-tile:active {
  transform: translateY(-1px) scale(0.98);
  transition-duration: 80ms;
}

.tile-icon-area {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-xs);
  transition: transform var(--transition-normal);
  box-shadow: var(--shadow-md);
}

.tool-tile:hover .tile-icon-area {
  transform: scale(1.08) rotate(3deg);
}

.tile-icon {
  width: 28px;
  height: 28px;
  color: #fff;
}

.tile-title {
  font-weight: 600;
  font-size: 0.9rem;
  text-align: center;
  line-height: 1.3;
}

.tile-desc {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  text-align: center;
  line-height: 1.4;
}
</style>
