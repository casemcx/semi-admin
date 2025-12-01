# SplashCursor

一个基于 WebGL 的流体飞溅效果组件，跟随光标移动创造出炫酷的流体飞溅动画。适用于交互式背景、创意页面装饰等场景。

## 特性

- 🎨 真实的流体动力学模拟
- 🖱️ 跟随鼠标/触摸移动
- 💧 飞溅和扩散效果
- 🌈 动态颜色变化
- ⚙️ 丰富的物理参数配置
- 🎭 可选透明背景
- 📱 支持触摸设备
- ⚡ 基于 WebGL 的高性能渲染

## Props

### SplashCursorProps

| 属性名 | 类型 | 默认值 | 描述 |
|-------|------|--------|------|
| `SIM_RESOLUTION` | `number` | `128` | 模拟分辨率 |
| `DYE_RESOLUTION` | `number` | `1440` | 染料分辨率 |
| `CAPTURE_RESOLUTION` | `number` | `512` | 捕获分辨率 |
| `DENSITY_DISSIPATION` | `number` | `3.5` | 密度消散速度 |
| `VELOCITY_DISSIPATION` | `number` | `2` | 速度消散速度 |
| `PRESSURE` | `number` | `0.1` | 压力系数 |
| `PRESSURE_ITERATIONS` | `number` | `20` | 压力迭代次数 |
| `CURL` | `number` | `3` | 旋度强度 |
| `SPLAT_RADIUS` | `number` | `0.2` | 飞溅半径（0-1） |
| `SPLAT_FORCE` | `number` | `6000` | 飞溅力度 |
| `SHADING` | `boolean` | `true` | 是否启用着色 |
| `COLOR_UPDATE_SPEED` | `number` | `10` | 颜色更新速度 |
| `BACK_COLOR` | `ColorRGB` | `{r: 0.5, g: 0, b: 0}` | 背景颜色（RGB，0-1） |
| `TRANSPARENT` | `boolean` | `true` | 背景是否透明 |

### ColorRGB 类型

```typescript
interface ColorRGB {
  r: number; // 红色通道 (0-1)
  g: number; // 绿色通道 (0-1)
  b: number; // 蓝色通道 (0-1)
}
```

## 使用示例

### 基础用法

```tsx
import { SplashCursor } from '@packages/ui';

function App() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1 }}>
      <SplashCursor />
    </div>
  );
}
```

### 调整飞溅效果

```tsx
import { SplashCursor } from '@packages/ui';

function App() {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <SplashCursor
        SPLAT_RADIUS={0.3}
        SPLAT_FORCE={8000}
        CURL={5}
      />
    </div>
  );
}
```

### 慢速消散效果

```tsx
import { SplashCursor } from '@packages/ui';

function App() {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <SplashCursor
        DENSITY_DISSIPATION={1.5}
        VELOCITY_DISSIPATION={0.8}
      />
    </div>
  );
}
```

### 快速消散效果

```tsx
import { SplashCursor } from '@packages/ui';

function App() {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <SplashCursor
        DENSITY_DISSIPATION={5}
        VELOCITY_DISSIPATION={3}
      />
    </div>
  );
}
```

### 自定义背景颜色

```tsx
import { SplashCursor } from '@packages/ui';

function App() {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <SplashCursor
        TRANSPARENT={false}
        BACK_COLOR={{ r: 0.1, g: 0.1, b: 0.2 }}
      />
    </div>
  );
}
```

### 高分辨率效果

```tsx
import { SplashCursor } from '@packages/ui';

function App() {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <SplashCursor
        SIM_RESOLUTION={256}
        DYE_RESOLUTION={2048}
        PRESSURE_ITERATIONS={30}
      />
    </div>
  );
}
```

### 低性能模式

```tsx
import { SplashCursor } from '@packages/ui';

function App() {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <SplashCursor
        SIM_RESOLUTION={64}
        DYE_RESOLUTION={512}
        PRESSURE_ITERATIONS={10}
        SHADING={false}
      />
    </div>
  );
}
```

### 作为全屏背景

```tsx
import { SplashCursor } from '@packages/ui';

function App() {
  return (
    <>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none'
      }}>
        <SplashCursor
          TRANSPARENT={true}
          SPLAT_FORCE={7000}
          COLOR_UPDATE_SPEED={15}
        />
      </div>
      <div style={{ position: 'relative', zIndex: 1, padding: '2rem' }}>
        <h1>Your Content Here</h1>
      </div>
    </>
  );
}
```

### 慢动作效果

```tsx
import { SplashCursor } from '@packages/ui';

function App() {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <SplashCursor
        VELOCITY_DISSIPATION={0.5}
        DENSITY_DISSIPATION={0.8}
        PRESSURE={0.05}
      />
    </div>
  );
}
```

### 强烈旋涡效果

```tsx
import { SplashCursor } from '@packages/ui';

function App() {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <SplashCursor
        CURL={10}
        SPLAT_FORCE={9000}
        VELOCITY_DISSIPATION={1}
      />
    </div>
  );
}
```

## 效果预设

### 平滑柔和
```tsx
<SplashCursor
  SPLAT_RADIUS={0.25}
  SPLAT_FORCE={5000}
  DENSITY_DISSIPATION={2}
  VELOCITY_DISSIPATION={1.5}
  CURL={2}
/>
```

### 爆炸效果
```tsx
<SplashCursor
  SPLAT_RADIUS={0.4}
  SPLAT_FORCE={10000}
  DENSITY_DISSIPATION={4}
  VELOCITY_DISSIPATION={3}
  CURL={5}
/>
```

### 细腻轨迹
```tsx
<SplashCursor
  SPLAT_RADIUS={0.1}
  SPLAT_FORCE={4000}
  DENSITY_DISSIPATION={1}
  VELOCITY_DISSIPATION={0.5}
  CURL={1}
/>
```

### 烟雾效果
```tsx
<SplashCursor
  DENSITY_DISSIPATION={1.5}
  VELOCITY_DISSIPATION={0.8}
  PRESSURE={0.05}
  CURL={4}
  SHADING={false}
/>
```

## 注意事项

1. **WebGL 支持**：需要浏览器支持 WebGL，建议提供降级方案
2. **性能考虑**：
   - `SIM_RESOLUTION` 和 `DYE_RESOLUTION` 直接影响性能
   - 移动设备建议降低分辨率参数
   - `PRESSURE_ITERATIONS` 越高，计算越精确但性能消耗越大
3. **Canvas 全屏**：组件使用 canvas 元素，建议使用 `position: fixed` 或 `position: absolute` 定位
4. **颜色值范围**：`BACK_COLOR` 的 RGB 值范围是 0-1，而非 0-255
5. **指针事件**：作为背景使用时，设置 `pointerEvents: 'none'` 避免阻挡点击
6. **内存管理**：组件在卸载时会自动清理 WebGL 资源
7. **触摸支持**：完全支持触摸设备的单点触摸操作

## 性能优化建议

### 移动设备优化
```tsx
<SplashCursor
  SIM_RESOLUTION={64}
  DYE_RESOLUTION={512}
  PRESSURE_ITERATIONS={10}
  SHADING={false}
/>
```

### 高性能桌面体验
```tsx
<SplashCursor
  SIM_RESOLUTION={256}
  DYE_RESOLUTION={2048}
  PRESSURE_ITERATIONS={25}
  SHADING={true}
/>
```

### 响应式配置
```tsx
import { SplashCursor } from '@packages/ui';
import { useEffect, useState } from 'react';

function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <SplashCursor
        SIM_RESOLUTION={isMobile ? 64 : 128}
        DYE_RESOLUTION={isMobile ? 512 : 1440}
        PRESSURE_ITERATIONS={isMobile ? 10 : 20}
        SHADING={!isMobile}
      />
    </div>
  );
}
```

## 参数调节指南

### 飞溅大小和力度
- 增大 `SPLAT_RADIUS`：飞溅范围更大
- 增大 `SPLAT_FORCE`：飞溅力度更强，轨迹更长

### 消散速度
- 增大 `DENSITY_DISSIPATION`：颜色消失更快
- 增大 `VELOCITY_DISSIPATION`：运动停止更快

### 流体效果
- 增大 `CURL`：更强的旋涡效果
- 增大 `PRESSURE`：流体更"硬"，边界更清晰
- 增大 `PRESSURE_ITERATIONS`：压力计算更精确

### 视觉质量
- 增大 `SIM_RESOLUTION`：物理模拟更精细
- 增大 `DYE_RESOLUTION`：视觉效果更细腻
- 启用 `SHADING`：添加光照效果

## 技术实现

- 基于 WebGL 实现实时流体动力学模拟
- 使用 Navier-Stokes 方程求解流体运动
- 多重渲染目标（MRT）技术提高效率
- Poisson 方程求解器处理压力场
- 双线性插值实现平滑过渡
- 自动检测设备能力并调整参数

## 浏览器兼容性

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- 需要 WebGL 支持
- 建议使用硬件加速
- 部分移动设备可能需要降低分辨率参数

## 常见问题

**Q: 为什么飞溅效果不明显？**
A: 尝试增大 `SPLAT_FORCE` 和 `SPLAT_RADIUS` 参数。

**Q: 如何让效果持续时间更长？**
A: 减小 `DENSITY_DISSIPATION` 和 `VELOCITY_DISSIPATION` 参数。

**Q: 性能不佳怎么办？**
A: 降低 `SIM_RESOLUTION`、`DYE_RESOLUTION` 和 `PRESSURE_ITERATIONS` 参数。

**Q: 颜色不够鲜艳？**
A: 增大 `COLOR_UPDATE_SPEED` 或调整 `SHADING` 参数。
