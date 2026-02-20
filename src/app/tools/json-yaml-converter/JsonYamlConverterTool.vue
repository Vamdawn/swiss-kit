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
