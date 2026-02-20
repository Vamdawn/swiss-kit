# Timestamp Converter Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a timestamp converter tool that bidirectionally converts between Unix timestamps and human-readable date formats.

**Architecture:** Single input box with smart detection (numbers → timestamp, date strings → parsed date). Output section shows all formats simultaneously with per-item copy buttons. Pure utility functions in `utils.ts`, reactive Vue component consumes them via computed properties.

**Tech Stack:** Vue 3, Naive UI, native JS Date + Intl API (zero new dependencies)

---

### Task 1: Add theme gradient CSS variables

**Files:**

- Modify: `src/app/assets/styles/variables.css` (after `--tool-json-yaml-gradient`)
- Modify: `src/app/assets/styles/themes/ink-wash.css` (after `--tool-json-yaml-gradient`)
- Modify: `src/app/assets/styles/themes/twilight.css` (after `--tool-json-yaml-gradient`)
- Modify: `src/app/assets/styles/themes/nord.css` (after `--tool-json-yaml-gradient`)
- Modify: `src/app/assets/styles/themes/github-dark.css` (after `--tool-json-yaml-gradient`)

**Step 1: Add gradient to default theme (variables.css)**

In `src/app/assets/styles/variables.css`, add after the `--tool-json-yaml-gradient` line:

```css
--tool-timestamp-gradient: linear-gradient(135deg, #667eea, #4facfe);
```

**Step 2: Add gradient to ink-wash theme**

In `src/app/assets/styles/themes/ink-wash.css`, add after `--tool-json-yaml-gradient`:

```css
--tool-timestamp-gradient: linear-gradient(135deg, #6b8fa3, #4a7c8f);
```

**Step 3: Add gradient to twilight theme**

In `src/app/assets/styles/themes/twilight.css`, add after `--tool-json-yaml-gradient`:

```css
--tool-timestamp-gradient: linear-gradient(135deg, #a78bfa, #818cf8);
```

**Step 4: Add gradient to nord theme**

In `src/app/assets/styles/themes/nord.css`, add after `--tool-json-yaml-gradient`:

```css
--tool-timestamp-gradient: linear-gradient(135deg, #81a1c1, #88c0d0);
```

**Step 5: Add gradient to github-dark theme**

In `src/app/assets/styles/themes/github-dark.css`, add after `--tool-json-yaml-gradient`:

```css
--tool-timestamp-gradient: linear-gradient(135deg, #79c0ff, #58a6ff);
```

**Step 6: Commit**

```bash
git add src/app/assets/styles/variables.css src/app/assets/styles/themes/*.css
git commit -m "🎨 feat(timestamp): add tool gradient colors for all themes"
```

---

### Task 2: Write utils.ts with tests

**Files:**

- Create: `src/app/tools/timestamp-converter/utils.ts`
- Create: `src/app/tools/timestamp-converter/__tests__/timestamp-converter.test.ts`

**Step 1: Create utils.ts with all pure functions**

Create `src/app/tools/timestamp-converter/utils.ts`:

```typescript
export interface ParsedInput {
  type: 'timestamp-s' | 'timestamp-ms' | 'date'
  ms: number
}

export function isMilliseconds(num: number): boolean {
  // Timestamps in seconds are 10 digits (up to 2286-11-20)
  // Timestamps in milliseconds are 13 digits
  // Negative values are always treated as seconds (pre-epoch dates)
  return num > 9_999_999_999
}

export function parseInput(input: string): ParsedInput | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  // Try as numeric timestamp
  if (/^-?\d+$/.test(trimmed)) {
    const num = Number(trimmed)
    if (!Number.isFinite(num)) return null
    if (isMilliseconds(num)) {
      return { type: 'timestamp-ms', ms: num }
    }
    return { type: 'timestamp-s', ms: num * 1000 }
  }

  // Try as date string
  const date = new Date(trimmed)
  if (!Number.isNaN(date.getTime())) {
    return { type: 'date', ms: date.getTime() }
  }

  return null
}

export function formatISO8601(ms: number): string {
  return new Date(ms).toISOString()
}

export function formatLocalTime(ms: number): string {
  const d = new Date(ms)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export function formatUTCTime(ms: number): string {
  const d = new Date(ms)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getUTCFullYear()}/${pad(d.getUTCMonth() + 1)}/${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`
}

export function formatRFC2822(ms: number): string {
  return new Date(ms).toUTCString()
}

export function formatRelativeTime(ms: number, now?: number): string {
  const current = now ?? Date.now()
  const diffMs = current - ms
  const absDiff = Math.abs(diffMs)
  const isPast = diffMs > 0

  const seconds = Math.floor(absDiff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  let label: string
  if (seconds < 5) return '刚刚'
  if (seconds < 60) label = `${seconds} 秒`
  else if (minutes < 60) label = `${minutes} 分钟`
  else if (hours < 24) label = `${hours} 小时`
  else if (days < 30) label = `${days} 天`
  else if (months < 12) label = `${months} 个月`
  else label = `${years} 年`

  return isPast ? `${label}前` : `${label}后`
}
```

**Step 2: Write comprehensive tests**

Create `src/app/tools/timestamp-converter/__tests__/timestamp-converter.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import {
  parseInput,
  isMilliseconds,
  formatISO8601,
  formatLocalTime,
  formatUTCTime,
  formatRFC2822,
  formatRelativeTime,
} from '../utils'

describe('timestamp converter utils', () => {
  describe('isMilliseconds', () => {
    it('should return false for 10-digit numbers (seconds)', () => {
      expect(isMilliseconds(1708416000)).toBe(false)
    })

    it('should return true for 13-digit numbers (milliseconds)', () => {
      expect(isMilliseconds(1708416000000)).toBe(true)
    })

    it('should return false for small numbers', () => {
      expect(isMilliseconds(0)).toBe(false)
      expect(isMilliseconds(1000)).toBe(false)
    })
  })

  describe('parseInput', () => {
    it('should return null for empty string', () => {
      expect(parseInput('')).toBeNull()
      expect(parseInput('   ')).toBeNull()
    })

    it('should parse seconds timestamp', () => {
      const result = parseInput('1708416000')
      expect(result).toEqual({ type: 'timestamp-s', ms: 1708416000000 })
    })

    it('should parse milliseconds timestamp', () => {
      const result = parseInput('1708416000000')
      expect(result).toEqual({ type: 'timestamp-ms', ms: 1708416000000 })
    })

    it('should parse ISO 8601 date string', () => {
      const result = parseInput('2024-02-20T08:00:00.000Z')
      expect(result).not.toBeNull()
      expect(result!.type).toBe('date')
      expect(result!.ms).toBe(1708416000000)
    })

    it('should parse simple date string', () => {
      const result = parseInput('2024-02-20')
      expect(result).not.toBeNull()
      expect(result!.type).toBe('date')
    })

    it('should return null for invalid input', () => {
      expect(parseInput('not-a-date')).toBeNull()
      expect(parseInput('abc123')).toBeNull()
    })

    it('should handle negative timestamps', () => {
      const result = parseInput('-1000')
      expect(result).not.toBeNull()
      expect(result!.type).toBe('timestamp-s')
      expect(result!.ms).toBe(-1000000)
    })

    it('should handle zero timestamp', () => {
      const result = parseInput('0')
      expect(result).toEqual({ type: 'timestamp-s', ms: 0 })
    })

    it('should treat large negative numbers as seconds', () => {
      const result = parseInput('-10000000000')
      expect(result).not.toBeNull()
      expect(result!.type).toBe('timestamp-s')
    })
  })

  describe('formatISO8601', () => {
    it('should format to ISO 8601 string', () => {
      expect(formatISO8601(1708416000000)).toBe('2024-02-20T08:00:00.000Z')
    })

    it('should handle epoch zero', () => {
      expect(formatISO8601(0)).toBe('1970-01-01T00:00:00.000Z')
    })
  })

  describe('formatLocalTime', () => {
    it('should format to local readable time', () => {
      // Use a known UTC time; local output depends on test runner timezone
      const result = formatLocalTime(1708416000000)
      expect(result).toMatch(/^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/)
    })
  })

  describe('formatUTCTime', () => {
    it('should format to UTC readable time', () => {
      expect(formatUTCTime(1708416000000)).toBe('2024/02/20 08:00:00')
    })

    it('should pad single digits', () => {
      // 2024-01-05 03:04:05 UTC
      const ms = Date.UTC(2024, 0, 5, 3, 4, 5)
      expect(formatUTCTime(ms)).toBe('2024/01/05 03:04:05')
    })
  })

  describe('formatRFC2822', () => {
    it('should format to RFC 2822 string', () => {
      const result = formatRFC2822(1708416000000)
      expect(result).toContain('Tue')
      expect(result).toContain('20 Feb 2024')
      expect(result).toContain('08:00:00')
      expect(result).toContain('GMT')
    })
  })

  describe('formatRelativeTime', () => {
    const base = 1708416000000 // 2024-02-20T08:00:00Z

    it('should show 刚刚 for < 5s', () => {
      expect(formatRelativeTime(base, base + 3_000)).toBe('刚刚')
    })

    it('should show seconds for < 60s', () => {
      expect(formatRelativeTime(base, base + 30_000)).toBe('30 秒前')
    })

    it('should show minutes for < 60min', () => {
      expect(formatRelativeTime(base, base + 5 * 60_000)).toBe('5 分钟前')
    })

    it('should show hours for < 24h', () => {
      expect(formatRelativeTime(base, base + 3 * 3600_000)).toBe('3 小时前')
    })

    it('should show days for < 30d', () => {
      expect(formatRelativeTime(base, base + 7 * 86400_000)).toBe('7 天前')
    })

    it('should show months for < 12mo', () => {
      expect(formatRelativeTime(base, base + 60 * 86400_000)).toBe('2 个月前')
    })

    it('should show years for >= 365d', () => {
      expect(formatRelativeTime(base, base + 400 * 86400_000)).toBe('1 年前')
    })

    it('should show future times with 后', () => {
      expect(formatRelativeTime(base + 3600_000, base)).toBe('1 小时后')
    })
  })
})
```

**Step 3: Run tests to verify they pass**

Run: `npx vitest run src/app/tools/timestamp-converter/__tests__/timestamp-converter.test.ts`

Expected: ALL PASS

**Step 4: Commit**

```bash
git add src/app/tools/timestamp-converter/utils.ts src/app/tools/timestamp-converter/__tests__/timestamp-converter.test.ts
git commit -m "✨ feat(timestamp): add conversion utils with tests"
```

---

### Task 3: Create ToolMeta and Vue component, register in registry

**Files:**

- Create: `src/app/tools/timestamp-converter/index.ts`
- Create: `src/app/tools/timestamp-converter/TimestampConverterTool.vue`
- Modify: `src/app/tools/registry.ts`

**Step 1: Create index.ts with ToolMeta**

Create `src/app/tools/timestamp-converter/index.ts`:

```typescript
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
```

> SVG icon: a clock face (circle + clock hands). Matches `viewBox="0 0 24 24"`, `stroke` style, same as other tools.

**Step 2: Create TimestampConverterTool.vue**

Create `src/app/tools/timestamp-converter/TimestampConverterTool.vue`:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { NInput, NButton, NAlert, NSpace } from 'naive-ui'
import CopyButton from '@/components/CopyButton.vue'
import ToolPageHeader from '@/components/ToolPageHeader.vue'
import { timestampConverterTool } from './index'
import {
  parseInput,
  formatISO8601,
  formatLocalTime,
  formatUTCTime,
  formatRFC2822,
  formatRelativeTime,
} from './utils'

const input = ref('')

const parsed = computed(() => parseInput(input.value))

const typeLabel = computed(() => {
  if (!parsed.value) return ''
  switch (parsed.value.type) {
    case 'timestamp-s':
      return '识别为: Unix 时间戳 (秒)'
    case 'timestamp-ms':
      return '识别为: Unix 时间戳 (毫秒)'
    case 'date':
      return '识别为: 日期字符串'
  }
})

const formats = computed(() => {
  if (!parsed.value) return []
  const ms = parsed.value.ms
  return [
    { label: 'Unix (秒)', value: String(Math.floor(ms / 1000)), copyable: true },
    { label: 'Unix (毫秒)', value: String(ms), copyable: true },
    { label: 'ISO 8601', value: formatISO8601(ms), copyable: true },
    { label: '本地时间', value: formatLocalTime(ms), copyable: true },
    { label: 'UTC 时间', value: formatUTCTime(ms), copyable: true },
    { label: 'RFC 2822', value: formatRFC2822(ms), copyable: true },
    { label: '相对时间', value: formatRelativeTime(ms), copyable: false },
  ]
})

const hasError = computed(() => {
  return input.value.trim() !== '' && !parsed.value
})

function fillNow() {
  input.value = String(Date.now())
}
</script>

<template>
  <div>
    <ToolPageHeader
      :title="timestampConverterTool.title"
      :description="timestampConverterTool.description"
      :icon="timestampConverterTool.icon"
      :gradient-var="timestampConverterTool.gradientVar"
    />

    <div class="tool-controls">
      <NSpace align="center">
        <NButton size="small" @click="fillNow">当前时间</NButton>
      </NSpace>
    </div>

    <NInput
      v-model:value="input"
      type="textarea"
      placeholder="输入时间戳或日期字符串..."
      :rows="2"
      class="mono-input"
    />

    <NAlert v-if="hasError" type="error" :bordered="false" style="margin-top: 16px">
      无法识别输入，请输入 Unix 时间戳或日期字符串
    </NAlert>
    <NAlert v-else-if="parsed" type="success" :bordered="false" style="margin-top: 16px">
      {{ typeLabel }}
    </NAlert>

    <div v-if="parsed" class="result-list">
      <div v-for="item in formats" :key="item.label" class="result-row">
        <span class="result-label">{{ item.label }}</span>
        <code class="result-value">{{ item.value }}</code>
        <CopyButton v-if="item.copyable" :text="item.value" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-controls {
  margin-bottom: var(--space-md);
}

.mono-input :deep(textarea) {
  font-family: var(--font-mono) !important;
  font-size: 13px !important;
}

.result-list {
  margin-top: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.result-row {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-sm);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
}

.result-label {
  flex-shrink: 0;
  width: 90px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.result-value {
  flex: 1;
  min-width: 0;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  word-break: break-all;
}
</style>
```

**Step 3: Register in registry.ts**

In `src/app/tools/registry.ts`, add import and entry:

```typescript
import { timestampConverterTool } from './timestamp-converter'
```

Add to the `toolRegistry` array:

```typescript
export const toolRegistry: ToolMeta[] = [
  jsonFormatterTool,
  base64Tool,
  urlEncoderTool,
  uuidGeneratorTool,
  jsonYamlConverterTool,
  timestampConverterTool,
]
```

**Step 4: Verify the app builds without errors**

Run: `npx vite build`

Expected: Build succeeds with no errors.

**Step 5: Commit**

```bash
git add src/app/tools/timestamp-converter/index.ts src/app/tools/timestamp-converter/TimestampConverterTool.vue src/app/tools/registry.ts
git commit -m "✨ feat(timestamp): add Vue component, ToolMeta and register"
```

---

### Task 4: Final integration verification

**Step 1: Run all tests**

Run: `npx vitest run`

Expected: ALL tests pass (including existing tools + new timestamp tests).

**Step 2: Run dev server and manually verify**

Run: `npx vite dev`

Verify:

- Tool appears in sidebar navigation
- Tool appears on home page grid
- Gradient icon displays correctly
- Input `1708416000` → shows all formats with correct values
- Input `2024-02-20T08:00:00Z` → shows timestamp and all formats
- "当前时间" button fills current timestamp
- Copy buttons work on each result row
- Invalid input shows error alert
- Switch between all 5 themes → gradient colors look correct

**Step 3: Squash commit (if any fixes needed)**

If fixes were needed, commit them:

```bash
git add src/app/tools/timestamp-converter/ src/app/assets/styles/
git commit -m "✨ feat: add timestamp converter tool"
```
