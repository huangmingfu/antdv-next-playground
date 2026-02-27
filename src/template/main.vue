<script setup>
import { setupAntDesignVue } from './antdv-next.js';
import App from './App.vue';
import { version as antdVersion } from 'antdv-next'
import { version as vueVersion } from 'vue'

setupAntDesignVue();
</script>

<template>
  <div style="margin: 10px;">
    <App />
    <!-- 固定展示版本号 -->
    <p style="position: fixed; bottom: 0px;">
      Antdv Next：<span style="color: #1890FF;">{{ antdVersion }}</span>
      <br/>
      Vue：<span style="color: #1890FF;">{{ vueVersion }}</span>
      <br/>
    </p>
  </div>
</template>
