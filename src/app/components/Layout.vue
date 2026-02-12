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
    <NLayoutSider bordered :width="200" content-style="padding: 12px;">
      <div style="font-size: 18px; font-weight: 600; padding: 12px 0 16px; text-align: center">
        Swiss Kit
      </div>
      <NMenu :options="menuOptions" :value="activeKey" @update:value="handleMenuUpdate" />
    </NLayoutSider>
    <NLayoutContent content-style="padding: 24px;">
      <RouterView />
    </NLayoutContent>
  </NLayout>
</template>
