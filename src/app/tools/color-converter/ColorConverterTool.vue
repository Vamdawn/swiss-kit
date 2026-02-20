<script setup lang="ts">
import { ref, computed } from 'vue'
import { NInput, NAlert } from 'naive-ui'
import CopyButton from '@/components/CopyButton.vue'
import ToolPageHeader from '@/components/ToolPageHeader.vue'
import { colorConverterTool } from './index'
import {
  parseColorInput,
  toHex,
  toRgbString,
  toHslString,
  findNamedColor,
  getContrastColor,
} from './utils'

const input = ref('')

const parsed = computed(() => parseColorInput(input.value))

const hexValue = computed(() => (parsed.value ? toHex(parsed.value) : ''))
const rgbValue = computed(() => (parsed.value ? toRgbString(parsed.value) : ''))
const hslValue = computed(() => (parsed.value ? toHslString(parsed.value) : ''))
const namedColor = computed(() => (parsed.value ? findNamedColor(parsed.value) : null))
const contrastColor = computed(() => (parsed.value ? getContrastColor(parsed.value) : '#000000'))

const previewBg = computed(() => (parsed.value ? hexValue.value : 'transparent'))

const hasError = computed(() => input.value.trim() !== '' && !parsed.value)

const QUICK_COLORS = [
  'red',
  'orange',
  'gold',
  'green',
  'teal',
  'blue',
  'indigo',
  'purple',
  'pink',
  'brown',
  'black',
  'white',
]

function selectQuickColor(name: string) {
  input.value = name
}
</script>

<template>
  <div>
    <ToolPageHeader
      :title="colorConverterTool.title"
      :description="colorConverterTool.description"
      :icon="colorConverterTool.icon"
      :gradient-var="colorConverterTool.gradientVar"
    />

    <div class="input-area">
      <div class="input-wrapper">
        <span
          class="color-indicator"
          :style="{ background: parsed ? previewBg : 'var(--color-border)' }"
        />
        <NInput
          v-model:value="input"
          placeholder="输入颜色值：#FF6B6B、rgb(255,107,107)、hsl(0,100%,71%)、tomato"
          class="color-input"
          clearable
        />
      </div>
    </div>

    <NAlert v-if="hasError" type="warning" :bordered="false" style="margin-top: var(--space-sm)">
      无法识别的颜色格式
    </NAlert>

    <div v-if="parsed" class="preview-section">
      <div
        class="color-preview"
        :style="{ background: previewBg }"
        role="img"
        :aria-label="`颜色预览: ${hexValue}`"
      >
        <span class="preview-hex" :style="{ color: contrastColor }">{{ hexValue }}</span>
      </div>

      <div class="result-list">
        <div class="result-row">
          <span class="result-label">HEX</span>
          <code class="result-value">{{ hexValue }}</code>
          <CopyButton :text="hexValue" />
        </div>
        <div class="result-row">
          <span class="result-label">RGB</span>
          <code class="result-value">{{ rgbValue }}</code>
          <CopyButton :text="rgbValue" />
        </div>
        <div class="result-row">
          <span class="result-label">HSL</span>
          <code class="result-value">{{ hslValue }}</code>
          <CopyButton :text="hslValue" />
        </div>
        <div class="result-row">
          <span class="result-label">CSS</span>
          <code v-if="namedColor" class="result-value">{{ namedColor }}</code>
          <span v-else class="result-value result-value--empty">无匹配的命名色</span>
          <CopyButton v-if="namedColor" :text="namedColor" />
        </div>
      </div>
    </div>

    <div class="quick-colors">
      <button
        v-for="name in QUICK_COLORS"
        :key="name"
        class="quick-color-dot"
        :style="{ background: name }"
        :title="name"
        :aria-label="`选择颜色 ${name}`"
        @click="selectQuickColor(name)"
      />
    </div>
  </div>
</template>

<style scoped>
.input-area {
  margin-bottom: var(--space-md);
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.color-indicator {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  transition: background var(--transition-fast);
}

.color-input {
  flex: 1;
}

.color-input :deep(input) {
  font-family: var(--font-mono) !important;
  font-size: 13px !important;
}

.preview-section {
  display: flex;
  align-items: flex-start;
  gap: var(--space-lg);
  margin-top: var(--space-lg);
}

.color-preview {
  flex-shrink: 0;
  width: 120px;
  height: 120px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
  transition: background var(--transition-fast);
}

.preview-hex {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.result-list {
  flex: 1;
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
  width: 36px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
}

.result-value {
  flex: 1;
  min-width: 0;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  word-break: break-all;
}

.result-value--empty {
  color: var(--color-text-secondary);
  font-style: italic;
  font-family: var(--font-body);
}

.quick-colors {
  display: flex;
  gap: var(--space-sm);
  margin-top: var(--space-xl);
  flex-wrap: wrap;
}

.quick-color-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  cursor: pointer;
  transition:
    transform var(--transition-fast),
    box-shadow var(--transition-fast);
  padding: 0;
}

.quick-color-dot:hover {
  transform: scale(1.2);
  box-shadow: var(--shadow-md);
}

.quick-color-dot:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
</style>
