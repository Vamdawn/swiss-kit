import type { ToolMeta } from '../types'
import UrlEncoderTool from './UrlEncoderTool.vue'

export const urlEncoderTool: ToolMeta = {
  name: 'url-encoder',
  title: 'URL 编解码',
  description: 'encodeURIComponent / decodeURIComponent',
  path: '/tools/url-encoder',
  component: UrlEncoderTool,
}
