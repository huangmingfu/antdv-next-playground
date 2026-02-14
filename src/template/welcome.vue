<script setup lang="ts">
import { ref } from 'vue'

const msg = ref('Hello World!')
</script>

<template>
  <h1>{{ msg }}</h1>
  <a-space direction="vertical">
    <a-input v-model:value="msg" />
    <div>
      ColorPicker 颜色选择器 ：<a-color-picker default-value="#1677ff" />
    </div>
    <a-alert message="Success Tips" type="success" show-icon />
  </a-space>
</template>
