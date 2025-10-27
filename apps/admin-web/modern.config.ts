import { SemiRspackPlugin } from '@douyinfe/semi-rspack-plugin';
import { appTools, defineConfig } from '@modern-js/app-tools';
import { tailwindcssPlugin } from '@modern-js/plugin-tailwindcss';
import AutoImport from 'unplugin-auto-import/rspack';

// https://modernjs.dev/en/configure/app/usage
export default defineConfig({
  runtime: {
    router: true,
  },
  tools: {
    rspack: {
      plugins: [
        AutoImport({
          imports: ['react', 'ahooks'],
          dirs: [
            './src/configs',
            './src/utils',
            './src/hooks',
            './src/components',
          ],
          dts: './types/auto-imports.d.ts',
        }),
        new SemiRspackPlugin({
          cssLayer: true,
        }),
      ],
    },
  },
  plugins: [
    tailwindcssPlugin(),
    appTools({
      bundler: 'rspack', // Set to 'webpack' to enable webpack
    }),
  ],
});
