<script setup lang="ts">
import { NCard, NGrid, NGridItem } from 'naive-ui'
import { useRouter } from 'vue-router'
import { toolRegistry } from '@/tools/registry'

const router = useRouter()

function navigateTo(name: string) {
  router.push({ name })
}
</script>

<template>
  <div>
    <h1 style="font-family: var(--font-display); margin: 0 0 var(--space-lg)">Swiss Kit</h1>
    <p style="color: var(--color-text-secondary); margin-bottom: var(--space-xl)">
      开发者常用工具集合
    </p>
    <NGrid :x-gap="16" :y-gap="16" :cols="3">
      <NGridItem v-for="tool in toolRegistry" :key="tool.name">
        <NCard hoverable style="cursor: pointer" @click="navigateTo(tool.name)">
          <template #header>{{ tool.title }}</template>
          {{ tool.description }}
        </NCard>
      </NGridItem>
    </NGrid>
  </div>
</template>
