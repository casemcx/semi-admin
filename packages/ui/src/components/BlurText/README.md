# BlurText

一个优雅的模糊文字动画组件，支持单词或字母级别的动画效果，适用于页面加载、内容展示等场景。

## 特性

- 🎨 支持自定义动画方向（从上/从下）
- 📝 支持按单词或字母进行动画
- ⚙️ 高度可定制的动画参数
- 🎯 基于 Intersection Observer 的视口检测
- 🔄 支持自定义动画关键帧
- 🎭 平滑的模糊渐变效果

## Props

### BlurTextProps

| 属性名 | 类型 | 默认值 | 描述 |
|-------|------|--------|------|
| `text` | `string` | `''` | 要显示的文本内容 |
| `delay` | `number` | `200` | 每个元素之间的延迟时间（毫秒） |
| `className` | `string` | `''` | 自定义 CSS 类名 |
| `animateBy` | `'words' \| 'letters'` | `'words'` | 动画单位：按单词或字母 |
| `direction` | `'top' \| 'bottom'` | `'top'` | 动画方向 |
| `threshold` | `number` | `0.1` | Intersection Observer 的触发阈值 |
| `rootMargin` | `string` | `'0px'` | Intersection Observer 的根边距 |
| `animationFrom` | `Record<string, string \| number>` | - | 自定义起始动画状态 |
| `animationTo` | `Array<Record<string, string \| number>>` | - | 自定义结束动画状态数组 |
| `easing` | `Easing \| Easing[]` | `(t) => t` | 动画缓动函数 |
| `onAnimationComplete` | `() => void` | - | 动画完成回调 |
| `stepDuration` | `number` | `0.35` | 每个动画步骤的持续时间（秒） |

## 使用示例

### 基础用法

```tsx
import { BlurText } from '@packages/ui';

function App() {
  return (
    <BlurText text="Hello World" />
  );
}
```

### 按字母动画

```tsx
import { BlurText } from '@packages/ui';

function App() {
  return (
    <BlurText
      text="Welcome to our website"
      animateBy="letters"
      delay={50}
    />
  );
}
```

### 从底部向上动画

```tsx
import { BlurText } from '@packages/ui';

function App() {
  return (
    <BlurText
      text="Slide up text"
      direction="bottom"
      delay={150}
    />
  );
}
```

### 自定义动画效果

```tsx
import { BlurText } from '@packages/ui';

function App() {
  return (
    <BlurText
      text="Custom animation"
      animationFrom={{
        filter: 'blur(20px)',
        opacity: 0,
        y: -100,
        scale: 0.8
      }}
      animationTo={[
        {
          filter: 'blur(10px)',
          opacity: 0.5,
          y: -20,
          scale: 0.9
        },
        {
          filter: 'blur(0px)',
          opacity: 1,
          y: 0,
          scale: 1
        }
      ]}
      easing="easeOut"
      stepDuration={0.5}
    />
  );
}
```

### 带回调的用法

```tsx
import { BlurText } from '@packages/ui';
import { useState } from 'react';

function App() {
  const [completed, setCompleted] = useState(false);

  return (
    <BlurText
      text="Animated text"
      onAnimationComplete={() => {
        console.log('Animation completed!');
        setCompleted(true);
      }}
    />
  );
}
```

### 调整视口触发时机

```tsx
import { BlurText } from '@packages/ui';

function App() {
  return (
    <BlurText
      text="Trigger earlier"
      threshold={0.3}
      rootMargin="100px"
    />
  );
}
```

## 样式定制

组件使用 Tailwind CSS 类名，你可以通过 `className` 属性添加自定义样式：

```tsx
<BlurText
  text="Styled text"
  className="text-4xl font-bold text-blue-500"
/>
```

## 注意事项

1. 组件依赖 `motion/react`，确保项目中已安装该依赖
2. 使用 Intersection Observer API，不支持的浏览器需要 polyfill
3. 动画仅在元素进入视口时触发一次
4. 默认使用 `flex flex-wrap` 布局，注意容器宽度设置
5. 长文本建议使用 `animateBy="words"` 以获得更好的性能
6. 自定义动画关键帧时，确保 `animationTo` 数组长度至少为 1

## 性能优化建议

- 对于长文本，使用较大的 `delay` 值避免同时渲染过多动画
- 使用 `threshold` 和 `rootMargin` 控制动画触发时机
- 避免在同一页面使用过多 BlurText 组件
- 考虑使用 `React.memo` 包裹组件以避免不必要的重渲染

## 技术实现

- 使用 `motion.span` 实现平滑动画
- 通过 Intersection Observer 检测元素可见性
- 支持多步骤关键帧动画
- 使用 `will-change` CSS 属性优化性能
