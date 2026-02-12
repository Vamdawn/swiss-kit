import type { ToolMeta } from '../types'
import UuidGeneratorTool from './UuidGeneratorTool.vue'

export const uuidGeneratorTool: ToolMeta = {
  name: 'uuid-generator',
  title: 'UUID/ULID 生成器',
  description: '生成 UUID v4 / v7 / ULID',
  path: '/tools/uuid-generator',
  component: UuidGeneratorTool,
}
