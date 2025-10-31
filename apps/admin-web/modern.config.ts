import { SemiRspackPlugin } from '@douyinfe/semi-rspack-plugin';
import { appTools, defineConfig } from '@modern-js/app-tools';
import { polyfillPlugin } from '@modern-js/plugin-polyfill';
import { tailwindcssPlugin } from '@modern-js/plugin-tailwindcss';
import { pluginGlsl } from 'rsbuild-plugin-glsl';
import AutoImport from 'unplugin-auto-import/rspack';

export const define = Object.keys(process.env)
  .filter(key => key.startsWith('PUBLIC_'))
  .reduce(
    (acc, key) => {
      if (process.env[key]) {
        acc[`process.env.${key}`] = process.env[key];
      }
      return acc;
    },
    {} as Record<string, string>,
  );

// https://modernjs.dev/en/configure/app/usage
export default defineConfig({
  runtime: {
    router: true,
  },
  source: {
    // 定义环境变量，使其在客户端代码中可用
    define,
  },
  tools: {
    rspack: {
      plugins: [
        AutoImport({
          imports: ['react', 'ahooks'],
          dirs: ['./src/configs', './src/utils', './src/hooks'],
          dts: './types/auto-imports.d.ts',
        }),
        new SemiRspackPlugin({
          cssLayer: true,
        }),
      ],
    },
  },
  output: {
    polyfill: 'ua',
    sourceMap: true,
  },
  plugins: [
    tailwindcssPlugin(),
    pluginGlsl(),
    appTools({
      bundler: 'rspack', // Set to 'webpack' to enable webpack
    }),
    polyfillPlugin(),
  ],
});
