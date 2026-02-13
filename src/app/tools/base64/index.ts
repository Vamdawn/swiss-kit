import type { ToolMeta } from '../types'
import Base64Tool from './Base64Tool.vue'

export const base64Tool: ToolMeta = {
  name: 'base64',
  title: 'Base64 编解码',
  description: '文本的 Base64 编码与解码',
  path: '/tools/base64',
  component: Base64Tool,
  icon: 'M4 7v10m16-10v10M7 4h10M7 20h10m-8-8h6M9 9l-2 3 2 3m6-6 2 3-2 3',
  gradientVar: '--tool-base64-gradient',
}
