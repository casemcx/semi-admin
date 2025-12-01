# LiquidEther

一个基于 WebGL 的流体动画组件，提供高性能、可交互的流体模拟效果。适用于背景特效、交互式演示等场景。

## 特性

- 🌊 真实的流体物理模拟
- 🖱️ 支持鼠标/触摸交互
- 🎨 可自定义颜色渐变
- ⚡ 基于 WebGL 的高性能渲染
- 🔄 支持自动演示模式
- 📱 响应式设计，自动适配容器大小
- 🎛️ 丰富的物理参数调节
- 👁️ 视口检测，节省性能

## Props

### LiquidEtherProps

| 属性名 | 类型 | 默认值 | 描述 |
|-------|------|--------|------|
| `mouseForce` | `number` | `20` | 鼠标作用力强度 |
| `cursorSize` | `number` | `100` | 光标影响范围大小 |
| `isViscous` | `boolean` | `false` | 是否启用粘性模拟 |
| `viscous` | `number` | `30` | 粘性系数 |
| `iterationsViscous` | `number` | `32` | 粘性迭代次数 |
| `iterationsPoisson` | `number` | `32` | 压力求解迭代次数 |
| `dt` | `number` | `0.014` | 时间步长 |
| `BFECC` | `boolean` | `true` | 是否使用 BFECC 高级对流算法 |
| `resolution` | `number` | `0.5` | 模拟分辨率（0-1） |
| `isBounce` | `boolean` | `false` | 是否启用边界反弹 |
| `colors` | `string[]` | `['#5227FF', '#FF9FFC', '#B19EEF']` | 颜色渐变数组 |
| `style` | `React.CSSProperties` | `{}` | 自定义内联样式 |
| `className` | `string` | `''` | 自定义 CSS 类名 |
| `autoDemo` | `boolean` | `true` | 是否启用自动演示模式 |
| `autoSpeed` | `number` | `0.5` | 自动演示速度 |
| `autoIntensity` | `number` | `2.2` | 自动演示强度 |
| `takeoverDuration` | `number` | `0.25` | 从自动到手动的过渡时间（秒） |
| `autoResumeDelay` | `number` | `1000` | 恢复自动演示的延迟（毫秒） |
| `autoRampDuration` | `number` | `0.6` | 自动演示淡入时间（秒） |

## 使用示例

### 基础用法

```tsx
import { LiquidEther } from '@packages/ui';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <LiquidEther />
    </div>
  );
}
```

### 自定义颜色

```tsx
import { LiquidEther } from '@packages/ui';

function App() {
  return (
    <div style={{ width: '800px', height: '600px' }}>
      <LiquidEther
        colors={['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A']}
      />
    </div>
  );
}
```

### 禁用自动演示

```tsx
import { LiquidEther } from '@packages/ui';

function App() {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <LiquidEther
        autoDemo={false}
        mouseForce={30}
        cursorSize={150}
      />
    </div>
  );
}
```

### 调整物理参数

```tsx
import { LiquidEther } from '@packages/ui';

function App() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <LiquidEther
        isViscous={true}
        viscous={50}
        dt={0.016}
        BFECC={true}
        resolution={0.75}
      />
    </div>
  );
}
```

### 高性能低分辨率

```tsx
import { LiquidEther } from '@packages/ui';

function App() {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <LiquidEther
        resolution={0.25}
        iterationsPoisson={16}
        iterationsViscous={16}
      />
    </div>
  );
}
```

### 作为背景使用

```tsx
import { LiquidEther } from '@packages/ui';

function App() {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
        <LiquidEther
          colors={['#1a1a2e', '#16213e', '#0f3460']}
          autoDemo={true}
          autoSpeed={0.3}
          mouseForce={15}
        />
      </div>
      <div style={{ position: 'relative', zIndex: 1, padding: '2rem' }}>
        <h1>Your Content Here</h1>
      </div>
    </div>
  );
}
```

### 自定义自动演示行为

```tsx
import { LiquidEther } from '@packages/ui';

function App() {
  return (
    <div style={{ width: '100%', height: '600px' }}>
      <LiquidEther
        autoDemo={true}
        autoSpeed={0.8}
        autoIntensity={3.0}
        autoResumeDelay={2000}
        takeoverDuration={0.5}
        autoRampDuration={1.0}
      />
    </div>
  );
}
```

## 样式定制

```tsx
<LiquidEther
  className="rounded-lg shadow-xl"
  style={{
    border: '2px solid rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)'
  }}
/>
```

## 注意事项

1. **容器尺寸**：组件会填充父容器的 100% 宽高，确保父容器有明确的尺寸
2. **WebGL 支持**：需要浏览器支持 WebGL，建议做好降级处理
3. **性能考虑**：
   - 降低 `resolution` 可以提高性能
   - 减少 `iterationsPoisson` 和 `iterationsViscous` 可以提高帧率
   - 在移动设备上建议使用较低的分辨率（0.25-0.5）
4. **Three.js 依赖**：组件依赖 `three` 库，确保项目中已安装
5. **内存管理**：组件在卸载时会自动清理 WebGL 资源
6. **透明背景**：默认背景透明，可以叠加在其他内容上
7. **自动暂停**：当页面不可见或组件离开视口时，自动暂停渲染以节省性能

## 性能优化建议

### 移动设备优化
```tsx
<LiquidEther
  resolution={0.25}
  iterationsPoisson={16}
  iterationsViscous={16}
  cursorSize={80}
/>
```

### 高质量桌面体验
```tsx
<LiquidEther
  resolution={0.75}
  iterationsPoisson={32}
  iterationsViscous={32}
  BFECC={true}
  isViscous={true}
/>
```

### 响应式配置
```tsx
import { LiquidEther } from '@packages/ui';
import { useEffect, useState } from 'react';

function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <LiquidEther
      resolution={isMobile ? 0.25 : 0.5}
      iterationsPoisson={isMobile ? 16 : 32}
      mouseForce={isMobile ? 15 : 20}
    />
  );
}
```

## 技术实现

- 使用 Navier-Stokes 方程模拟流体动力学
- 基于 Three.js 进行 WebGL 渲染
- 使用 FBO（Frame Buffer Object）进行高效的 GPU 计算
- 支持 BFECC（Back and Forth Error Compensation and Correction）算法提高精度
- 使用 Poisson 方程求解器确保不可压缩性
- Intersection Observer 和 Resize Observer 实现智能资源管理

## 浏览器兼容性

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- 需要 WebGL 支持
- 建议使用硬件加速
