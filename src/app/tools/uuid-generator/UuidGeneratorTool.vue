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
          <input v-model="generatorType" type="radio" value="uuidv4" />
          UUID v4
        </label>
        <label>
          <input v-model="generatorType" type="radio" value="uuidv7" />
          UUID v7
        </label>
        <label>
          <input v-model="generatorType" type="radio" value="ulid" />
          ULID
        </label>
      </NSpace>

      <NSpace align="center">
        <span>数量：</span>
        <NInput
          :value="String(count)"
          style="width: 80px"
          size="small"
          @update:value="(v: string) => (count = Math.max(1, Math.min(100, Number(v) || 1)))"
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
