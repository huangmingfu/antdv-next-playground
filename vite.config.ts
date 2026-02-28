import path from 'node:path';
import process from 'node:process';
import { AntdvNextResolver } from '@antdv-next/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Unocss from 'unocss/vite';
import Components from 'unplugin-vue-components/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    base: './',
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, 'src'),
      },
    },
    plugins: [
      vue(),
      vueJsx(),
      Unocss(),
      Components({
        resolvers: [AntdvNextResolver()],
      }),
    ],
    server: {
      // open: true,
      host: '0.0.0.0',
      port: Number(env.VITE_APP_PORT),
    },
    build: {
      target: 'esnext',
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
        external: ['typescript'],
      },
    },
    optimizeDeps: {
      exclude: ['@vue/repl'],
    },
  };
});
