<script setup lang="ts">
import { computed } from 'vue'
import { NConfigProvider, darkTheme } from 'naive-ui'
import type { GlobalThemeOverrides } from 'naive-ui'
import Layout from '@/components/Layout.vue'
import { useTheme } from '@/composables/useTheme'

const { currentThemeMeta } = useTheme()

const naiveTheme = computed(() => (currentThemeMeta.value.isDark ? darkTheme : null))

const hoverColorMap: Record<string, string> = {
  '#1a7a6d': '#15665b',
  '#4a7c6f': '#3d6a5e',
  '#c792ea': '#d4a8f0',
  '#88c0d0': '#8fbcbb',
  '#58a6ff': '#79b8ff',
}

const themeOverrides = computed<GlobalThemeOverrides>(() => ({
  common: {
    primaryColor: currentThemeMeta.value.accent,
    primaryColorHover:
      hoverColorMap[currentThemeMeta.value.accent] ?? currentThemeMeta.value.accent,
  },
}))
</script>

<template>
  <NConfigProvider :theme="naiveTheme" :theme-overrides="themeOverrides">
    <Layout />
  </NConfigProvider>
</template>
