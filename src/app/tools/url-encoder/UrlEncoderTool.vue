<script setup lang="ts">
import { ref, computed } from 'vue'
import { NInput, NAlert, NRadioGroup, NRadioButton } from 'naive-ui'
import CopyButton from '@/components/CopyButton.vue'
import ToolPageHeader from '@/components/ToolPageHeader.vue'
import { urlEncoderTool } from './index'
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
    <ToolPageHeader
      :title="urlEncoderTool.title"
      :description="urlEncoderTool.description"
      :icon="urlEncoderTool.icon"
      :gradient-var="urlEncoderTool.gradientVar"
    />

    <div class="tool-controls">
      <NRadioGroup v-model:value="mode" size="small">
        <NRadioButton value="encode">编码</NRadioButton>
        <NRadioButton value="decode">解码</NRadioButton>
      </NRadioGroup>
    </div>

    <NAlert v-if="result.error" type="error" :bordered="false" style="margin-bottom: 16px">
      {{ result.error }}
    </NAlert>

    <div class="split-panel">
      <div class="panel-input">
        <div class="panel-label">输入</div>
        <NInput
          v-model:value="input"
          type="textarea"
          :placeholder="mode === 'encode' ? '输入要编码的文本...' : '输入 URL 编码字符串...'"
          :rows="14"
          class="mono-input"
        />
      </div>
      <div class="panel-divider" />
      <div class="panel-output">
        <div class="panel-label">输出</div>
        <div class="output-wrapper">
          <NInput
            :value="result.value"
            type="textarea"
            readonly
            placeholder="结果将显示在这里"
            :rows="14"
            class="mono-input"
          />
          <div v-if="result.value" class="output-copy">
            <CopyButton :text="result.value" />
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
