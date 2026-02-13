# Theme Switching Design

## Overview

为 Swiss Kit 添加多主题切换功能。支持 5 种预设主题，通过侧边栏底部的调色板按钮弹出选择器切换，选择持久化到 localStorage。

## Themes

| Key           | Label       | 风格             | Naive UI Mode |
| ------------- | ----------- | ---------------- | ------------- |
| `default`     | 默认        | 暖白色调（现有） | light         |
| `ink-wash`    | 水墨        | 中国风水墨灰     | light         |
| `twilight`    | 薄暮        | 深紫色调黄昏     | dark          |
| `nord`        | Nord        | 蓝灰北欧极简     | dark          |
| `github-dark` | GitHub Dark | GitHub 暗色风格  | dark          |

### Color Palettes

**Default（保持现有）:**

- bg: `#faf9f7`, card: `#ffffff`, text: `#2c2c2c`, accent: `#1a7a6d`, border: `#e8e5e1`

**Ink Wash（水墨）:**

- bg: `#f0ede8`, card: `#f7f5f0`, text: `#1a1a1a`, accent: `#4a7c6f`, border: `#d4cfc7`

**Twilight（薄暮）:**

- bg: `#1e1b2e`, card: `#272340`, text: `#e4e0f0`, accent: `#c792ea`, border: `#3a3557`

**Nord:**

- bg: `#2e3440`, card: `#3b4252`, text: `#eceff4`, accent: `#88c0d0`, border: `#4c566a`

**GitHub Dark:**

- bg: `#0d1117`, card: `#161b22`, text: `#e6edf3`, accent: `#58a6ff`, border: `#30363d`

## Architecture

### File Structure

```
src/app/
├── assets/styles/
│   ├── variables.css              # :root 默认主题变量（不变）
│   ├── global.css                 # 全局样式（不变）
│   └── themes/
│       ├── ink-wash.css           # [data-theme="ink-wash"] { ... }
│       ├── twilight.css           # [data-theme="twilight"] { ... }
│       ├── nord.css               # [data-theme="nord"] { ... }
│       └── github-dark.css        # [data-theme="github-dark"] { ... }
├── composables/
│   └── useTheme.ts               # 主题状态管理 composable
├── components/
│   ├── Layout.vue                 # 修改：侧边栏底部添加主题按钮
│   └── ThemeSwitcher.vue          # 新增：主题切换器组件
└── App.vue                        # 修改：NConfigProvider 动态绑定主题
```

### CSS Implementation

每个主题一个独立 CSS 文件，通过 `[data-theme]` 属性选择器覆盖 CSS 变量。所有主题 CSS 在 `main.ts` 中统一 import（体积小，无性能问题）。

```css
/* themes/nord.css */
[data-theme='nord'] {
  --color-bg: #2e3440;
  --color-bg-card: #3b4252;
  --color-bg-card-hover: #434c5e;
  --color-border: #4c566a;
  --color-text: #eceff4;
  --color-text-secondary: #d8dee9;
  --color-accent: #88c0d0;
  --color-accent-hover: #8fbcbb;
  --color-accent-light: rgba(136, 192, 208, 0.1);
  --color-error: #bf616a;
  --color-success: #a3be8c;
}
```

### Composable: useTheme.ts

```typescript
interface ThemeMeta {
  key: string
  label: string
  accent: string // 预览色块颜色
  isDark: boolean // 是否为暗色主题（决定 Naive UI theme）
}

// 提供：
// - themes: ThemeMeta[]
// - currentTheme: Ref<string>
// - setTheme(key: string): void
// - currentThemeMeta: ComputedRef<ThemeMeta>
```

- 初始化时从 `localStorage('swiss-kit-theme')` 读取
- `setTheme()` 同时设置 `document.documentElement.dataset.theme` 和 localStorage
- 默认主题不设置 data-theme 属性（使用 :root 变量）

### Naive UI Integration

在 `App.vue` 中：

- `theme` 属性：暗色主题使用 `darkTheme`，亮色使用 `null`
- `themeOverrides` 属性：覆盖 `primaryColor`、`primaryColorHover` 等，匹配各主题的 accent 色

### Transition

在 `variables.css` 的 `:root` 中添加全局过渡：

```css
:root {
  transition:
    background-color var(--transition-normal),
    color var(--transition-normal),
    border-color var(--transition-normal);
}
```

## UI Design

### Sidebar Bottom Button

固定在侧边栏底部，显示调色板图标和当前主题名称：

```
│──────────────│
│  🎨 默认     │  ← 调色板图标 + 当前主题名
└──────────────┘
```

### Popover Theme Selector

点击按钮后弹出 `NPopover`，展示 2 列网格：

```
┌─────────────────────┐
│  ● 默认    ● 水墨   │
│  ● 薄暮    ● Nord   │
│  ● GitHub Dark      │
└─────────────────────┘
```

- 每个选项：左侧 accent 色圆点 + 主题名
- 当前选中项高亮（边框或背景色）
- 点击即切换，Popover 自动关闭

## Implementation Steps

1. 创建 4 个主题 CSS 文件（`themes/` 目录）
2. 在 `main.ts` 中 import 所有主题 CSS
3. 创建 `useTheme.ts` composable
4. 创建 `ThemeSwitcher.vue` 组件
5. 修改 `Layout.vue`：侧边栏底部添加 ThemeSwitcher
6. 修改 `App.vue`：NConfigProvider 动态绑定 theme 和 themeOverrides
7. 添加全局 CSS 过渡效果
