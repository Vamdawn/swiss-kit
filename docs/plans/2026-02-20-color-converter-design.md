# 颜色转换器/选择器 设计文档

> Swiss Kit M1 第 4 个工具

## 概述

一个颜色格式转换工具，支持 HEX / RGB / HSL / CSS Named Colors 四种格式的双向转换。用户输入任意格式的颜色值，工具自动识别格式并同时展示所有格式的转换结果，一键复制。

## 设计决策

| 决策项           | 选择              | 理由                                               |
| ---------------- | ----------------- | -------------------------------------------------- |
| 布局             | 单面板 + 大预览区 | 操作路径最短，符合「3 秒完成」原则                 |
| 输入方式         | 纯文本智能识别    | 无需先选格式，直接粘贴任意颜色值即可               |
| 调色板/渐变      | 不做              | YAGNI，核心是格式转换不是调色                      |
| CSS Named Colors | 双向支持          | 输入识别 + 输出反向查找，148 个 CSS Level 4 命名色 |

## 目录结构

```
src/app/tools/color-converter/
├── index.ts                    # ToolMeta 导出
├── ColorConverterTool.vue      # 主组件
├── utils.ts                    # 颜色解析与转换纯函数
└── __tests__/
    └── color-converter.test.ts # 单元测试
```

## 数据流

```
用户输入文本
  ↓
parseColorInput(input)        ← 智能解析，识别格式
  ↓
{ r, g, b } 内部标准格式       ← 0-255 整数
  ↓ computed 派生
┌─────────────────────────────┐
│ toHex(rgb)         → #FF6B6B           │
│ toRgb(rgb)         → rgb(255, 107, 107)│
│ toHsl(rgb)         → hsl(0, 100%, 71%) │
│ findNamedColor(rgb) → tomato / null     │
└─────────────────────────────┘
```

## 智能输入解析规则（按优先级）

1. **HEX**：`#` 开头，支持 3 位（`#F00`）、6 位（`#FF0000`）、8 位含 alpha（`#FF000080`）
2. **RGB**：`rgb(` / `rgba(` 开头，或纯数字逗号分隔如 `255,107,107`
3. **HSL**：`hsl(` / `hsla(` 开头
4. **CSS Named Color**：精确匹配 148 个 CSS Level 4 命名色（不区分大小写）

解析失败返回 `null`，UI 显示警告提示。

## UI 布局

```
┌──────────────────────────────────────────┐
│  ToolPageHeader（图标 + 标题 + 描述）     │
├──────────────────────────────────────────┤
│  [●][颜色输入框 placeholder: #FF6B6B...]  │
│  ⚠ 无法识别的颜色格式（仅错误时显示）      │
├──────────────────────────────────────────┤
│  ┌──────────┐  HEX  #FF6B6B       [复制] │
│  │          │  RGB  rgb(255,107,107)[复制] │
│  │  大色块   │  HSL  hsl(0,100%,71%) [复制]│
│  │  预览区   │  CSS  tomato          [复制]│
│  │  120x120 │                             │
│  └──────────┘                             │
├──────────────────────────────────────────┤
│  ● ● ● ● ● ● ● ● ● ● ● ●（快捷常用色）  │
└──────────────────────────────────────────┘
```

### 区域说明

**① 输入区**

- `NInput` 文本输入框
- 左侧嵌入 16x16px 圆形色块指示器，实时显示解析到的颜色
- 右侧清除按钮
- 错误时下方 `NAlert type="warning"`

**② 预览 + 结果区**

- 左侧：120x120px 圆角矩形色块，叠加自适应对比度的 HEX 文字
- 右侧：4 行格式化结果，每行 = 格式标签 + 值 + CopyButton
- CSS Named Color 无匹配时显示灰色斜体「无匹配的命名色」，CopyButton 禁用

**③ 快捷常用色区**

- 底部一排 12-16 个 CSS 常用色圆点
- 点击填入输入框，兼做空状态引导

## utils.ts 函数签名

```typescript
// 内部 RGB 类型
interface RGB {
  r: number
  g: number
  b: number
}
interface HSL {
  h: number
  s: number
  l: number
}

// 解析输入
function parseColorInput(input: string): RGB | null

// RGB → 各格式
function toHex(rgb: RGB): string // '#FF6B6B'
function toRgbString(rgb: RGB): string // 'rgb(255, 107, 107)'
function toHslString(rgb: RGB): string // 'hsl(0, 100%, 71%)'
function findNamedColor(rgb: RGB): string | null // 'tomato' or null

// 内部转换
function rgbToHsl(rgb: RGB): HSL
function hslToRgb(hsl: HSL): RGB

// UI 辅助
function getContrastColor(rgb: RGB): '#000000' | '#FFFFFF'
```

## 测试覆盖

### parseColorInput

- HEX：3 位、6 位、8 位
- RGB：`rgb()` / `rgba()` / 纯逗号分隔
- HSL：`hsl()` / `hsla()`
- CSS Named：`red`、`tomato`、`steelblue`（不区分大小写）
- 无效输入：空字符串、`hello`、`#ZZZZZZ` → null

### 格式转换

- 已知颜色互转验证：red = #FF0000 = rgb(255,0,0) = hsl(0,100%,50%)
- 边界值：纯黑 #000000、纯白 #FFFFFF

### findNamedColor

- 精确匹配：`{r:255,g:99,b:71}` → `tomato`
- 无匹配：`{r:255,g:100,b:71}` → `null`

### getContrastColor

- 深色背景 → `#FFFFFF`
- 浅色背景 → `#000000`

## 主题渐变配色

CSS 变量名：`--tool-color-gradient`

| 主题        | 渐变色                |
| ----------- | --------------------- |
| default     | 粉色 → 橙色（暖色调） |
| ink-wash    | 淡墨绿 → 淡墨紫       |
| twilight    | 品红 → 紫罗兰         |
| nord        | 浅蓝 → 浅绿           |
| github-dark | 蓝 → 紫               |

## ToolMeta 注册

```typescript
export const colorConverterTool: ToolMeta = {
  name: 'color-converter',
  title: '颜色转换',
  description: 'HEX、RGB、HSL、CSS 命名色互相转换',
  path: '/tools/color-converter',
  component: ColorConverterTool,
  icon: '...', // 调色盘/滴管 SVG path
  gradientVar: '--tool-color-gradient',
}
```
