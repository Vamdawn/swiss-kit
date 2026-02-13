<script setup lang="ts">
import { ref } from 'vue'
import { NPopover } from 'naive-ui'
import { useTheme } from '@/composables/useTheme'

const { themes, currentTheme, setTheme, currentThemeMeta } = useTheme()

const showPopover = ref(false)

function selectTheme(key: string) {
  setTheme(key)
  showPopover.value = false
}
</script>

<template>
  <NPopover v-model:show="showPopover" trigger="click" placement="top" content-style="padding: 0">
    <template #trigger>
      <button class="trigger-btn" type="button" aria-label="Switch theme">
        <svg
          class="trigger-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="13.5" cy="6.5" r="2.5" />
          <circle cx="19" cy="13" r="2.5" />
          <circle cx="16" cy="20" r="2.5" />
          <circle cx="7.5" cy="20" r="2.5" />
          <circle cx="5" cy="13" r="2.5" />
          <circle cx="12" cy="12" r="4" fill="currentColor" />
        </svg>
        <span class="trigger-label">{{ currentThemeMeta.label }}</span>
      </button>
    </template>
    <div class="theme-grid">
      <button
        v-for="theme in themes"
        :key="theme.key"
        type="button"
        class="theme-option"
        :class="{ active: currentTheme === theme.key }"
        :aria-label="`Switch to ${theme.label} theme`"
        @click="selectTheme(theme.key)"
      >
        <span class="theme-dot" :style="{ backgroundColor: theme.accent }" />
        <span class="theme-name">{{ theme.label }}</span>
      </button>
    </div>
  </NPopover>
</template>

<style scoped>
.trigger-btn {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg-card);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: 14px;
  cursor: pointer;
  transition:
    background var(--transition-fast),
    border-color var(--transition-fast);
}

.trigger-btn:hover {
  background: var(--color-bg-card-hover);
  border-color: var(--color-accent);
}

.trigger-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: var(--color-accent);
}

.trigger-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.theme-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-xs);
  padding: var(--space-sm);
}

.theme-option {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm);
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  background: none;
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  transition:
    background var(--transition-fast),
    border-color var(--transition-fast);
}

.theme-option:hover {
  background: var(--color-bg-card-hover);
}

.theme-option.active {
  background: var(--color-accent-light);
  border-color: var(--color-accent);
}

.theme-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
}

.theme-name {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
