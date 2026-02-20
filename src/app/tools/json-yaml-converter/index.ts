import type { ToolMeta } from '../types'
import JsonYamlConverterTool from './JsonYamlConverterTool.vue'

export const jsonYamlConverterTool: ToolMeta = {
  name: 'json-yaml-converter',
  title: 'JSON ↔ YAML',
  description: 'JSON 与 YAML 格式互相转换',
  path: '/tools/json-yaml-converter',
  component: JsonYamlConverterTool,
  icon: 'M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3m-7-10h6m-6 4h6m-6 4h6M7 8l2 2-2 2',
  gradientVar: '--tool-json-yaml-gradient',
}
