import type {
  ICropConfig,
  IImageProcessResult,
  IImageTool,
  IImageToolConfig,
  IToolResult,
} from '@/types/tools';
import { ImageTool } from '@/utils/tools/ImageTool';
import { ToolManager } from '@/utils/tools/ToolManager';

/** 工具管理器实例 */
const toolManager = ToolManager.getInstance();

/**
 * @description 初始化工具集
 */
export const initializeTools = (): void => {
  // 注册图片工具
  toolManager.registerTool('image', new ImageTool());
  console.log('工具集初始化完成');
};

/**
 * @description 获取图片工具
 * @returns 图片工具实例
 */
export const getImageTool = (): IImageTool | null => {
  return toolManager.getTool<IImageTool>('image');
};

/**
 * @description 上传并处理图片
 * @param file 图片文件
 * @param config 配置选项
 * @returns 处理结果
 */
export const uploadImage = async (
  file: File,
  config?: IImageToolConfig,
): Promise<IToolResult<IImageProcessResult>> => {
  const imageTool = getImageTool();
  if (!imageTool) {
    return {
      success: false,
      error: '图片工具未初始化',
    };
  }
  return imageTool.upload(file, config);
};

/**
 * @description 裁剪图片
 * @param file 图片文件
 * @param cropConfig 裁剪配置
 * @returns 裁剪结果
 */
export const cropImage = async (
  file: File,
  cropConfig: ICropConfig,
): Promise<IToolResult<File>> => {
  const imageTool = getImageTool();
  if (!imageTool) {
    return {
      success: false,
      error: '图片工具未初始化',
    };
  }
  return imageTool.crop(file, cropConfig);
};

/**
 * @description 压缩图片
 * @param file 图片文件
 * @param quality 压缩质量
 * @returns 压缩结果
 */
export const compressImage = async (
  file: File,
  quality = 0.8,
): Promise<IToolResult<File>> => {
  const imageTool = getImageTool();
  if (!imageTool) {
    return {
      success: false,
      error: '图片工具未初始化',
    };
  }
  return imageTool.compress(file, quality);
};

/**
 * @description 完整的图片处理流程：上传 -> 裁剪 -> 压缩
 * @param file 原始图片文件
 * @param cropConfig 裁剪配置
 * @param uploadConfig 上传配置
 * @param compressionQuality 压缩质量
 * @returns 处理结果
 */
export const processImage = async (
  file: File,
  cropConfig?: ICropConfig,
  uploadConfig?: IImageToolConfig,
  compressionQuality = 0.8,
): Promise<IToolResult<IImageProcessResult>> => {
  try {
    const imageTool = getImageTool();
    if (!imageTool) {
      return {
        success: false,
        error: '图片工具未初始化',
      };
    }

    // 步骤1：上传并验证图片
    const uploadResult = await imageTool.upload(file, uploadConfig);
    if (!uploadResult.success || !uploadResult.data) {
      return uploadResult;
    }

    let processedFile = uploadResult.data.processedFile;

    // 步骤2：如果提供了裁剪配置，进行裁剪
    if (cropConfig) {
      const cropResult = await imageTool.crop(processedFile, cropConfig);
      if (!cropResult.success || !cropResult.data) {
        return {
          success: false,
          error: cropResult.error || '图片裁剪失败',
        };
      }
      processedFile = cropResult.data;
    }

    // 步骤3：压缩图片
    const compressResult = await imageTool.compress(
      processedFile,
      compressionQuality,
    );
    if (!compressResult.success || !compressResult.data) {
      return {
        success: false,
        error: compressResult.error || '图片压缩失败',
      };
    }

    // 计算最终压缩比例
    const finalSize = compressResult.data.size;
    const finalCompressionRatio = Number(
      ((file.size - finalSize) / file.size).toFixed(2),
    );

    const finalResult: IImageProcessResult = {
      originalFile: file,
      processedFile: compressResult.data,
      originalSize: file.size,
      compressedSize: finalSize,
      compressionRatio: finalCompressionRatio,
      dimensions: uploadResult.data.dimensions,
    };

    return { success: true, data: finalResult };
  } catch (error) {
    return {
      success: false,
      error: `图片处理失败: ${error instanceof Error ? error.message : '未知错误'}`,
    };
  }
};

/**
 * @description 获取所有已注册的工具列表
 * @returns 工具名称数组
 */
export const listTools = (): string[] => {
  return toolManager.listTools();
};

/**
 * @description 获取工具管理器实例（用于扩展其他工具）
 * @returns 工具管理器实例
 */
export const getToolManager = (): ToolManager => {
  return toolManager;
};
