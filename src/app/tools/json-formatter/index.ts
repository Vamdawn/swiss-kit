import type { ToolMeta } from '../types'
import JsonFormatterTool from './JsonFormatterTool.vue'

export const jsonFormatterTool: ToolMeta = {
  name: 'json-formatter',
  title: 'JSON 格式化',
  description: '美化、压缩、语法校验',
  path: '/tools/json-formatter',
  component: JsonFormatterTool,
}
