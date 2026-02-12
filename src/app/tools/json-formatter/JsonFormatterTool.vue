<script setup lang="ts">
import { ref, computed } from 'vue'
import { NInput, NSpace, NButton, NAlert } from 'naive-ui'
import CopyButton from '@/components/CopyButton.vue'
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
    <h2 style="font-family: var(--font-display); margin-bottom: var(--space-lg)">
      JSON 格式化 / 校验
    </h2>

    <NSpace vertical :size="16">
      <NSpace>
        <NButton :disabled="!!validation" @click="doFormat">美化</NButton>
        <NButton :disabled="!!validation" @click="doMinify">压缩</NButton>
        <NSpace align="center">
          <span>缩进：</span>
          <NInput
            :value="String(indent)"
            style="width: 60px"
            size="small"
            @update:value="(v: string) => (indent = Math.max(1, Math.min(8, Number(v) || 2)))"
          />
        </NSpace>
      </NSpace>

      <NInput
        v-model:value="input"
        type="textarea"
        placeholder="在此粘贴 JSON..."
        :rows="12"
        style="font-family: var(--font-mono)"
      />

      <NAlert v-if="validation" type="error" :bordered="false">
        {{ validation }}
      </NAlert>

      <div v-if="!validation && input" style="position: relative">
        <NAlert type="success" :bordered="false">JSON 格式正确</NAlert>
      </div>

      <div v-if="formatted" style="position: relative">
        <NInput
          :value="formatted"
          type="textarea"
          readonly
          :rows="12"
          style="font-family: var(--font-mono)"
        />
        <div style="position: absolute; top: 8px; right: 8px">
          <CopyButton :text="formatted" />
        </div>
      </div>
    </NSpace>
  </div>
</template>
