# 工具集管理 (Tools Management)

这是一个统一管理的工具集，目前提供图片上传、裁剪、压缩等功能。

## 功能特性

- ✅ **图片上传**: 支持多种图片格式，可配置文件大小限制
- ✅ **图片裁剪**: 使用 @napi-rs/image 进行高性能裁剪
- ✅ **图片压缩**: 支持质量调节，自动计算压缩比例
- ✅ **统一管理**: 使用工具管理器统一管理各种工具
- ✅ **TypeScript**: 完整的类型定义支持
- ✅ **React Hook**: 提供便捷的 Hook 接口

## 安装依赖

在使用前，请确保安装了必要的依赖：

```bash
npm install @napi-rs/image
# 或
pnpm add @napi-rs/image
```

## 快速开始

### 1. 初始化工具集

在应用启动时初始化工具集：

```typescript
// 在应用的入口文件（如 main.tsx 或 App.tsx）中
import { initializeTools } from '@/utils/tools';

// 初始化工具集
initializeTools();
```

### 2. 使用 React Hook

在组件中使用 `useImageTool` Hook：

```typescript
import React from 'react';
import { useImageTool } from '@/hooks/useImageTool';

const MyComponent = () => {
  const {
    loading,
    error,
    result,
    progress,
    handleProcessImage,
    handleUploadImage,
    handleCropImage,
    handleCompressImage,
    reset,
    clearError,
  } = useImageTool();

  const handleFileChange = async (file: File) => {
    // 完整的图片处理流程：上传 -> 裁剪 -> 压缩
    await handleProcessImage(
      file,
      { x: 0, y: 0, width: 200, height: 200 }, // 裁剪配置
      { maxSize: 5 * 1024 * 1024 }, // 上传配置
      0.8 // 压缩质量
    );
  };

  return (
    <div>
      {/* 你的UI组件 */}
    </div>
  );
};
```

### 3. 使用现成的组件

直接使用 `ImageUpload` 组件：

```typescript
import React from 'react';
import { ImageUpload } from '@/components/tools/ImageUpload';

const MyPage = () => {
  const handleSuccess = (result) => {
    console.log('处理成功:', result);
  };

  const handleError = (error) => {
    console.error('处理失败:', error);
  };

  return (
    <ImageUpload
      showCrop={true}
      showCompress={true}
      defaultQuality={0.8}
      uploadConfig={{
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['image/jpeg', 'image/png'],
      }}
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
};
```

### 4. 直接使用 API

如果需要更细粒度的控制，可以直接使用 API 函数：

```typescript
import {
  uploadImage,
  cropImage,
  compressImage,
  processImage,
} from '@/utils/tools';

// 上传图片
const uploadResult = await uploadImage(file, {
  maxSize: 5 * 1024 * 1024,
  compressionQuality: 0.8,
});

// 裁剪图片
const cropResult = await cropImage(file, {
  x: 10,
  y: 10,
  width: 200,
  height: 200,
});

// 压缩图片
const compressResult = await compressImage(file, 0.8);

// 完整处理流程
const processResult = await processImage(
  file,
  cropConfig,
  uploadConfig,
  quality
);
```

## API 文档

### IImageToolConfig

图片工具配置接口：

```typescript
interface IImageToolConfig {
  maxSize?: number;              // 最大文件大小（字节）
  allowedTypes?: string[];       // 允许的文件类型
  compressionQuality?: number;   // 压缩质量（0-1）
  outputFormat?: 'jpeg' | 'png' | 'webp'; // 输出格式
}
```

### ICropConfig

图片裁剪配置接口：

```typescript
interface ICropConfig {
  x: number;      // 裁剪起始X坐标
  y: number;      // 裁剪起始Y坐标
  width: number;  // 裁剪宽度
  height: number; // 裁剪高度
}
```

### IImageProcessResult

图片处理结果接口：

```typescript
interface IImageProcessResult {
  originalFile: File;      // 原始文件
  processedFile: File;     // 处理后的文件
  originalSize: number;    // 原始文件大小
  compressedSize: number;  // 压缩后文件大小
  compressionRatio: number; // 压缩比例
  dimensions: {            // 图片尺寸信息
    width: number;
    height: number;
  };
}
```

## 工具管理器

### 注册新工具

```typescript
import { ToolManager } from '@/utils/tools';

const toolManager = ToolManager.getInstance();

// 注册新工具
toolManager.registerTool('myTool', new MyTool());

// 获取工具
const myTool = toolManager.getTool('myTool');

// 列出所有工具
const tools = toolManager.listTools();
```

## 文件结构

```
src/
├── types/
│   └── tools/
│       └── index.ts           # 工具相关类型定义
├── utils/
│   └── tools/
│       ├── index.ts          # 工具统一导出
│       ├── ImageTool.ts      # 图片工具类
│       ├── ToolManager.ts    # 工具管理器
│       └── README.md         # 文档
├── api/
│   └── tools/
│       └── index.ts          # 工具API接口
├── hooks/
│   └── useImageTool.ts       # React Hook
└── components/
    └── tools/
        └── ImageUpload/
            └── index.tsx     # 图片上传组件
```

## 使用流程

1. **初始化**: 在应用启动时调用 `initializeTools()` 初始化工具集
2. **选择图片**: 用户选择要处理的图片文件
3. **配置处理**: 设置裁剪参数、压缩质量等
4. **执行处理**: 调用相应的处理方法
5. **获取结果**: 从处理结果中获取处理后的文件和相关信息

## 注意事项

- 图片处理在浏览器端进行，不会上传到服务器
- 支持的图片格式：JPEG、PNG、WebP、GIF
- 大文件处理可能会影响性能，建议设置合理的文件大小限制
- 裁剪功能需要提供准确的坐标和尺寸信息
- 压缩质量建议设置在 0.1-1.0 之间

## 扩展开发

如果需要添加新的工具，可以按照以下步骤：

1. 在 `src/types/tools/` 中定义新工具的接口
2. 在 `src/utils/tools/` 中实现工具类
3. 在 `src/api/tools/` 中添加API方法
4. 在应用初始化时注册新工具

示例：

```typescript
// 1. 定义接口
interface IMyTool {
  process(input: any): Promise<any>;
}

// 2. 实现工具类
class MyTool implements IMyTool {
  async process(input: any) {
    // 实现逻辑
  }
}

// 3. 注册工具
import { getToolManager } from '@/utils/tools';
getToolManager().registerTool('myTool', new MyTool());
```