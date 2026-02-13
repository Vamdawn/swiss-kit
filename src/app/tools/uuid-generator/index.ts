import type { ToolMeta } from '../types'
import UuidGeneratorTool from './UuidGeneratorTool.vue'

export const uuidGeneratorTool: ToolMeta = {
  name: 'uuid-generator',
  title: 'UUID/ULID 生成器',
  description: '生成 UUID v4 / v7 / ULID',
  path: '/tools/uuid-generator',
  component: UuidGeneratorTool,
  icon: 'M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4m-2 6V6a2 2 0 1 1 4 0v2m-2 5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3',
  gradientVar: '--tool-uuid-gradient',
}
