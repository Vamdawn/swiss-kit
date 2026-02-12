import type { Component } from 'vue'

export interface ToolMeta {
  name: string // 路由名称，如 'json-formatter'
  title: string // 显示标题，如 'JSON 格式化'
  description: string // 简短描述
  path: string // 路由路径，如 '/tools/json-formatter'
  component: Component
}
