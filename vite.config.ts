import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import UnoCSS from 'unocss/vite';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

const envDir = fileURLToPath(new URL('env', import.meta.url));
const iconDirs = [fileURLToPath(new URL('src/assets/icons', import.meta.url))];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const { VITE_PUBLIC_PATH } = loadEnv(mode, envDir);

  return {
    base: VITE_PUBLIC_PATH,
    envDir,
    plugins: [
      vue({
        script: {
          defineModel: true
        }
      }),
      vueJsx(),
      UnoCSS(),
      AutoImport({
        dts: './types/auto-imports.d.ts',
        imports: [
          'vue',
          'vue-router',
          {
            'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar']
          }
        ]
      }),
      Components({
        dts: './types/components.d.ts',
        resolvers: [NaiveUiResolver()]
      }),
      createSvgIconsPlugin({
        iconDirs,
        symbolId: 'icon-[dir]-[name]'
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            naive: ['naive-ui']
          }
        }
      }
    }
  };
});
