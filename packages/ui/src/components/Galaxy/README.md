# Galaxy

一个基于 WebGL 的星系粒子效果组件，创造出绚丽的星空和星云效果。适用于背景装饰、科技主题页面等场景。

## 特性

- ⭐ 真实的星系粒子效果
- 🖱️ 支持鼠标交互（吸引/排斥）
- 🎨 可自定义颜色、密度、速度等参数
- ✨ 闪烁动画效果
- 🔄 可自定义旋转和焦点位置
- 🌈 色调偏移和饱和度调节
- 🎛️ 丰富的视觉参数配置
- 📱 响应式自适应

## Props

### GalaxyProps

| 属性名 | 类型 | 默认值 | 描述 |
|-------|------|--------|------|
| `focal` | `[number, number]` | `[0.5, 0.5]` | 星系焦点位置 (x, y)，范围 0-1 |
| `rotation` | `[number, number]` | `[1.0, 0.0]` | 星系旋转方向 (x, y) |
| `starSpeed` | `number` | `0.5` | 星星移动速度 |
| `density` | `number` | `1` | 星星密度倍数 |
| `hueShift` | `number` | `140` | 色调偏移值（0-360） |
| `disableAnimation` | `boolean` | `false` | 是否禁用动画 |
| `speed` | `number` | `1.0` | 整体动画速度倍数 |
| `mouseInteraction` | `boolean` | `true` | 是否启用鼠标交互 |
| `glowIntensity` | `number` | `0.3` | 发光强度（0-1） |
| `saturation` | `number` | `0.0` | 饱和度调节（-1 到 1） |
| `mouseRepulsion` | `boolean` | `true` | 鼠标排斥效果（false 为吸引） |
| `twinkleIntensity` | `number` | `0.3` | 闪烁强度（0-1） |
| `rotationSpeed` | `number` | `0.1` | 旋转速度 |
| `repulsionStrength` | `number` | `2` | 排斥/吸引力强度 |
| `autoCenterRepulsion` | `number` | `0` | 自动中心排斥力 |
| `transparent` | `boolean` | `true` | 背景是否透明 |
| `className` | `string` | - | 自定义 CSS 类名 |

## 使用示例

### 基础用法

```tsx
import { Galaxy } from '@packages/ui';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Galaxy />
    </div>
  );
}
```

### 自定义焦点和旋转

```tsx
import { Galaxy } from '@packages/ui';

function App() {
  return (
    <div style={{ width: '100%', height: '800px' }}>
      <Galaxy
        focal={[0.3, 0.7]}
        rotation={[0.8, 0.6]}
        rotationSpeed={0.2}
      />
    </div>
  );
}
```

### 调整颜色和密度

```tsx
import { Galaxy } from '@packages/ui';

function App() {
  return (
    <div style={{ width: '100%', height: '600px' }}>
      <Galaxy
        hueShift={200}
        saturation={0.5}
        density={1.5}
        glowIntensity={0.5}
      />
    </div>
  );
}
```

### 快速移动的星系

```tsx
import { Galaxy } from '@packages/ui';

function App() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Galaxy
        starSpeed={2.0}
        speed={1.5}
        density={2}
        twinkleIntensity={0.5}
      />
    </div>
  );
}
```

### 鼠标吸引效果

```tsx
import { Galaxy } from '@packages/ui';

function App() {
  return (
    <div style={{ width: '100%', height: '700px' }}>
      <Galaxy
        mouseRepulsion={false}
        repulsionStrength={3}
        mouseInteraction={true}
      />
    </div>
  );
}
```

### 静态星空背景

```tsx
import { Galaxy } from '@packages/ui';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Galaxy
        disableAnimation={true}
        mouseInteraction={false}
        density={1.5}
        hueShift={180}
      />
    </div>
  );
}
```

### 不透明背景

```tsx
import { Galaxy } from '@packages/ui';

function App() {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Galaxy
        transparent={false}
        hueShift={280}
        glowIntensity={0.6}
      />
    </div>
  );
}
```

### 作为页面背景

```tsx
import { Galaxy } from '@packages/ui';

function App() {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Galaxy
        className="fixed inset-0 -z-10"
        hueShift={160}
        density={1.2}
        starSpeed={0.3}
        mouseRepulsion={true}
        repulsionStrength={2.5}
      />
      <div className="relative z-10 p-8">
        <h1 className="text-4xl text-white">Your Content</h1>
      </div>
    </div>
  );
}
```

### 中心辐射效果

```tsx
import { Galaxy } from '@packages/ui';

function App() {
  return (
    <div style={{ width: '100%', height: '600px' }}>
      <Galaxy
        focal={[0.5, 0.5]}
        autoCenterRepulsion={1.5}
        density={2}
        rotationSpeed={0.15}
      />
    </div>
  );
}
```

## 颜色主题示例

### 蓝色星系
```tsx
<Galaxy hueShift={200} saturation={0.3} glowIntensity={0.4} />
```

### 紫色星云
```tsx
<Galaxy hueShift={280} saturation={0.5} glowIntensity={0.5} />
```

### 橙红色星系
```tsx
<Galaxy hueShift={20} saturation={0.6} glowIntensity={0.3} />
```

### 绿色极光
```tsx
<Galaxy hueShift={140} saturation={0.8} glowIntensity={0.6} />
```

## 样式定制

```tsx
<Galaxy
  className="rounded-xl shadow-2xl overflow-hidden"
  style={{
    border: '1px solid rgba(255,255,255,0.1)',
  }}
/>
```

## 注意事项

1. **容器尺寸**：组件会填充父容器的 100% 宽高，确保父容器有明确的尺寸
2. **WebGL 支持**：需要浏览器支持 WebGL，建议提供降级方案
3. **性能考虑**：
   - 高 `density` 值会显著影响性能
   - 建议在移动设备上使用较低的密度（0.5-1.0）
   - 禁用 `mouseInteraction` 可以提高性能
4. **OGL 依赖**：组件依赖 `ogl` 库，确保项目中已安装
5. **GLSL 着色器**：组件使用自定义着色器文件（vertex.glsl 和 fragment.glsl）
6. **内存管理**：组件在卸载时会自动清理 WebGL 资源
7. **响应式**：组件会监听窗口 resize 事件自动调整渲染尺寸

## 性能优化建议

### 移动设备优化
```tsx
<Galaxy
  density={0.7}
  mouseInteraction={false}
  disableAnimation={false}
  twinkleIntensity={0.2}
/>
```

### 高性能桌面体验
```tsx
<Galaxy
  density={2.0}
  mouseInteraction={true}
  twinkleIntensity={0.5}
  glowIntensity={0.5}
  repulsionStrength={3}
/>
```

### 静态装饰（最佳性能）
```tsx
<Galaxy
  disableAnimation={true}
  mouseInteraction={false}
  density={1.0}
/>
```

## 技术实现

- 基于 OGL（轻量级 WebGL 库）进行渲染
- 使用 GLSL 着色器实现粒子效果
- 三角形几何体覆盖全屏
- 实时计算鼠标交互影响
- 使用 `requestAnimationFrame` 驱动动画循环
- 响应式 Resize Observer 自动适配

## 交互说明

- **鼠标移动**：当 `mouseInteraction` 为 `true` 时，星星会响应鼠标位置
- **排斥模式**：`mouseRepulsion=true` 时，星星会远离光标
- **吸引模式**：`mouseRepulsion=false` 时，星星会靠近光标
- **交互强度**：通过 `repulsionStrength` 调节交互效果的强度

## 浏览器兼容性

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- 需要 WebGL 支持
- 建议使用硬件加速
