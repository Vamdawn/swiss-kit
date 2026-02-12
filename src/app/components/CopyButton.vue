<script setup lang="ts">
import { ref } from 'vue'
import { NButton } from 'naive-ui'

const props = defineProps<{
  text: string
}>()

const copied = ref(false)

async function copy() {
  await navigator.clipboard.writeText(props.text)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 1500)
}
</script>

<template>
  <NButton quaternary size="small" @click="copy">
    {{ copied ? '已复制' : '复制' }}
  </NButton>
</template>
