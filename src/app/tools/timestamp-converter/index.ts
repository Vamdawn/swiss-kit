import type { ToolMeta } from '../types'
import TimestampConverterTool from './TimestampConverterTool.vue'

export const timestampConverterTool: ToolMeta = {
  name: 'timestamp-converter',
  title: '时间戳转换',
  description: 'Unix 时间戳与日期时间互相转换',
  path: '/tools/timestamp-converter',
  component: TimestampConverterTool,
  icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4v6l4 4',
  gradientVar: '--tool-timestamp-gradient',
}
