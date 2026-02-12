# Swiss Kit MVP 工具实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 实现 Swiss Kit 的 4 个 MVP 工具（JSON 格式化、Base64 编解码、URL 编解码、UUID/ULID 生成器），包含工具注册系统、共享 UI 组件和 Soft Modern 主题。

**Architecture:** 每个工具是独立目录（`src/app/tools/<name>/`），导出元信息和 Vue 组件。工具通过统一注册表自动生成路由和侧边栏菜单。共享组件（CopyButton、ToolCard）提供统一交互模式：输入即时计算、一键复制、内联错误。

**Tech Stack:** Vue 3 + TypeScript + Naive UI + Vue Router + Vitest

---

### Task 1: 工具类型定义与注册表

**Files:**

- Create: `src/app/tools/types.ts`
- Create: `src/app/tools/registry.ts`
- Test: `src/app/tools/__tests__/registry.test.ts`

**Step 1: 写失败测试**

```typescript
// src/app/tools/__tests__/registry.test.ts
import { describe, it, expect } from 'vitest'
import { toolRegistry } from '../registry'
import type { ToolMeta } from '../types'

describe('toolRegistry', () => {
  it('should export an array of tool meta objects', () => {
    expect(Array.isArray(toolRegistry)).toBe(true)
    expect(toolRegistry.length).toBeGreaterThan(0)
  })

  it('each tool should have required meta fields', () => {
    for (const tool of toolRegistry) {
      expect(tool).toHaveProperty('name')
      expect(tool).toHaveProperty('title')
      expect(tool).toHaveProperty('description')
      expect(tool).toHaveProperty('path')
      expect(tool).toHaveProperty('component')
    }
  })
})
```

**Step 2: 运行测试确认失败**

Run: `pnpm test:run -- src/app/tools/__tests__/registry.test.ts`
Expected: FAIL - 模块未找到

**Step 3: 实现类型定义和注册表**

```typescript
// src/app/tools/types.ts
import type { Component } from 'vue'

export interface ToolMeta {
  name: string // 路由名称，如 'json-formatter'
  title: string // 显示标题，如 'JSON 格式化'
  description: string // 简短描述
  path: string // 路由路径，如 '/tools/json-formatter'
  component: Component
}
```

```typescript
// src/app/tools/registry.ts
import type { ToolMeta } from './types'

// 工具将在后续 Task 中逐步添加到此数组
export const toolRegistry: ToolMeta[] = []
```

> 注意：此时 registry 为空数组，第一个测试 `length > 0` 会失败。暂时将该断言改为 `>= 0`，待第一个工具实现后改回。

**Step 4: 运行测试确认通过**

Run: `pnpm test:run -- src/app/tools/__tests__/registry.test.ts`
Expected: PASS

**Step 5: 提交**

```bash
git add src/app/tools/types.ts src/app/tools/registry.ts src/app/tools/__tests__/registry.test.ts
git commit -m "feat: add tool type definitions and registry"
```

---

### Task 2: 路由自动注册

**Files:**

- Modify: `src/app/router/index.ts`
- Test: `src/app/tools/__tests__/routes.test.ts`

**Step 1: 写失败测试**

```typescript
// src/app/tools/__tests__/routes.test.ts
import { describe, it, expect } from 'vitest'
import { routes } from '@/router'

describe('routes', () => {
  it('should include the home route', () => {
    const home = routes.find((r) => r.path === '/')
    expect(home).toBeDefined()
    expect(home!.name).toBe('home')
  })

  it('should generate routes from tool registry', () => {
    // 工具路由都在 /tools/ 前缀下
    const toolRoutes = routes.filter((r) => r.path.startsWith('/tools/'))
    // 当有工具注册后，toolRoutes 长度应 > 0
    // 此时因为 registry 为空，暂时验证类型正确
    expect(Array.isArray(toolRoutes)).toBe(true)
  })
})
```

**Step 2: 运行测试确认失败**

Run: `pnpm test:run -- src/app/tools/__tests__/routes.test.ts`
Expected: FAIL（路径别名可能在 vitest 中无法解析 — 需先确认 vitest 配置）

> **重要**：如果 vitest 未配置路径别名 `@/`，需要在 `vite.config.ts` 中的 alias 配置让 vitest 继承（vitest 默认读取 vite.config.ts）。当前 vite.config.ts 已配置 `@ → src/app`，vitest 应自动继承。

**Step 3: 修改路由配置，从 registry 自动生成路由**

```typescript
// src/app/router/index.ts
import type { RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'
import { toolRegistry } from '@/tools/registry'

const toolRoutes: RouteRecordRaw[] = toolRegistry.map((tool) => ({
  path: tool.path,
  name: tool.name,
  component: tool.component,
  meta: { title: tool.title },
}))

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  ...toolRoutes,
]
```

**Step 4: 运行测试确认通过**

Run: `pnpm test:run -- src/app/tools/__tests__/routes.test.ts`
Expected: PASS

**Step 5: 提交**

```bash
git add src/app/router/index.ts src/app/tools/__tests__/routes.test.ts
git commit -m "feat: auto-generate routes from tool registry"
```

---

### Task 3: CSS 主题变量与全局样式

**Files:**

- Create: `src/app/assets/styles/variables.css`
- Create: `src/app/assets/styles/global.css`
- Modify: `src/app/main.ts` (导入全局样式)
- Modify: `index.html` (添加 Google Fonts 链接)

**Step 1: 创建 CSS 变量文件**

```css
/* src/app/assets/styles/variables.css */
:root {
  /* 色彩 */
  --color-bg: #faf9f7;
  --color-bg-card: #ffffff;
  --color-bg-card-hover: #f5f3f0;
  --color-border: #e8e5e1;
  --color-text: #2c2c2c;
  --color-text-secondary: #6b6b6b;
  --color-accent: #1a7a6d;
  --color-accent-hover: #15665b;
  --color-accent-light: rgba(26, 122, 109, 0.08);
  --color-error: #d44;
  --color-success: #2a9d4e;

  /* 字体 */
  --font-display: 'DM Serif Display', serif;
  --font-body: 'DM Sans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* 间距 */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;

  /* 圆角 */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;

  /* 阴影 */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.06);

  /* 过渡 */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
}
```

**Step 2: 创建全局样式文件**

```css
/* src/app/assets/styles/global.css */
@import './variables.css';

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-family: var(--font-body);
  color: var(--color-text);
  background-color: var(--color-bg);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code,
pre,
textarea.mono {
  font-family: var(--font-mono);
}

h1,
h2,
h3 {
  font-family: var(--font-display);
  font-weight: 400;
}
```

**Step 3: 在 index.html 中添加 Google Fonts**

在 `index.html` 的 `<head>` 中添加：

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&family=JetBrains+Mono:wght@400;500&display=swap"
  rel="stylesheet"
/>
```

**Step 4: 在 main.ts 中导入全局样式**

在 `src/app/main.ts` 的顶部添加：

```typescript
import './assets/styles/global.css'
```

**Step 5: 运行 dev 确认样式生效**

Run: `pnpm dev`
Expected: 打开浏览器，字体和背景色变化可见

**Step 6: 提交**

```bash
git add src/app/assets/styles/variables.css src/app/assets/styles/global.css src/app/main.ts index.html
git commit -m "feat: add Soft Modern theme with CSS variables and fonts"
```

---

### Task 4: CopyButton 共享组件

**Files:**

- Create: `src/app/components/CopyButton.vue`
- Test: `src/app/components/__tests__/CopyButton.test.ts`

**Step 1: 写失败测试**

```typescript
// src/app/components/__tests__/CopyButton.test.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CopyButton from '../CopyButton.vue'

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
})

describe('CopyButton', () => {
  it('should render a button', () => {
    const wrapper = mount(CopyButton, {
      props: { text: 'hello' },
    })
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('should copy text to clipboard on click', async () => {
    const wrapper = mount(CopyButton, {
      props: { text: 'hello' },
    })
    await wrapper.find('button').trigger('click')
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hello')
  })
})
```

**Step 2: 运行测试确认失败**

Run: `pnpm test:run -- src/app/components/__tests__/CopyButton.test.ts`
Expected: FAIL - 模块未找到

**Step 3: 实现 CopyButton**

```vue
<!-- src/app/components/CopyButton.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { NButton, NIcon } from 'naive-ui'

const props = defineProps<{
  text: string
}>()

const copied = ref(false)

async function copy() {
  await navigator.clipboard.writeText(props.text)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 1500)
}
</script>

<template>
  <NButton quaternary size="small" @click="copy">
    {{ copied ? '已复制' : '复制' }}
  </NButton>
</template>
```

**Step 4: 运行测试确认通过**

Run: `pnpm test:run -- src/app/components/__tests__/CopyButton.test.ts`
Expected: PASS

**Step 5: 提交**

```bash
git add src/app/components/CopyButton.vue src/app/components/__tests__/CopyButton.test.ts
git commit -m "feat: add CopyButton shared component"
```

---

### Task 5: 更新 Layout 侧边栏样式

**Files:**

- Modify: `src/app/components/Layout.vue`

**Step 1: 更新 Layout 组件使用主题变量和新字体**

```vue
<!-- src/app/components/Layout.vue -->
<script setup lang="ts">
import { NLayout, NLayoutSider, NMenu, NLayoutContent } from 'naive-ui'
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { routes } from '@/router'

const router = useRouter()
const route = useRoute()

const menuOptions = computed(() =>
  routes
    .filter((r) => r.meta?.title)
    .map((r) => ({
      label: r.meta!.title as string,
      key: r.name as string,
    })),
)

const activeKey = computed(() => route.name as string)

function handleMenuUpdate(key: string) {
  router.push({ name: key })
}
</script>

<template>
  <NLayout has-sider style="height: 100vh">
    <NLayoutSider bordered :width="220" content-style="padding: 16px;">
      <div class="sidebar-brand">Swiss Kit</div>
      <NMenu :options="menuOptions" :value="activeKey" @update:value="handleMenuUpdate" />
    </NLayoutSider>
    <NLayoutContent content-style="padding: 32px; background: var(--color-bg);">
      <RouterView />
    </NLayoutContent>
  </NLayout>
</template>

<style scoped>
.sidebar-brand {
  font-family: var(--font-display);
  font-size: 22px;
  padding: 12px 0 20px;
  text-align: center;
  color: var(--color-text);
}
</style>
```

**Step 2: 运行 dev 确认视觉效果**

Run: `pnpm dev`
Expected: 侧边栏标题使用 DM Serif Display 字体，背景使用暖灰色

**Step 3: 提交**

```bash
git add src/app/components/Layout.vue
git commit -m "feat: update Layout with Soft Modern theme styling"
```

---

### Task 6: Base64 编解码工具

**Files:**

- Create: `src/app/tools/base64/index.ts`
- Create: `src/app/tools/base64/Base64Tool.vue`
- Modify: `src/app/tools/registry.ts`
- Test: `src/app/tools/base64/__tests__/base64.test.ts`

**Step 1: 写失败测试**

```typescript
// src/app/tools/base64/__tests__/base64.test.ts
import { describe, it, expect } from 'vitest'

// 测试纯逻辑函数：编码和解码
// Base64 工具逻辑很简单（btoa/atob），但需要处理 Unicode
function encodeBase64(input: string): string {
  return btoa(
    encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16)),
    ),
  )
}

function decodeBase64(input: string): string {
  return decodeURIComponent(
    Array.from(atob(input), (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''),
  )
}

describe('Base64 encode/decode', () => {
  it('should encode ASCII text', () => {
    expect(encodeBase64('Hello, World!')).toBe('SGVsbG8sIFdvcmxkIQ==')
  })

  it('should decode ASCII text', () => {
    expect(decodeBase64('SGVsbG8sIFdvcmxkIQ==')).toBe('Hello, World!')
  })

  it('should handle Unicode text', () => {
    const input = '你好世界'
    const encoded = encodeBase64(input)
    expect(decodeBase64(encoded)).toBe(input)
  })

  it('should handle empty string', () => {
    expect(encodeBase64('')).toBe('')
    expect(decodeBase64('')).toBe('')
  })
})
```

**Step 2: 运行测试确认通过**（纯函数测试，无模块依赖）

Run: `pnpm test:run -- src/app/tools/base64/__tests__/base64.test.ts`
Expected: PASS（测试函数内联定义，不依赖外部模块）

**Step 3: 创建工具逻辑模块**

```typescript
// src/app/tools/base64/utils.ts
export function encodeBase64(input: string): string {
  return btoa(
    encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16)),
    ),
  )
}

export function decodeBase64(input: string): string {
  return decodeURIComponent(
    Array.from(atob(input), (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''),
  )
}
```

**Step 4: 更新测试引用模块**

```typescript
// src/app/tools/base64/__tests__/base64.test.ts
import { describe, it, expect } from 'vitest'
import { encodeBase64, decodeBase64 } from '../utils'

describe('Base64 encode/decode', () => {
  it('should encode ASCII text', () => {
    expect(encodeBase64('Hello, World!')).toBe('SGVsbG8sIFdvcmxkIQ==')
  })

  it('should decode ASCII text', () => {
    expect(decodeBase64('SGVsbG8sIFdvcmxkIQ==')).toBe('Hello, World!')
  })

  it('should handle Unicode text', () => {
    const input = '你好世界'
    const encoded = encodeBase64(input)
    expect(decodeBase64(encoded)).toBe(input)
  })

  it('should handle empty string', () => {
    expect(encodeBase64('')).toBe('')
    expect(decodeBase64('')).toBe('')
  })

  it('should throw on invalid base64 input', () => {
    expect(() => decodeBase64('not-valid-base64!!!')).toThrow()
  })
})
```

**Step 5: 运行测试确认通过**

Run: `pnpm test:run -- src/app/tools/base64/__tests__/base64.test.ts`
Expected: PASS

**Step 6: 实现 Vue 组件**

```vue
<!-- src/app/tools/base64/Base64Tool.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { NInput, NSpace, NAlert } from 'naive-ui'
import CopyButton from '@/components/CopyButton.vue'
import { encodeBase64, decodeBase64 } from './utils'

const input = ref('')
const mode = ref<'encode' | 'decode'>('encode')

const result = computed(() => {
  if (!input.value) return { value: '', error: '' }
  try {
    const value = mode.value === 'encode' ? encodeBase64(input.value) : decodeBase64(input.value)
    return { value, error: '' }
  } catch {
    return { value: '', error: mode.value === 'encode' ? '编码失败' : '无效的 Base64 字符串' }
  }
})
</script>

<template>
  <div>
    <h2 style="font-family: var(--font-display); margin-bottom: var(--space-lg)">
      Base64 编码/解码
    </h2>

    <NSpace vertical :size="16">
      <NSpace>
        <label>
          <input type="radio" value="encode" v-model="mode" />
          编码
        </label>
        <label>
          <input type="radio" value="decode" v-model="mode" />
          解码
        </label>
      </NSpace>

      <NInput
        v-model:value="input"
        type="textarea"
        :placeholder="mode === 'encode' ? '输入要编码的文本...' : '输入 Base64 字符串...'"
        :rows="6"
        style="font-family: var(--font-mono)"
      />

      <NAlert v-if="result.error" type="error" :bordered="false">
        {{ result.error }}
      </NAlert>

      <div v-if="result.value" style="position: relative">
        <NInput
          :value="result.value"
          type="textarea"
          readonly
          :rows="6"
          style="font-family: var(--font-mono)"
        />
        <div style="position: absolute; top: 8px; right: 8px">
          <CopyButton :text="result.value" />
        </div>
      </div>
    </NSpace>
  </div>
</template>
```

**Step 7: 创建工具元信息**

```typescript
// src/app/tools/base64/index.ts
import type { ToolMeta } from '../types'
import Base64Tool from './Base64Tool.vue'

export const base64Tool: ToolMeta = {
  name: 'base64',
  title: 'Base64 编解码',
  description: '文本的 Base64 编码与解码',
  path: '/tools/base64',
  component: Base64Tool,
}
```

**Step 8: 注册到 registry**

```typescript
// src/app/tools/registry.ts
import type { ToolMeta } from './types'
import { base64Tool } from './base64'

export const toolRegistry: ToolMeta[] = [base64Tool]
```

**Step 9: 运行全部测试**

Run: `pnpm test:run`
Expected: ALL PASS

**Step 10: 运行 dev 确认工具可用**

Run: `pnpm dev`
Expected: 侧边栏出现 "Base64 编解码" 菜单项，点击后进入工具页面，输入文本即时编解码

**Step 11: 提交**

```bash
git add src/app/tools/base64/ src/app/tools/registry.ts
git commit -m "feat: add Base64 encode/decode tool"
```

---

### Task 7: URL 编解码工具

**Files:**

- Create: `src/app/tools/url-encoder/index.ts`
- Create: `src/app/tools/url-encoder/UrlEncoderTool.vue`
- Create: `src/app/tools/url-encoder/utils.ts`
- Modify: `src/app/tools/registry.ts`
- Test: `src/app/tools/url-encoder/__tests__/url-encoder.test.ts`

**Step 1: 写失败测试**

```typescript
// src/app/tools/url-encoder/__tests__/url-encoder.test.ts
import { describe, it, expect } from 'vitest'
import { urlEncode, urlDecode } from '../utils'

describe('URL encode/decode', () => {
  it('should encode special characters', () => {
    expect(urlEncode('hello world')).toBe('hello%20world')
    expect(urlEncode('a=1&b=2')).toBe('a%3D1%26b%3D2')
  })

  it('should decode special characters', () => {
    expect(urlDecode('hello%20world')).toBe('hello world')
    expect(urlDecode('a%3D1%26b%3D2')).toBe('a=1&b=2')
  })

  it('should handle Unicode', () => {
    const input = '你好世界'
    expect(urlDecode(urlEncode(input))).toBe(input)
  })

  it('should handle empty string', () => {
    expect(urlEncode('')).toBe('')
    expect(urlDecode('')).toBe('')
  })
})
```

**Step 2: 运行测试确认失败**

Run: `pnpm test:run -- src/app/tools/url-encoder/__tests__/url-encoder.test.ts`
Expected: FAIL - 模块未找到

**Step 3: 实现 utils**

```typescript
// src/app/tools/url-encoder/utils.ts
export function urlEncode(input: string): string {
  return encodeURIComponent(input)
}

export function urlDecode(input: string): string {
  return decodeURIComponent(input)
}
```

**Step 4: 运行测试确认通过**

Run: `pnpm test:run -- src/app/tools/url-encoder/__tests__/url-encoder.test.ts`
Expected: PASS

**Step 5: 实现 Vue 组件**

```vue
<!-- src/app/tools/url-encoder/UrlEncoderTool.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { NInput, NSpace, NAlert } from 'naive-ui'
import CopyButton from '@/components/CopyButton.vue'
import { urlEncode, urlDecode } from './utils'

const input = ref('')
const mode = ref<'encode' | 'decode'>('encode')

const result = computed(() => {
  if (!input.value) return { value: '', error: '' }
  try {
    const value = mode.value === 'encode' ? urlEncode(input.value) : urlDecode(input.value)
    return { value, error: '' }
  } catch {
    return { value: '', error: '无效的 URL 编码字符串' }
  }
})
</script>

<template>
  <div>
    <h2 style="font-family: var(--font-display); margin-bottom: var(--space-lg)">URL 编码/解码</h2>

    <NSpace vertical :size="16">
      <NSpace>
        <label>
          <input type="radio" value="encode" v-model="mode" />
          编码
        </label>
        <label>
          <input type="radio" value="decode" v-model="mode" />
          解码
        </label>
      </NSpace>

      <NInput
        v-model:value="input"
        type="textarea"
        :placeholder="mode === 'encode' ? '输入要编码的文本...' : '输入 URL 编码字符串...'"
        :rows="6"
        style="font-family: var(--font-mono)"
      />

      <NAlert v-if="result.error" type="error" :bordered="false">
        {{ result.error }}
      </NAlert>

      <div v-if="result.value" style="position: relative">
        <NInput
          :value="result.value"
          type="textarea"
          readonly
          :rows="6"
          style="font-family: var(--font-mono)"
        />
        <div style="position: absolute; top: 8px; right: 8px">
          <CopyButton :text="result.value" />
        </div>
      </div>
    </NSpace>
  </div>
</template>
```

**Step 6: 创建工具元信息并注册**

```typescript
// src/app/tools/url-encoder/index.ts
import type { ToolMeta } from '../types'
import UrlEncoderTool from './UrlEncoderTool.vue'

export const urlEncoderTool: ToolMeta = {
  name: 'url-encoder',
  title: 'URL 编解码',
  description: 'encodeURIComponent / decodeURIComponent',
  path: '/tools/url-encoder',
  component: UrlEncoderTool,
}
```

```typescript
// src/app/tools/registry.ts
import type { ToolMeta } from './types'
import { base64Tool } from './base64'
import { urlEncoderTool } from './url-encoder'

export const toolRegistry: ToolMeta[] = [base64Tool, urlEncoderTool]
```

**Step 7: 运行全部测试**

Run: `pnpm test:run`
Expected: ALL PASS

**Step 8: 提交**

```bash
git add src/app/tools/url-encoder/ src/app/tools/registry.ts
git commit -m "feat: add URL encode/decode tool"
```

---

### Task 8: UUID/ULID 生成器工具

**Files:**

- Create: `src/app/tools/uuid-generator/index.ts`
- Create: `src/app/tools/uuid-generator/UuidGeneratorTool.vue`
- Create: `src/app/tools/uuid-generator/utils.ts`
- Modify: `src/app/tools/registry.ts`
- Test: `src/app/tools/uuid-generator/__tests__/uuid-generator.test.ts`

> **依赖说明**：UUID v4 使用 `crypto.randomUUID()`（浏览器原生支持）。UUID v7 和 ULID 需要自行实现或安装依赖。为 MVP 简化，仅实现 UUID v4（原生）和 UUID v7（手动实现，基于时间戳 + 随机数）。ULID 使用手动实现。

**Step 1: 写失败测试**

```typescript
// src/app/tools/uuid-generator/__tests__/uuid-generator.test.ts
import { describe, it, expect } from 'vitest'
import { generateUUIDv4, generateUUIDv7, generateULID } from '../utils'

describe('UUID/ULID generators', () => {
  describe('UUID v4', () => {
    it('should return a valid UUID v4 format', () => {
      const uuid = generateUUIDv4()
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    })

    it('should generate unique values', () => {
      const a = generateUUIDv4()
      const b = generateUUIDv4()
      expect(a).not.toBe(b)
    })
  })

  describe('UUID v7', () => {
    it('should return a valid UUID v7 format', () => {
      const uuid = generateUUIDv7()
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    })

    it('should generate unique values', () => {
      const a = generateUUIDv7()
      const b = generateUUIDv7()
      expect(a).not.toBe(b)
    })
  })

  describe('ULID', () => {
    it('should return a 26-character uppercase string', () => {
      const ulid = generateULID()
      expect(ulid).toMatch(/^[0-9A-Z]{26}$/)
    })

    it('should generate unique values', () => {
      const a = generateULID()
      const b = generateULID()
      expect(a).not.toBe(b)
    })
  })
})
```

**Step 2: 运行测试确认失败**

Run: `pnpm test:run -- src/app/tools/uuid-generator/__tests__/uuid-generator.test.ts`
Expected: FAIL - 模块未找到

**Step 3: 实现 utils**

```typescript
// src/app/tools/uuid-generator/utils.ts
export function generateUUIDv4(): string {
  return crypto.randomUUID()
}

export function generateUUIDv7(): string {
  const now = Date.now()
  const timeHex = now.toString(16).padStart(12, '0')

  const randomBytes = new Uint8Array(10)
  crypto.getRandomValues(randomBytes)

  // 构建 UUID v7: time_high-time_mid-ver_time_low-var_rand-rand
  const hex = Array.from(randomBytes, (b) => b.toString(16).padStart(2, '0')).join('')

  return [
    timeHex.slice(0, 8), // time_high (8)
    timeHex.slice(8, 12), // time_mid (4)
    '7' + hex.slice(0, 3), // version 7 + rand_a (4)
    ((parseInt(hex.slice(3, 5), 16) & 0x3f) | 0x80).toString(16).padStart(2, '0') + hex.slice(5, 7), // variant + rand_b (4)
    hex.slice(7, 19), // rand (12)
  ].join('-')
}

const ULID_ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

export function generateULID(): string {
  const now = Date.now()
  let timeChars = ''
  let t = now
  for (let i = 0; i < 10; i++) {
    timeChars = ULID_ENCODING[t % 32] + timeChars
    t = Math.floor(t / 32)
  }

  let randomChars = ''
  const randomBytes = new Uint8Array(10)
  crypto.getRandomValues(randomBytes)
  for (let i = 0; i < 16; i++) {
    const byteIndex = Math.floor((i * 5) / 8)
    const bitOffset = (i * 5) % 8
    let value = (randomBytes[byteIndex]! >> bitOffset) & 0x1f
    if (bitOffset > 3 && byteIndex + 1 < randomBytes.length) {
      value |= (randomBytes[byteIndex + 1]! << (8 - bitOffset)) & 0x1f
    }
    randomChars += ULID_ENCODING[value & 0x1f]
  }

  return timeChars + randomChars
}
```

**Step 4: 运行测试确认通过**

Run: `pnpm test:run -- src/app/tools/uuid-generator/__tests__/uuid-generator.test.ts`
Expected: PASS

**Step 5: 实现 Vue 组件**

```vue
<!-- src/app/tools/uuid-generator/UuidGeneratorTool.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { NSpace, NButton, NInput } from 'naive-ui'
import CopyButton from '@/components/CopyButton.vue'
import { generateUUIDv4, generateUUIDv7, generateULID } from './utils'

type GeneratorType = 'uuidv4' | 'uuidv7' | 'ulid'

const generatorType = ref<GeneratorType>('uuidv4')
const count = ref(1)
const results = ref<string[]>([])

function generate() {
  const generators: Record<GeneratorType, () => string> = {
    uuidv4: generateUUIDv4,
    uuidv7: generateUUIDv7,
    ulid: generateULID,
  }
  const gen = generators[generatorType.value]
  results.value = Array.from({ length: count.value }, () => gen())
}

// 初始生成一个
generate()
</script>

<template>
  <div>
    <h2 style="font-family: var(--font-display); margin-bottom: var(--space-lg)">
      UUID / ULID 生成器
    </h2>

    <NSpace vertical :size="16">
      <NSpace align="center">
        <label>
          <input type="radio" value="uuidv4" v-model="generatorType" />
          UUID v4
        </label>
        <label>
          <input type="radio" value="uuidv7" v-model="generatorType" />
          UUID v7
        </label>
        <label>
          <input type="radio" value="ulid" v-model="generatorType" />
          ULID
        </label>
      </NSpace>

      <NSpace align="center">
        <span>数量：</span>
        <NInput
          :value="String(count)"
          @update:value="(v: string) => (count = Math.max(1, Math.min(100, Number(v) || 1)))"
          style="width: 80px"
          size="small"
        />
        <NButton type="primary" @click="generate">生成</NButton>
      </NSpace>

      <div
        v-for="(result, i) in results"
        :key="i"
        style="display: flex; align-items: center; gap: 8px"
      >
        <code style="font-family: var(--font-mono); font-size: 14px; flex: 1">{{ result }}</code>
        <CopyButton :text="result" />
      </div>
    </NSpace>
  </div>
</template>
```

**Step 6: 创建工具元信息并注册**

```typescript
// src/app/tools/uuid-generator/index.ts
import type { ToolMeta } from '../types'
import UuidGeneratorTool from './UuidGeneratorTool.vue'

export const uuidGeneratorTool: ToolMeta = {
  name: 'uuid-generator',
  title: 'UUID/ULID 生成器',
  description: '生成 UUID v4 / v7 / ULID',
  path: '/tools/uuid-generator',
  component: UuidGeneratorTool,
}
```

```typescript
// src/app/tools/registry.ts
import type { ToolMeta } from './types'
import { base64Tool } from './base64'
import { urlEncoderTool } from './url-encoder'
import { uuidGeneratorTool } from './uuid-generator'

export const toolRegistry: ToolMeta[] = [base64Tool, urlEncoderTool, uuidGeneratorTool]
```

**Step 7: 运行全部测试**

Run: `pnpm test:run`
Expected: ALL PASS

**Step 8: 提交**

```bash
git add src/app/tools/uuid-generator/ src/app/tools/registry.ts
git commit -m "feat: add UUID/ULID generator tool"
```

---

### Task 9: JSON 格式化/校验工具

**Files:**

- Create: `src/app/tools/json-formatter/index.ts`
- Create: `src/app/tools/json-formatter/JsonFormatterTool.vue`
- Create: `src/app/tools/json-formatter/utils.ts`
- Modify: `src/app/tools/registry.ts`
- Test: `src/app/tools/json-formatter/__tests__/json-formatter.test.ts`

**Step 1: 写失败测试**

```typescript
// src/app/tools/json-formatter/__tests__/json-formatter.test.ts
import { describe, it, expect } from 'vitest'
import { formatJson, minifyJson, validateJson } from '../utils'

describe('JSON formatter utils', () => {
  const validJson = '{"name":"test","count":42,"nested":{"a":1}}'

  describe('formatJson', () => {
    it('should format JSON with 2-space indent', () => {
      const result = formatJson(validJson)
      expect(result).toBe(JSON.stringify(JSON.parse(validJson), null, 2))
    })

    it('should format with custom indent', () => {
      const result = formatJson(validJson, 4)
      expect(result).toBe(JSON.stringify(JSON.parse(validJson), null, 4))
    })
  })

  describe('minifyJson', () => {
    it('should remove all whitespace from JSON', () => {
      const formatted = '{\n  "name": "test"\n}'
      expect(minifyJson(formatted)).toBe('{"name":"test"}')
    })
  })

  describe('validateJson', () => {
    it('should return null for valid JSON', () => {
      expect(validateJson(validJson)).toBeNull()
    })

    it('should return error message for invalid JSON', () => {
      const error = validateJson('{invalid}')
      expect(error).toBeTruthy()
      expect(typeof error).toBe('string')
    })

    it('should return error for empty string', () => {
      const error = validateJson('')
      expect(error).toBeTruthy()
    })
  })
})
```

**Step 2: 运行测试确认失败**

Run: `pnpm test:run -- src/app/tools/json-formatter/__tests__/json-formatter.test.ts`
Expected: FAIL - 模块未找到

**Step 3: 实现 utils**

```typescript
// src/app/tools/json-formatter/utils.ts
export function formatJson(input: string, indent: number = 2): string {
  return JSON.stringify(JSON.parse(input), null, indent)
}

export function minifyJson(input: string): string {
  return JSON.stringify(JSON.parse(input))
}

export function validateJson(input: string): string | null {
  try {
    JSON.parse(input)
    return null
  } catch (e) {
    return (e as Error).message
  }
}
```

**Step 4: 运行测试确认通过**

Run: `pnpm test:run -- src/app/tools/json-formatter/__tests__/json-formatter.test.ts`
Expected: PASS

**Step 5: 实现 Vue 组件**

```vue
<!-- src/app/tools/json-formatter/JsonFormatterTool.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { NInput, NSpace, NButton, NAlert } from 'naive-ui'
import CopyButton from '@/components/CopyButton.vue'
import { formatJson, minifyJson, validateJson } from './utils'

const input = ref('')
const indent = ref(2)

const validation = computed(() => {
  if (!input.value) return null
  return validateJson(input.value)
})

const formatted = computed(() => {
  if (!input.value || validation.value) return ''
  try {
    return formatJson(input.value, indent.value)
  } catch {
    return ''
  }
})

function doFormat() {
  if (formatted.value) {
    input.value = formatted.value
  }
}

function doMinify() {
  if (!input.value || validation.value) return
  try {
    input.value = minifyJson(input.value)
  } catch {
    // ignore
  }
}
</script>

<template>
  <div>
    <h2 style="font-family: var(--font-display); margin-bottom: var(--space-lg)">
      JSON 格式化 / 校验
    </h2>

    <NSpace vertical :size="16">
      <NSpace>
        <NButton @click="doFormat" :disabled="!!validation">美化</NButton>
        <NButton @click="doMinify" :disabled="!!validation">压缩</NButton>
        <NSpace align="center">
          <span>缩进：</span>
          <NInput
            :value="String(indent)"
            @update:value="(v: string) => (indent = Math.max(1, Math.min(8, Number(v) || 2)))"
            style="width: 60px"
            size="small"
          />
        </NSpace>
      </NSpace>

      <NInput
        v-model:value="input"
        type="textarea"
        placeholder="在此粘贴 JSON..."
        :rows="12"
        style="font-family: var(--font-mono)"
      />

      <NAlert v-if="validation" type="error" :bordered="false">
        {{ validation }}
      </NAlert>

      <div v-if="!validation && input" style="position: relative">
        <NAlert type="success" :bordered="false">JSON 格式正确</NAlert>
      </div>

      <div v-if="formatted" style="position: relative">
        <NInput
          :value="formatted"
          type="textarea"
          readonly
          :rows="12"
          style="font-family: var(--font-mono)"
        />
        <div style="position: absolute; top: 8px; right: 8px">
          <CopyButton :text="formatted" />
        </div>
      </div>
    </NSpace>
  </div>
</template>
```

**Step 6: 创建工具元信息并注册**

```typescript
// src/app/tools/json-formatter/index.ts
import type { ToolMeta } from '../types'
import JsonFormatterTool from './JsonFormatterTool.vue'

export const jsonFormatterTool: ToolMeta = {
  name: 'json-formatter',
  title: 'JSON 格式化',
  description: '美化、压缩、语法校验',
  path: '/tools/json-formatter',
  component: JsonFormatterTool,
}
```

```typescript
// src/app/tools/registry.ts
import type { ToolMeta } from './types'
import { jsonFormatterTool } from './json-formatter'
import { base64Tool } from './base64'
import { urlEncoderTool } from './url-encoder'
import { uuidGeneratorTool } from './uuid-generator'

export const toolRegistry: ToolMeta[] = [
  jsonFormatterTool,
  base64Tool,
  urlEncoderTool,
  uuidGeneratorTool,
]
```

**Step 7: 运行全部测试**

Run: `pnpm test:run`
Expected: ALL PASS

**Step 8: 提交**

```bash
git add src/app/tools/json-formatter/ src/app/tools/registry.ts
git commit -m "feat: add JSON formatter/validator tool"
```

---

### Task 10: 更新首页为工具导航卡片

**Files:**

- Modify: `src/app/views/Home.vue`

**Step 1: 更新首页组件**

将空状态页替换为工具卡片网格，点击可直接导航至对应工具。

```vue
<!-- src/app/views/Home.vue -->
<script setup lang="ts">
import { NCard, NGrid, NGridItem } from 'naive-ui'
import { useRouter } from 'vue-router'
import { toolRegistry } from '@/tools/registry'

const router = useRouter()

function navigateTo(name: string) {
  router.push({ name })
}
</script>

<template>
  <div>
    <h1 style="font-family: var(--font-display); margin: 0 0 var(--space-lg)">Swiss Kit</h1>
    <p style="color: var(--color-text-secondary); margin-bottom: var(--space-xl)">
      开发者常用工具集合
    </p>
    <NGrid :x-gap="16" :y-gap="16" :cols="3">
      <NGridItem v-for="tool in toolRegistry" :key="tool.name">
        <NCard hoverable style="cursor: pointer" @click="navigateTo(tool.name)">
          <template #header>{{ tool.title }}</template>
          {{ tool.description }}
        </NCard>
      </NGridItem>
    </NGrid>
  </div>
</template>
```

**Step 2: 运行 dev 确认效果**

Run: `pnpm dev`
Expected: 首页展示 4 个工具卡片，点击可导航

**Step 3: 提交**

```bash
git add src/app/views/Home.vue
git commit -m "feat: update home page with tool navigation cards"
```

---

### Task 11: 全量验证与最终提交

**Step 1: 运行 lint**

Run: `pnpm lint`
Expected: 无错误

**Step 2: 运行格式化检查**

Run: `pnpm format:check`
Expected: 无需格式化的文件（如有则 `pnpm format` 修复）

**Step 3: 运行全部测试**

Run: `pnpm test:run`
Expected: ALL PASS

**Step 4: 运行构建**

Run: `pnpm build`
Expected: 构建成功，无 TypeScript 错误

**Step 5: 运行 preview 确认生产版本**

Run: `pnpm preview`
Expected: 浏览器打开后所有工具正常工作

**Step 6: 如有修复，最终提交**

```bash
git add -A
git commit -m "chore: fix lint and build issues"
```
