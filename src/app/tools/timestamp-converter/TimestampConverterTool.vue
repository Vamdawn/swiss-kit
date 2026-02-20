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
    default:
      return ''
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
