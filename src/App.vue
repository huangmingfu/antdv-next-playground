<script setup lang="ts">
import { Repl } from '@vue/repl';
import Monaco from '@vue/repl/monaco-editor';
import { useEventListener, useLocalStorage } from '@vueuse/core';
import { message } from 'antdv-next';
import { ref, useTemplateRef, watchEffect } from 'vue';
import { Header } from '@/components';
import ConsolePanel from '@/components/ConsolePanel.vue';
import { useAutoSaveState, useConsole, useStore } from '@/composables';

const loading = ref(true);
const replRef = useTemplateRef<InstanceType<typeof Repl>>('repl');

const showConsole = useLocalStorage('console-visible', false);
const consoleHeight = useLocalStorage('console-height', 200);
const { logs, clearLogs } = useConsole();

/** 自动保存 */
const { autoSave } = useAutoSaveState();

/** @vue/repl */
const store = useStore({
  serializedState: location.hash.slice(1),
  initialized: () => {
    loading.value = false;
  },
});

function refreshPreview() {
  clearLogs();
  replRef.value?.reload();
  message.success('刷新成功!');
}

// persist state & clear console on file changes
watchEffect(() => {
  // eslint-disable-next-line ts/no-unused-expressions
  store.typescriptVersion;
  const serialized = store.serialize();
  history.replaceState(
    {},
    '',
    `${location.origin}${location.pathname}#${serialized}`,
  );
  clearLogs();
});

useEventListener(window, 'keydown', (evt: KeyboardEvent) => {
  if ((evt.ctrlKey || evt.metaKey) && evt.code === 'Backquote') {
    evt.preventDefault();
    showConsole.value = !showConsole.value;
  }
});
</script>

<template>
  <a-spin :spinning="loading" tip="Loading..." size="large">
    <div v-if="!loading">
      <Header
        :store="store"
        :show-console="showConsole"
        @refresh="refreshPreview"
        @toggle-console="showConsole = !showConsole"
      />
      <Repl
        ref="repl"
        v-model="autoSave"
        :editor="Monaco"
        :store="store"
        :show-compile-output="true"
        :auto-resize="true"
        :clear-console="false"
        @keydown.ctrl.s.prevent
        @keydown.meta.s.prevent
      />
      <Teleport defer to=".vue-repl .right">
        <ConsolePanel
          v-if="showConsole"
          v-model:height="consoleHeight"
          :logs="logs"
          @clear="clearLogs"
        />
      </Teleport>
    </div>
  </a-spin>
</template>

<style>
body {
  --at-apply: m-none text-13px;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
    sans-serif;
  --base: #444;
  --nav-height: 50px;
}

.vue-repl {
  height: calc(100vh - var(--nav-height)) !important;
}

.vue-repl .right {
  display: flex !important;
  flex-direction: column !important;
}

.vue-repl .right > .tab-buttons {
  flex-shrink: 0;
}

.vue-repl .right > .output-container {
  flex: 1;
  height: auto !important;
  min-height: 0;
}
</style>
