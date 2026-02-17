import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import VueRouter from 'unplugin-vue-router/vite';
import Components from 'unplugin-vue-components/vite';
import { HeadlessUiResolver } from 'unplugin-vue-components/resolvers';
import { VueRouterAutoImports } from 'unplugin-vue-router';
import svgLoader from 'vite-svg-loader';
import { v4 as uuidv4 } from 'uuid';
import tailwindcss from '@tailwindcss/vite';
import topLevelAwait from 'vite-plugin-top-level-await';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the
  // `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    build: {
      target: 'esnext',
    },
    plugins: [
      topLevelAwait(),
      VueRouter({ importMode: 'sync', dts: './typed-router.d.ts' }),
      vue(),
      tailwindcss(),
      Components({
        resolvers: [HeadlessUiResolver()],
        dirs: ['resources/js/shared/components/**', 'src/components/**'],
        dts: true,
      }),
      svgLoader({
        svgoConfig: {
          plugins: [
            {
              name: 'prefixIds',
              params: {
                prefix: uuidv4().split('-')[0],
              },
            },
          ],
        },
      }),
      AutoImport({
        imports: ['vue', 'vue-i18n', '@vueuse/core', VueRouterAutoImports],
        dirs: [
          'src/utils/*i18n.js',
          'src/utils/*Shortcut.js',
          'src/utils/use*.js',
          'resources/js/shared/use/*.js',
          'src/composables/**/*.js',
        ],
        dts: true,
        eslintrc: {
          enabled: true,
          filepath: './eslintrc-auto-import.js',
        },
      }),
    ],
    server: {
      port: env.VITE_PORT || 5174,
      host: '0.0.0.0',
      allowedHosts: true,
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        // Change this line:
        'Cross-Origin-Embedder-Policy': 'credentialless',
      },
    },

    resolve: {
      alias: {
        '@root': fileURLToPath(new URL('./src', import.meta.url)),
        '@shared': fileURLToPath(new URL('./resources/js/shared', import.meta.url)),
        '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
        '@svgs': fileURLToPath(new URL('./src/svgs', import.meta.url)),
        '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@composables': fileURLToPath(new URL('./src/composables', import.meta.url)),
      },
    },
  };
});
