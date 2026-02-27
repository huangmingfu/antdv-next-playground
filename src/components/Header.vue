<script setup lang="ts">
import type { SelectValue } from 'antdv-next';
import type { ComputedRef } from 'vue';
import type { Store } from '@/composables';
import type { VersionKey } from '@/utils/dependency';
import { GithubFilled, ReloadOutlined, SettingOutlined, ShareAltOutlined } from '@antdv-next/icons';
import { computed, reactive, unref } from 'vue';
import { cdn, getSupportedAntdVersions, getSupportedTSVersions, getSupportedVueVersions } from '@/utils/dependency';
import { autoLabelOptions, copy } from '@/utils/tools';

const { store } = defineProps<{
  store: Store;
}>();

const emit = defineEmits<{
  (e: 'refresh'): void;
}>();

const iconsEnabled = computed({
  get: () => store.iconsEnabled,
  set: val => store.setIconsEnabled(unref(val)),
});

const cdnOptions = [
  {
    label: 'Jsdmirror (字节跳动)',
    value: 'jsdmirror',
  },
  // 以下 cdn 部分库存在 404 或 403 的情况
  // {
  //   label: 'BootCDN (又拍云)',
  //   value: 'bootcdn',
  // },
  // {
  //   label: 'Staticfile CDN (七牛云)',
  //   value: 'staticfile',
  // },
  // {
  //   label: 'ElemeCDN (饿了么)',
  //   value: 'elemecdn',
  // },
  {
    label: 'jsDelivr',
    value: 'jsdelivr',
  },
  {
    label: 'jsDelivr Fastly',
    value: 'jsdelivr-fastly',
  },
  {
    label: 'unpkg',
    value: 'unpkg',
  },
];

const versions = reactive<Record<VersionKey, { text: string; active: string; published: ComputedRef<string[]> }>>({
  antdvNext: {
    text: 'Antdv Next',
    published: getSupportedAntdVersions(),
    active: store.versions.antdvNext,
  },
  vue: {
    text: 'Vue',
    published: getSupportedVueVersions(),
    active: store.versions.vue,
  },
  typescript: {
    text: 'TypeScript',
    published: getSupportedTSVersions(),
    active: store.versions.typescript,
  },
});

async function setVersion(key: VersionKey, v: SelectValue) {
  versions[key].active = `loading...`;
  await store.setVersion(key, v as string);
  versions[key].active = v as string;
}

function copyLink() {
  copy(location.href, '可共享URL已被复制到剪贴板。');
}

function refreshView() {
  emit('refresh');
}
</script>

<template>
  <nav>
    <div :style="{ lineHeight: 'var(--nav-height)' }" class="m-0 flex items-center font-medium">
      <img
        class="relative top--2px mr-2 h-6"
        alt="logo"
        src="/logo.svg"
      >
      <div class="flex items-center gap-1 lt-sm-hidden">
        <div class="text-xl">
          Antdv Next Playground
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <div
        v-for="(v, key) of versions"
        :key="key"
        class="flex items-center gap-2 lt-lg-hidden"
      >
        <span>{{ v.text }}:</span>
        <a-select
          :value="v.active"
          :options="autoLabelOptions(v.published)"
          size="small"
          style="min-width: 180px"
          @update:value="setVersion(key, $event)"
        />
      </div>
      <div class="flex gap-4 text-lg">
        <ReloadOutlined @click="refreshView" />
        <ShareAltOutlined @click="copyLink" />
        <a
          href="https://github.com/huangmingfu/antdv-next-playground"
          target="_blank"
          class="hover:color-primary flex"
        >
          <GithubFilled />
        </a>
        <a-popover trigger="click" placement="bottomRight">
          <SettingOutlined />
          <template #content>
            <a-form>
              <a-form-item label="CDN">
                <a-select v-model:value="cdn" :options="cdnOptions" style="width: 200px" />
              </a-form-item>
              <a-form-item label="@antdv-next/icons" tooltip="由于图标库包含大量文件，全量加载会影响性能，建议仅在需要使用图标时开启。">
                <a-switch v-model:checked="iconsEnabled" checked-children="开" un-checked-children="关" />
              </a-form-item>
            </a-form>
          </template>
        </a-popover>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
nav {
  --bg: #fff;
  --bg-light: #fff;
  --border: #ddd;

  --at-apply: 'box-border flex justify-between px-4 z-999 relative';

  height: var(--nav-height);
  background-color: var(--bg);
}
</style>
