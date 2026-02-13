# Swiss Kit UI 重设计 — 活力开发者风格

## 设计方向

"活力开发者"风格：彩色渐变、圆角磁贴、动感交互，通过主题系统控制所有配色。

## 1. 设计系统升级

### 主题驱动工具配色

每个主题 CSS 文件中定义工具专属渐变色变量：

```css
/* variables.css (默认主题) */
:root {
  --tool-json-gradient: linear-gradient(135deg, #667eea, #764ba2);
  --tool-base64-gradient: linear-gradient(135deg, #f093fb, #f5576c);
  --tool-url-gradient: linear-gradient(135deg, #4facfe, #00f2fe);
  --tool-uuid-gradient: linear-gradient(135deg, #43e97b, #38f9d7);
}
```

各主题 (twilight, nord, github-dark, ink-wash) 各自定义适配其色调的渐变色。

### ToolMeta 类型扩展

```ts
interface ToolMeta {
  name: string
  title: string
  description: string
  component: Component
  icon: string // 内联 SVG path
  gradientVar: string // CSS 变量名 '--tool-json-gradient'
}
```

### CSS 变量新增

```css
--radius-xl: 20px;
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.1);
```

### 动画

- 卡片 hover: `translateY(-4px) scale(1.02)` + 发光阴影
- 按钮点击: `scale(0.97)` 反馈
- 页面切换: fade-slide 过渡 (200ms)

## 2. 首页磁贴卡片

### 卡片结构

```
┌─────────────────────┐
│                     │
│     ┌──────────┐    │  ← 渐变色圆角背景区域
│     │   Icon   │    │  ← 白色大图标 (36px)
│     └──────────┘    │
│                     │
│    JSON 格式化       │  ← 工具名 (居中, 加粗)
│   格式化和校验 JSON   │  ← 简短描述 (居中, 次要色)
│                     │
└─────────────────────┘
```

### 布局

- CSS Grid: `grid-template-columns: repeat(auto-fill, minmax(180px, 1fr))`
- 响应式列数，`gap: 20px`
- 不再使用 Naive UI 的 NGrid/NCard

### 首页标题

- "Swiss Kit" 使用渐变文字效果
- 副标题下方有渐变分割线

## 3. 工具页面

### ToolPageHeader 公共组件

```
┌─ 渐变圆形图标 ─┬─ 工具标题  ──────────────────────┐
│     Icon       │  工具描述文字                      │
└────────────────┴───────────────────────────────────┘
```

### 编解码类左右分栏 (JSON / Base64 / URL)

```
┌──────────────────┬──┬──────────────────┐
│   输入            │  │   输出            │
│  ┌─────────────┐ │  │  ┌─────────────┐ │
│  │  textarea   │ │◀▶│  │  textarea   │ │
│  └─────────────┘ │  │  └─────────────┘ │
└──────────────────┴──┴──────────────────┘
            操作按钮栏
```

- 输入区: 白色背景卡片
- 输出区: 稍暗背景 (`--color-bg-card-hover`)，带 "输出" 标签
- 布局: `grid-template-columns: 1fr auto 1fr`
- 原生 radio → NRadioGroup + NRadioButton

### UUID 生成器

- ToolPageHeader + NRadioButton 替换原生 radio
- 结果列表: 卡片行，序号 + 等宽字体 + 复制按钮

## 4. 侧边栏优化

- 品牌区: 渐变色文字 + SVG logo 图标
- 菜单项: 添加工具图标，激活项使用渐变色左侧指示条
- 品牌区和菜单之间: 渐变分割线

## 5. 页面切换动画

```vue
<RouterView v-slot="{ Component }">
  <Transition name="fade-slide" mode="out-in">
    <component :is="Component" />
  </Transition>
</RouterView>
```

fade-slide: 从右滑入 + 淡入 / 向左滑出 + 淡出，200ms。

## 6. 全局清理

- 清除所有内联 style，统一 CSS class
- 输入框 focus 边框变主题渐变色
- 按钮 hover 使用工具渐变色背景

## 文件变更清单

| 文件                                                 | 操作                                     |
| ---------------------------------------------------- | ---------------------------------------- |
| `src/app/assets/styles/variables.css`                | 新增工具渐变色变量、radius-xl、shadow-lg |
| `src/app/assets/styles/themes/*.css`                 | 每个主题添加工具渐变色变量               |
| `src/app/tools/types.ts`                             | ToolMeta 新增 icon、gradientVar          |
| `src/app/tools/*/index.ts`                           | 各工具注册添加 icon 和 gradientVar       |
| `src/app/components/ToolPageHeader.vue`              | 新建 — 公共工具页面头部                  |
| `src/app/views/Home.vue`                             | 重构为磁贴卡片布局                       |
| `src/app/components/Layout.vue`                      | 侧边栏品牌区、菜单图标、页面切换动画     |
| `src/app/tools/json-formatter/JsonFormatterTool.vue` | 左右分栏布局                             |
| `src/app/tools/base64/Base64Tool.vue`                | 左右分栏布局                             |
| `src/app/tools/url-encoder/UrlEncoderTool.vue`       | 左右分栏布局                             |
| `src/app/tools/uuid-generator/UuidGeneratorTool.vue` | NRadioButton + 结果卡片                  |
| `src/app/assets/styles/global.css`                   | 动画 class、全局样式增强                 |
