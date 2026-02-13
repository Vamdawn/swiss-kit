<script setup lang="ts">
import { computed } from 'vue'
import { NConfigProvider, darkTheme } from 'naive-ui'
import type { GlobalThemeOverrides } from 'naive-ui'
import Layout from '@/components/Layout.vue'
import { useTheme } from '@/composables/useTheme'

const { currentThemeMeta } = useTheme()

const naiveTheme = computed(() => (currentThemeMeta.value.isDark ? darkTheme : null))

const themeOverrides = computed<GlobalThemeOverrides>(() => ({
  common: {
    primaryColor: currentThemeMeta.value.accent,
    primaryColorHover: currentThemeMeta.value.accentHover,
  },
}))
</script>

<template>
  <NConfigProvider :theme="naiveTheme" :theme-overrides="themeOverrides">
    <Layout />
  </NConfigProvider>
</template>
