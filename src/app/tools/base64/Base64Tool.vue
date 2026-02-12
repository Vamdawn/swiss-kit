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
          <input v-model="mode" type="radio" value="encode" />
          编码
        </label>
        <label>
          <input v-model="mode" type="radio" value="decode" />
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
