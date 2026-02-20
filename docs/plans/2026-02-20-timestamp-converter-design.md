# 时间戳转换器 设计文档

> M1 第 2 个工具 — 时间戳转换器

## 概述

提供 Unix 时间戳与可读日期时间的双向转换，支持智能识别输入类型，一次输入展示所有常见格式。

## 设计决策

| 决策项   | 选择                         | 理由                                      |
| -------- | ---------------------------- | ----------------------------------------- |
| 布局模式 | 统一输入 + 多格式输出        | 一个输入框解决所有问题，紧凑直观          |
| 输入解析 | 智能识别双向                 | 纯数字视为时间戳，日期字符串解析为日期    |
| 时区处理 | 同时显示本地 + UTC           | 覆盖最常见场景，无需额外 UI 复杂度        |
| 日期库   | 纯原生 JS（Date + Intl API） | 零依赖，包体积小，时间戳场景原生 API 足够 |

## 功能规格

### 输入

- 单个输入框，实时解析
- 智能识别两种输入类型：
  - **纯数字** → Unix 时间戳（≤ 10 位为秒，13 位为毫秒）
  - **日期字符串** → `new Date()` 解析（ISO 8601、`YYYY-MM-DD HH:mm:ss`、`Feb 20, 2024` 等）
- "当前时间" 快捷按钮：填入 `Date.now()`

### 输出（每项带复制按钮）

| 格式      | 示例                              |
| --------- | --------------------------------- |
| 识别类型  | "识别为: Unix 时间戳 (秒)"        |
| Unix 秒   | `1708416000`                      |
| Unix 毫秒 | `1708416000000`                   |
| ISO 8601  | `2024-02-20T08:00:00.000Z`        |
| 本地时间  | `2024/02/20 16:00:00`             |
| UTC 时间  | `2024/02/20 08:00:00`             |
| RFC 2822  | `Tue, 20 Feb 2024 08:00:00 +0000` |
| 相对时间  | `2 年前`                          |

### 快捷操作

- "当前时间" 按钮：`input.value = Date.now().toString()`

## 文件结构

```
src/app/tools/timestamp-converter/
├── index.ts                          # ToolMeta 导出
├── TimestampConverterTool.vue        # 主 Vue 组件
├── utils.ts                          # 纯函数逻辑
└── __tests__/
    └── timestamp-converter.test.ts   # 单元测试
```

## utils.ts API 设计

```typescript
// 智能解析输入，返回毫秒级时间戳
parseInput(input: string): { type: 'timestamp-s' | 'timestamp-ms' | 'date'; ms: number } | null

// 判断数字是秒还是毫秒
isMilliseconds(num: number): boolean

// 各种格式化函数，均接收毫秒级时间戳
formatISO8601(ms: number): string
formatLocalTime(ms: number): string
formatUTCTime(ms: number): string
formatRFC2822(ms: number): string
formatRelativeTime(ms: number, now?: number): string  // now 参数便于测试
```

## Vue 组件设计

```
┌─────────────────────────────────────┐
│  ToolPageHeader (标题 + 渐变图标)    │
├─────────────────────────────────────┤
│  [当前时间]                          │
│  ┌─────────────────────────────────┐ │
│  │ 输入框（placeholder: 输入时间  │ │
│  │ 戳或日期字符串...）             │ │
│  └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│  ✅ 识别为: Unix 时间戳 (秒)        │
├─────────────────────────────────────┤
│  Unix (秒)    1708416000      [复制] │
│  Unix (毫秒)  1708416000000  [复制] │
│  ISO 8601     2024-02-20T...  [复制] │
│  本地时间     2024/02/20 ...  [复制] │
│  UTC 时间     2024/02/20 ...  [复制] │
│  RFC 2822     Tue, 20 Feb...  [复制] │
│  相对时间     2 年前                 │
└─────────────────────────────────────┘
```

### 响应式逻辑

- `input: ref<string>` — 输入框双向绑定
- `parsed: computed` — 调用 `parseInput(input.value)`
- 各输出格式为独立 computed，依赖 `parsed`
- 错误状态：`parsed` 为 null 时显示 NAlert 错误提示

## 主题配色

CSS 变量：`--tool-timestamp-gradient`

| 主题        | 渐变色                                      |
| ----------- | ------------------------------------------- |
| default     | `linear-gradient(135deg, #667eea, #4facfe)` |
| ink-wash    | `linear-gradient(135deg, #6b8fa3, #4a7c8f)` |
| twilight    | `linear-gradient(135deg, #a78bfa, #818cf8)` |
| nord        | `linear-gradient(135deg, #81a1c1, #88c0d0)` |
| github-dark | `linear-gradient(135deg, #79c0ff, #58a6ff)` |

## 测试计划

### utils.ts 单元测试

- `parseInput`：纯数字（秒）、纯数字（毫秒）、ISO 日期、本地日期、无效输入、空字符串
- `isMilliseconds`：10 位 vs 13 位数字
- `formatISO8601`：标准输出
- `formatLocalTime`：本地格式输出
- `formatUTCTime`：UTC 格式输出
- `formatRFC2822`：RFC 格式输出
- `formatRelativeTime`：秒/分/时/天/月/年 各级别、过去/未来
