# 组件库 Tailwind CSS 使用指南

## 概述

本组件库现已集成 Tailwind CSS，提供了完整的 utility classes 支持。所有组件中使用的 Tailwind 类都会被自动构建到 CSS 文件中。

## 构建配置

### 文件结构
```
packages/components/
├── tailwind.config.ts          # Tailwind 配置文件
├── src/
│   └── styles.css              # CSS 入口文件
├── dist/
│   └── styles.css              # 构建后的 CSS 文件
└── package.json                # 包含构建脚本
```

### 构建脚本

- `npm run build` - 构建完整的组件库（CSS + JS）
- `npm run build:css` - 仅构建 CSS 文件
- `npm run build:lib` - 仅构建 JS/TS 文件
- `npm run dev:css` - 监听模式构建 CSS

## 使用方法

### 1. 在应用中导入 CSS

```typescript
// 在你的应用入口文件中导入组件库样式
import '@packages/components/styles.css';
```

### 2. 在组件中使用

组件库中的所有组件都已支持 Tailwind CSS，你可以直接使用标准的 Tailwind 类名：

```tsx
import { ProForm, ModalForm } from '@packages/components';

// 组件内部已经使用了 Tailwind classes
<ProForm className="p-4 bg-gray-50">
  {/* 表单内容 */}
</ProForm>

<ModalForm className="w-full max-w-md">
  {/* 模态框内容 */}
</ModalForm>
```

## Tailwind 配置说明

### Content 配置
```typescript
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  // ...
}
```
配置会扫描组件库源码中的所有 TSX/JSX 文件，自动提取使用的 Tailwind 类。

### Safelist 配置
为了确保常用的 utility classes 始终可用，配置了 safelist 包含常用的类：
- 布局类：`flex`, `w-full`, `h-full` 等
- 间距类：`p-4`, `m-2`, `gap-2` 等
- 文字类：`text-sm`, `font-bold` 等
- 颜色类：`bg-white`, `text-gray-900` 等

### 响应式和变体
支持所有 Tailwind 的响应式和变体语法：
```tsx
<div className="md:flex lg:hidden">
  <span className="hover:bg-gray-100 transition-colors">
    Content
  </span>
</div>
```

## 构建输出

构建后的 CSS 文件包含：
1. **Base Layer** - Tailwind 的基础样式重置
2. **Components Layer** - 预留的组件层（可用于 Semi UI）
3. **Utilities Layer** - 所有用到的 utility classes

文件位置：`packages/components/dist/styles.css`

## 开发建议

1. **保持一致性** - 使用 Tailwind 标准类名，避免自定义 CSS
2. **性能优化** - 只有实际使用的类会被包含在构建输出中
3. **响应式设计** - 充分利用 Tailwind 的响应式前缀
4. **开发模式** - 使用 `npm run dev:css` 监听 CSS 变化

## 注意事项

- 组件库的 CSS 构建是独立的，需要在应用中单独导入
- 构建过程会自动处理 CSS 的压缩和优化
- 如需添加新的 utility classes，只需在组件中使用，构建时会自动包含

## 故障排除

如果发现某些 Tailwind 类没有生效：

1. 检查类名是否在 `safelist` 中或是否在组件代码中实际使用
2. 确保已经导入 CSS 文件：`import '@packages/components/styles.css'`
3. 重新构建：`npm run build:css`
4. 检查 Tailwind 配置是否正确