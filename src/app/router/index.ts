import type { RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'
import { toolRegistry } from '@/tools/registry'

const toolRoutes: RouteRecordRaw[] = toolRegistry.map((tool) => ({
  path: tool.path,
  name: tool.name,
  component: tool.component,
  meta: { title: tool.title },
}))

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  ...toolRoutes,
]
