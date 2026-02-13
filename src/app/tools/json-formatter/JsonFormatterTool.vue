<script setup lang="ts">
import { ref, computed } from 'vue'
import { NInput, NSpace, NButton, NAlert, NInputNumber } from 'naive-ui'
import CopyButton from '@/components/CopyButton.vue'
import ToolPageHeader from '@/components/ToolPageHeader.vue'
import { jsonFormatterTool } from './index'
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
    <ToolPageHeader
      :title="jsonFormatterTool.title"
      :description="jsonFormatterTool.description"
      :icon="jsonFormatterTool.icon"
      :gradient-var="jsonFormatterTool.gradientVar"
    />

    <div class="tool-controls">
      <NSpace align="center">
        <NButton :disabled="!!validation" @click="doFormat">美化</NButton>
        <NButton :disabled="!!validation" @click="doMinify">压缩</NButton>
        <NSpace align="center" :size="8">
          <span class="control-label">缩进：</span>
          <NInputNumber v-model:value="indent" :min="1" :max="8" size="small" style="width: 80px" />
        </NSpace>
      </NSpace>
    </div>

    <NAlert v-if="validation" type="error" :bordered="false" style="margin-bottom: 16px">
      {{ validation }}
    </NAlert>
    <NAlert v-else-if="input" type="success" :bordered="false" style="margin-bottom: 16px">
      JSON 格式正确
    </NAlert>

    <div class="split-panel">
      <div class="panel-input">
        <div class="panel-label">输入</div>
        <NInput
          v-model:value="input"
          type="textarea"
          placeholder="在此粘贴 JSON..."
          :rows="16"
          class="mono-input"
        />
      </div>
      <div class="panel-divider" />
      <div class="panel-output">
        <div class="panel-label">输出</div>
        <div class="output-wrapper">
          <NInput
            :value="formatted"
            type="textarea"
            readonly
            placeholder="格式化结果将显示在这里"
            :rows="16"
            class="mono-input"
          />
          <div v-if="formatted" class="output-copy">
            <CopyButton :text="formatted" />
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
