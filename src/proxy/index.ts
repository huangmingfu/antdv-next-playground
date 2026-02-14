// 仅用于在开发模式下调试
export const devDepsProxy = {
  'antdv-next': `${location.origin}/src/proxy/antdv-dev-proxy`,
  '@antdv-next/icons': `${location.origin}/src/proxy/antdv-icons-dev-proxy`,
  '@vue/runtime-dom': `${location.origin}/src/proxy/vue-dev-proxy`,
  '@vue/compiler-sfc': `${location.origin}/src/proxy/vue-sfc-dev-proxy`,
  '@vue/shared': `${location.origin}/src/proxy/vue-shared-dev-proxy`,
} as Record<string, string>;
