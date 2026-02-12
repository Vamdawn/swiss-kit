import type { ToolMeta } from '../types'
import Base64Tool from './Base64Tool.vue'

export const base64Tool: ToolMeta = {
  name: 'base64',
  title: 'Base64 编解码',
  description: '文本的 Base64 编码与解码',
  path: '/tools/base64',
  component: Base64Tool,
}
