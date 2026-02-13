import type { ToolMeta } from '../types'
import UrlEncoderTool from './UrlEncoderTool.vue'

export const urlEncoderTool: ToolMeta = {
  name: 'url-encoder',
  title: 'URL 编解码',
  description: 'encodeURIComponent / decodeURIComponent',
  path: '/tools/url-encoder',
  component: UrlEncoderTool,
  icon: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
  gradientVar: '--tool-url-gradient',
}
