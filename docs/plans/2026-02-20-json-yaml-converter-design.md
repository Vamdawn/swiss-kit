# JSON ↔ YAML 转换器实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 添加一个双向 JSON ↔ YAML 实时转换工具，支持错误提示和缩进设置。

**Architecture:** 采用左右分栏布局，左侧输入，右侧输出，通过模式切换支持双向转换。使用 `js-yaml` 库处理 YAML 序列化/反序列化。遵循现有工具模式：ToolMeta 注册 + utils 纯函数 + Vue 组件 + 主题渐变色。

**Tech Stack:** Vue 3, TypeScript, Naive UI, js-yaml, Vitest

---

### Task 1: 安装 js-yaml 依赖

**Files:**

- Modify: `package.json`

**Step 1: 安装 js-yaml 及其类型定义**

Run:

```bash
cd /Users/chen/Repository/swiss-kit && pnpm add js-yaml && pnpm add -D @types/js-yaml
```

**Step 2: 验证安装成功**

Run:

```bash
cd /Users/chen/Repository/swiss-kit && pnpm list js-yaml
```

Expected: 输出中包含 `js-yaml` 及其版本号

**Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "✨ feat(json-yaml): add js-yaml dependency"
```

---

### Task 2: 编写 utils 工具函数的测试

**Files:**

- Create: `src/app/tools/json-yaml-converter/__tests__/json-yaml-converter.test.ts`

**Step 1: 编写失败的测试**

```typescript
import { describe, it, expect } from 'vitest'
import { jsonToYaml, yamlToJson, validateJson, validateYaml } from '../utils'

describe('JSON ↔ YAML converter utils', () => {
  describe('jsonToYaml', () => {
    it('should convert simple JSON to YAML', () => {
      const json = '{"name":"test","count":42}'
      const result = jsonToYaml(json)
      expect(result).toBe('name: test\ncount: 42\n')
    })

    it('should convert nested JSON to YAML', () => {
      const json = '{"server":{"host":"localhost","port":8080}}'
      const result = jsonToYaml(json)
      expect(result).toContain('server:')
      expect(result).toContain('  host: localhost')
      expect(result).toContain('  port: 8080')
    })

    it('should convert JSON array to YAML', () => {
      const json = '["a","b","c"]'
      const result = jsonToYaml(json)
      expect(result).toContain('- a')
      expect(result).toContain('- b')
      expect(result).toContain('- c')
    })

    it('should respect custom indent', () => {
      const json = '{"a":{"b":1}}'
      const result = jsonToYaml(json, 4)
      expect(result).toContain('    b: 1')
    })

    it('should throw on invalid JSON input', () => {
      expect(() => jsonToYaml('{invalid}')).toThrow()
    })

    it('should handle scalar JSON values', () => {
      expect(jsonToYaml('42')).toBe('42\n')
      expect(jsonToYaml('"hello"')).toBe('hello\n')
    })
  })

  describe('yamlToJson', () => {
    it('should convert simple YAML to JSON', () => {
      const yaml = 'name: test\ncount: 42\n'
      const result = yamlToJson(yaml)
      expect(JSON.parse(result)).toEqual({ name: 'test', count: 42 })
    })

    it('should convert nested YAML to JSON', () => {
      const yaml = 'server:\n  host: localhost\n  port: 8080\n'
      const result = yamlToJson(yaml)
      expect(JSON.parse(result)).toEqual({ server: { host: 'localhost', port: 8080 } })
    })

    it('should convert YAML array to JSON', () => {
      const yaml = '- a\n- b\n- c\n'
      const result = yamlToJson(yaml)
      expect(JSON.parse(result)).toEqual(['a', 'b', 'c'])
    })

    it('should respect custom indent', () => {
      const yaml = 'a:\n  b: 1\n'
      const result = yamlToJson(yaml, 4)
      expect(result).toContain('        "b": 1')
    })

    it('should throw on invalid YAML input', () => {
      expect(() => yamlToJson(': : invalid: [\n')).toThrow()
    })

    it('should handle YAML with only comments', () => {
      const result = yamlToJson('# just a comment\n')
      expect(result).toBe('null')
    })

    it('should handle bare YAML document separator', () => {
      const result = yamlToJson('---\n')
      expect(result).toBe('null')
    })

    it('should handle scalar YAML values', () => {
      expect(JSON.parse(yamlToJson('42'))).toBe(42)
      expect(JSON.parse(yamlToJson('true'))).toBe(true)
    })
  })

  describe('validateJson', () => {
    it('should return null for valid JSON', () => {
      expect(validateJson('{"a":1}')).toBeNull()
    })

    it('should return error message for invalid JSON', () => {
      const error = validateJson('{invalid}')
      expect(error).toBeTruthy()
      expect(typeof error).toBe('string')
    })
  })

  describe('validateYaml', () => {
    it('should return null for valid YAML', () => {
      expect(validateYaml('name: test\n')).toBeNull()
    })

    it('should return error message for invalid YAML', () => {
      const error = validateYaml(': : invalid: [\n')
      expect(error).toBeTruthy()
      expect(typeof error).toBe('string')
    })

    it('should return null for empty string', () => {
      expect(validateYaml('')).toBeNull()
    })
  })
})
```

**Step 2: 运行测试，确认失败**

Run:

```bash
cd /Users/chen/Repository/swiss-kit && pnpm vitest run src/app/tools/json-yaml-converter/__tests__/json-yaml-converter.test.ts
```

Expected: FAIL — `Cannot find module '../utils'`

---

### Task 3: 实现 utils 工具函数

**Files:**

- Create: `src/app/tools/json-yaml-converter/utils.ts`

**Step 1: 编写实现代码**

```typescript
import yaml from 'js-yaml'

export function jsonToYaml(jsonString: string, indent: number = 2): string {
  const obj = JSON.parse(jsonString)
  return yaml.dump(obj, { indent, schema: yaml.DEFAULT_SCHEMA })
}

export function yamlToJson(yamlString: string, indent: number = 2): string {
  const obj = yaml.load(yamlString, { schema: yaml.DEFAULT_SCHEMA })
  // yaml.load returns null for comment-only/empty-document YAML; guard undefined for edge cases
  if (obj === undefined) return JSON.stringify(null, null, indent)
  return JSON.stringify(obj, null, indent)
}

export function validateJson(input: string): string | null {
  try {
    JSON.parse(input)
    return null
  } catch (e) {
    return (e as Error).message
  }
}

export function validateYaml(input: string): string | null {
  // Empty input is not a validation error
  if (!input) return null
  try {
    yaml.load(input, { schema: yaml.DEFAULT_SCHEMA })
    return null
  } catch (e) {
    return (e as Error).message
  }
}
```

**Step 2: 运行测试，确认通过**

Run:

```bash
cd /Users/chen/Repository/swiss-kit && pnpm vitest run src/app/tools/json-yaml-converter/__tests__/json-yaml-converter.test.ts
```

Expected: ALL PASS

**Step 3: Commit**

```bash
git add src/app/tools/json-yaml-converter/utils.ts src/app/tools/json-yaml-converter/__tests__/json-yaml-converter.test.ts
git commit -m "✨ feat(json-yaml): add conversion utils with tests"
```

---

### Task 4: 添加主题渐变色

**Files:**

- Modify: `src/app/assets/styles/variables.css` — 添加 `--tool-json-yaml-gradient`
- Modify: `src/app/assets/styles/themes/ink-wash.css`
- Modify: `src/app/assets/styles/themes/twilight.css`
- Modify: `src/app/assets/styles/themes/nord.css`
- Modify: `src/app/assets/styles/themes/github-dark.css`

**Step 1: 在 variables.css 添加默认主题渐变色**

在 `--tool-uuid-gradient` 之后添加：

```css
--tool-json-yaml-gradient: linear-gradient(135deg, #f7971e, #ffd200);
```

**Step 2: 在 ink-wash.css 添加**

在 `--tool-uuid-gradient` 之后添加：

```css
--tool-json-yaml-gradient: linear-gradient(135deg, #9e8e7a, #8a7d6d);
```

**Step 3: 在 twilight.css 添加**

在 `--tool-uuid-gradient` 之后添加：

```css
--tool-json-yaml-gradient: linear-gradient(135deg, #e2b93d, #f0c860);
```

**Step 4: 在 nord.css 添加**

在 `--tool-uuid-gradient` 之后添加：

```css
--tool-json-yaml-gradient: linear-gradient(135deg, #ebcb8b, #d08770);
```

**Step 5: 在 github-dark.css 添加**

在 `--tool-uuid-gradient` 之后添加：

```css
--tool-json-yaml-gradient: linear-gradient(135deg, #f0883e, #db6d28);
```

**Step 6: Commit**

```bash
git add src/app/assets/styles/variables.css src/app/assets/styles/themes/
git commit -m "🎨 feat(json-yaml): add tool gradient colors for all themes"
```

---

### Task 5: 实现 Vue 组件并注册到 registry

**Files:**

- Create: `src/app/tools/json-yaml-converter/JsonYamlConverterTool.vue`
- Create: `src/app/tools/json-yaml-converter/index.ts`
- Modify: `src/app/tools/registry.ts`

> 注意：index.ts 依赖 Vue 组件的 import，因此组件和注册在同一个 Task 中完成，确保 commit 后代码库可编译。

**Step 1: 创建 Vue 组件**

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { NInput, NSpace, NAlert, NRadioGroup, NRadioButton, NInputNumber } from 'naive-ui'
import CopyButton from '@/components/CopyButton.vue'
import ToolPageHeader from '@/components/ToolPageHeader.vue'
import { jsonYamlConverterTool } from './index'
import { jsonToYaml, yamlToJson, validateJson, validateYaml } from './utils'

const mode = ref<'json-to-yaml' | 'yaml-to-json'>('json-to-yaml')
const input = ref('')
const indent = ref<number | null>(2)

const safeIndent = computed(() => indent.value ?? 2)

const error = computed(() => {
  if (!input.value) return ''
  if (mode.value === 'json-to-yaml') {
    return validateJson(input.value) ?? ''
  } else {
    return validateYaml(input.value) ?? ''
  }
})

const output = computed(() => {
  if (!input.value || error.value) return ''
  try {
    if (mode.value === 'json-to-yaml') {
      return jsonToYaml(input.value, safeIndent.value)
    } else {
      return yamlToJson(input.value, safeIndent.value)
    }
  } catch {
    return ''
  }
})

const inputLabel = computed(() => (mode.value === 'json-to-yaml' ? 'JSON' : 'YAML'))
const outputLabel = computed(() => (mode.value === 'json-to-yaml' ? 'YAML' : 'JSON'))
const inputPlaceholder = computed(() =>
  mode.value === 'json-to-yaml' ? '在此粘贴 JSON...' : '在此粘贴 YAML...',
)
</script>

<template>
  <div>
    <ToolPageHeader
      :title="jsonYamlConverterTool.title"
      :description="jsonYamlConverterTool.description"
      :icon="jsonYamlConverterTool.icon"
      :gradient-var="jsonYamlConverterTool.gradientVar"
    />

    <div class="tool-controls">
      <NSpace align="center">
        <NRadioGroup v-model:value="mode" size="small">
          <NRadioButton value="json-to-yaml">JSON → YAML</NRadioButton>
          <NRadioButton value="yaml-to-json">YAML → JSON</NRadioButton>
        </NRadioGroup>
        <NSpace align="center" :size="8">
          <span class="control-label">缩进：</span>
          <NInputNumber v-model:value="indent" :min="1" :max="8" size="small" style="width: 80px" />
        </NSpace>
      </NSpace>
    </div>

    <NAlert v-if="error" type="error" :bordered="false" style="margin-bottom: 16px">
      {{ error }}
    </NAlert>
    <NAlert v-else-if="input" type="success" :bordered="false" style="margin-bottom: 16px">
      {{ inputLabel }} 格式正确
    </NAlert>

    <div class="split-panel">
      <div class="panel-input">
        <div class="panel-label">{{ inputLabel }}</div>
        <NInput
          v-model:value="input"
          type="textarea"
          :placeholder="inputPlaceholder"
          :rows="16"
          class="mono-input"
        />
      </div>
      <div class="panel-divider" />
      <div class="panel-output">
        <div class="panel-label">{{ outputLabel }}</div>
        <div class="output-wrapper">
          <NInput
            :value="output"
            type="textarea"
            readonly
            placeholder="转换结果将显示在这里"
            :rows="16"
            class="mono-input"
          />
          <div v-if="output" class="output-copy">
            <CopyButton :text="output" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-controls {
  margin-bottom: var(--space-md);
}

.control-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.split-panel {
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  gap: var(--space-md);
  min-height: 0;
}

.panel-input,
.panel-output {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  min-width: 0;
}

.panel-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
}

.panel-divider {
  background: var(--color-border);
}

.output-wrapper {
  position: relative;
}

.output-copy {
  position: absolute;
  top: 8px;
  right: 8px;
}

.mono-input :deep(textarea) {
  font-family: var(--font-mono) !important;
  font-size: 13px !important;
}
</style>
```

**Step 2: 创建 index.ts 导出 ToolMeta**

```typescript
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
```

**Step 3: 在 registry.ts 中注册**

在文件顶部添加 import：

```typescript
import { jsonYamlConverterTool } from './json-yaml-converter'
```

在 `toolRegistry` 数组中 `uuidGeneratorTool` 之后添加：

```typescript
  jsonYamlConverterTool,
```

**Step 4: 验证编译通过**

Run:

```bash
cd /Users/chen/Repository/swiss-kit && pnpm build
```

Expected: 编译成功，无错误

**Step 5: Commit**

```bash
git add src/app/tools/json-yaml-converter/JsonYamlConverterTool.vue src/app/tools/json-yaml-converter/index.ts src/app/tools/registry.ts
git commit -m "✨ feat(json-yaml): add Vue component, ToolMeta and register"
```

---

### Task 6: 运行全量测试和 Lint 检查

**Files:** 无新文件

**Step 1: 运行所有测试**

Run:

```bash
cd /Users/chen/Repository/swiss-kit && pnpm test:run
```

Expected: ALL PASS

**Step 2: 运行 Lint**

Run:

```bash
cd /Users/chen/Repository/swiss-kit && pnpm lint
```

Expected: 无错误

**Step 3: 运行格式检查**

Run:

```bash
cd /Users/chen/Repository/swiss-kit && pnpm format:check
```

Expected: 所有文件格式正确（如有格式问题则运行 `pnpm format` 修复后 commit）
