<script setup lang="ts">
import { NLayout, NLayoutSider, NMenu, NLayoutContent } from 'naive-ui'
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { routes } from '@/router'

const router = useRouter()
const route = useRoute()

const menuOptions = computed(() =>
  routes
    .filter((r) => r.meta?.title)
    .map((r) => ({
      label: r.meta!.title as string,
      key: r.name as string,
    })),
)

const activeKey = computed(() => route.name as string)

function handleMenuUpdate(key: string) {
  router.push({ name: key })
}
</script>

<template>
  <NLayout has-sider style="height: 100vh">
    <NLayoutSider bordered :width="220" content-style="padding: 16px;">
      <div class="sidebar-brand">Swiss Kit</div>
      <NMenu :options="menuOptions" :value="activeKey" @update:value="handleMenuUpdate" />
    </NLayoutSider>
    <NLayoutContent content-style="padding: 32px; background: var(--color-bg);">
      <RouterView />
    </NLayoutContent>
  </NLayout>
</template>

<style scoped>
.sidebar-brand {
  font-family: var(--font-display);
  font-size: 22px;
  padding: 12px 0 20px;
  text-align: center;
  color: var(--color-text);
}
</style>
