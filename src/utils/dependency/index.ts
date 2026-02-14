import type { ImportMap } from '@vue/repl';
import type { MaybeRef, Ref } from 'vue';
import type { Cdn, Dependency, Versions } from './types';
import { useFetch, useLocalStorage } from '@vueuse/core';
import { gte } from 'semver';
import { computed, unref } from 'vue';
import { devDepsProxy } from '@/proxy';

export * from './types';

export const cdn = useLocalStorage<Cdn>('setting-cdn', 'jsdmirror');

export function genCdnLink(
  pkg: string,
  version: string,
  path: string,
) {
  // 开发不使用公共 cdn，提升 deps 加载速度
  if (import.meta.env.VITE_NODE_ENV === 'development')
    return devDepsProxy[pkg] || '';

  if (pkg === '@antdv-next/icons' || pkg === 'antdv-next')
    return path;

  switch (cdn.value) {
    case 'jsdelivr':
      return `https://cdn.jsdelivr.net/npm/${pkg}@${version}${path}`;
    case 'jsdelivr-fastly':
      return `https://fastly.jsdelivr.net/npm/${pkg}@${version}${path}`;
    case 'unpkg':
      return `https://unpkg.com/${pkg}@${version}${path}`;
    case 'elemecdn':
      return `https://npm.elemecdn.com/${pkg}@${version}${path}`;
    case 'jsdmirror':
      return `https://cdn.jsdmirror.com/npm/${pkg}@${version}${path}`;
    case 'bootcdn':
      return `https://cdn.bootcdn.net/ajax/libs/${pkg}/${version}${path}`;
    case 'staticfile':
      return `https://cdn.staticfile.net/${pkg}/${version}${path}`;
    default:
      return '';
  }
}

export function genCompilerSfcLink(version: string) {
  return genCdnLink(
    '@vue/compiler-sfc',
    version,
    '/dist/compiler-sfc.esm-browser.js',
  );
}

export function genImportMap(versions: Versions): ImportMap {
  const deps: Record<string, Dependency> = {
    'vue': {
      pkg: '@vue/runtime-dom',
      version: versions.vue,
      path: '/dist/runtime-dom.esm-browser.prod.js',
    },
    '@vue/shared': {
      pkg: '@vue/shared',
      version: versions.vue,
      path: '/dist/shared.esm-bundler.js',
    },
    'antdv-next': {
      pkg: 'antdv-next',
      version: versions.antdvNext,
      path: './antd.esm.js',
      // path: '/dist/antd.esm.js', // TODO: 待 antdv-next 组件库添加
    },
    '@antdv-next/icons': {
      pkg: '@antdv-next/icons',
      version: 'latest',
      path: './antdv-next-icons.es.js', // TODO: 待 antdv-next-icons 库添加
    },
  };

  return {
    imports: Object.fromEntries(
      Object.entries(deps).map(([key, dep]) => [
        key,
        genCdnLink(dep.pkg, dep.version, dep.path),
      ]),
    ),
  };
}

export function genAntdvStyleLink(version: string) {
  return genCdnLink(
    'antdv-next',
    version,
    Number(version[0]) > 3 ? '/dist/reset.css' : '/dist/antd.css', // TODO: 待调整
  );
}

export function getVersions(pkg: MaybeRef<string>) {
  const url = computed(
    () => `https://data.jsdelivr.com/v1/package/npm/${unref(pkg)}`,
  );
  return useFetch(url, {
    initialData: [],
    afterFetch: (ctx) => {
      ctx.data = ctx.data.versions;
      return ctx;
    },
    refetch: true,
  }).json<string[]>().data as Ref<string[]>;
}

export function getSupportedVueVersions() {
  const versions = getVersions('vue');
  return computed(() =>
    versions.value.filter(version => !/alpha|rc|beta/.test(version) && gte(version, '3.5.0')),
  );
}

export function getSupportedTSVersions() {
  const versions = getVersions('typescript');
  return computed(() =>
    versions.value.filter(
      version => !/alpha|rc|beta|dev/.test(version) && !version.includes('insiders') && gte(version, '5.0.0'),
    ),
  );
}

export function getSupportedAntdVersions() {
  const versions = getVersions('antdv-next');
  return computed(() => {
    // 3.3.0 之前的 antdv 版本无浏览器原生 ESM 产物，需要过滤 TODO: 待调整
    return versions.value.filter(version => version === '1.0.0' || (!/alpha|rc/.test(version)));
  });
}
