<script setup lang="ts">
import { NLayout, NLayoutSider, NMenu, NLayoutContent } from 'naive-ui'
import { computed, h } from 'vue'
import type { MenuOption } from 'naive-ui'
import { useRouter, useRoute } from 'vue-router'
import { toolRegistry } from '@/tools/registry'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'

const router = useRouter()
const route = useRoute()

function renderToolIcon(icon: string) {
  return () =>
    h(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        style: 'width: 18px; height: 18px;',
      },
      [h('path', { d: icon })],
    )
}

const menuOptions = computed<MenuOption[]>(() => {
  const homeOption: MenuOption = {
    label: '首页',
    key: 'home',
    icon: renderToolIcon('M3 9.5L12 3l9 6.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5z M9 22V12h6v10'),
  }
  const toolOptions: MenuOption[] = toolRegistry.map((tool) => ({
    label: tool.title,
    key: tool.name,
    icon: renderToolIcon(tool.icon),
  }))
  return [homeOption, { type: 'divider', key: 'divider' }, ...toolOptions]
})

const activeKey = computed(() => route.name as string)

function handleMenuUpdate(key: string) {
  router.push({ name: key })
}
</script>

<template>
  <NLayout has-sider class="app-layout">
    <NLayoutSider
      bordered
      :width="240"
      content-style="padding: 16px; display: flex; flex-direction: column;"
    >
      <div class="sidebar-brand" @click="router.push({ name: 'home' })">
        <svg
          class="brand-logo"
          viewBox="0 0 24 24"
          fill="none"
          stroke="url(#brandGrad)"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <defs>
            <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="var(--color-accent)" />
              <stop offset="100%" stop-color="#667eea" />
            </linearGradient>
          </defs>
          <path
            d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
          />
        </svg>
        <span class="brand-text">Swiss Kit</span>
      </div>

      <NMenu
        :options="menuOptions"
        :value="activeKey"
        class="sidebar-menu"
        @update:value="handleMenuUpdate"
      />
      <ThemeSwitcher />
    </NLayoutSider>
    <NLayoutContent content-style="padding: 32px; background: var(--color-bg); overflow-y: auto;">
      <RouterView v-slot="{ Component }">
        <Transition name="fade-slide" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </NLayoutContent>
  </NLayout>
</template>

<style scoped>
.app-layout {
  height: 100vh;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-xs) var(--space-md);
  cursor: pointer;
  user-select: none;
}

.brand-logo {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}

.brand-text {
  font-family: var(--font-display);
  font-size: 22px;
  background: var(--brand-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.sidebar-menu {
  flex: 1;
}

/* Page transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 200ms ease,
    transform 200ms ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(12px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}
</style>
