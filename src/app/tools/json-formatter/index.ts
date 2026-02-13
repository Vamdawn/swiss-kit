import type { ToolMeta } from '../types'
import JsonFormatterTool from './JsonFormatterTool.vue'

export const jsonFormatterTool: ToolMeta = {
  name: 'json-formatter',
  title: 'JSON 格式化',
  description: '美化、压缩、语法校验',
  path: '/tools/json-formatter',
  component: JsonFormatterTool,
  icon: 'M8 3a1 1 0 0 0-1 1v3.5a2.5 2.5 0 0 1-1.4 2.25L5 10l.6.25A2.5 2.5 0 0 1 7 12.5V16a1 1 0 0 0 1 1m8-14a1 1 0 0 1 1 1v3.5a2.5 2.5 0 0 0 1.4 2.25L19 10l-.6.25A2.5 2.5 0 0 0 17 12.5V16a1 1 0 0 1-1 1',
  gradientVar: '--tool-json-gradient',
}
