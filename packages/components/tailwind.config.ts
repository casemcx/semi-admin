import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  prefix: '',
  important: false,
  safelist: [
    // 常用的布局类
    'flex', 'inline-flex', 'block', 'inline-block', 'hidden',
    'w-full', 'w-1/2', 'w-1/3', 'w-2/3', 'w-1/4', 'w-3/4',
    'h-full', 'h-auto', 'h-1/2', 'h-screen',
    'p-1', 'p-2', 'p-3', 'p-4', 'p-6', 'p-8',
    'px-1', 'px-2', 'px-3', 'px-4', 'px-6', 'px-8',
    'py-1', 'py-2', 'py-3', 'py-4', 'py-6', 'py-8',
    'm-1', 'm-2', 'm-3', 'm-4', 'm-6', 'm-8',
    'mt-1', 'mt-2', 'mt-3', 'mt-4', 'mt-6', 'mt-8',
    'mb-1', 'mb-2', 'mb-3', 'mb-4', 'mb-6', 'mb-8',
    'ml-1', 'ml-2', 'ml-3', 'ml-4', 'ml-6', 'ml-8',
    'mr-1', 'mr-2', 'mr-3', 'mr-4', 'mr-6', 'mr-8',
    'gap-1', 'gap-2', 'gap-3', 'gap-4', 'gap-6', 'gap-8',
    'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl',
    'font-bold', 'font-semibold', 'font-medium', 'font-normal',
    'text-left', 'text-center', 'text-right',
    'items-center', 'items-start', 'items-end',
    'justify-center', 'justify-start', 'justify-end', 'justify-between',
    'rounded', 'rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-full',
    'border', 'border-t', 'border-b', 'border-l', 'border-r',
    'bg-gray-50', 'bg-white', 'bg-black',
    'text-gray-900', 'text-gray-800', 'text-gray-700', 'text-gray-600', 'text-gray-500',
    'overflow-hidden', 'overflow-auto', 'overflow-scroll',
    'cursor-pointer', 'cursor-default',
    'object-cover', 'object-contain', 'object-fill',
  ],
} satisfies Config;