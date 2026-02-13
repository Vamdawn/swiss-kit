<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  icon: string
  gradientVar: string
}>()
</script>

<template>
  <div class="tool-page-header">
    <div class="tool-icon-wrapper" :style="{ background: `var(${gradientVar})` }">
      <svg
        class="tool-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path :d="icon" />
      </svg>
    </div>
    <div class="tool-header-text">
      <h2 class="tool-title">{{ title }}</h2>
      <p v-if="description" class="tool-description">{{ description }}</p>
    </div>
  </div>
</template>

<style scoped>
.tool-page-header {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
  padding-bottom: var(--space-lg);
  border-bottom: 2px solid var(--color-border);
}

.tool-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: var(--shadow-md);
}

.tool-icon {
  width: 26px;
  height: 26px;
  color: #fff;
}

.tool-header-text {
  min-width: 0;
}

.tool-title {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 1.5rem;
  margin: 0;
  line-height: 1.2;
}

.tool-description {
  margin: 4px 0 0;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}
</style>
