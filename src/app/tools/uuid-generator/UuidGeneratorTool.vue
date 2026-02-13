<script setup lang="ts">
import { ref } from 'vue'
import { NButton, NInputNumber, NRadioGroup, NRadioButton, NSpace } from 'naive-ui'
import CopyButton from '@/components/CopyButton.vue'
import ToolPageHeader from '@/components/ToolPageHeader.vue'
import { uuidGeneratorTool } from './index'
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
    <ToolPageHeader
      :title="uuidGeneratorTool.title"
      :description="uuidGeneratorTool.description"
      :icon="uuidGeneratorTool.icon"
      :gradient-var="uuidGeneratorTool.gradientVar"
    />

    <NSpace vertical :size="16">
      <NSpace align="center" :size="16">
        <NRadioGroup v-model:value="generatorType" size="small">
          <NRadioButton value="uuidv4">UUID v4</NRadioButton>
          <NRadioButton value="uuidv7">UUID v7</NRadioButton>
          <NRadioButton value="ulid">ULID</NRadioButton>
        </NRadioGroup>
      </NSpace>

      <NSpace align="center">
        <span class="control-label">数量：</span>
        <NInputNumber v-model:value="count" :min="1" :max="100" size="small" style="width: 100px" />
        <NButton type="primary" @click="generate">生成</NButton>
      </NSpace>

      <div class="result-list">
        <div v-for="(result, i) in results" :key="i" class="result-row">
          <span class="result-index">{{ i + 1 }}</span>
          <code class="result-value">{{ result }}</code>
          <CopyButton :text="result" />
        </div>
      </div>
    </NSpace>
  </div>
</template>

<style scoped>
.control-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.result-row {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-sm) var(--space-md);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  transition: border-color var(--transition-fast);
}

.result-row:hover {
  border-color: var(--color-accent);
}

.result-index {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  min-width: 24px;
  text-align: center;
}

.result-value {
  font-family: var(--font-mono);
  font-size: 14px;
  flex: 1;
  word-break: break-all;
}
</style>
