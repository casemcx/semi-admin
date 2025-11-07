/**
 * 工具集管理相关类型定义
 */

// 图片工具配置接口
export interface IImageToolConfig {
  /** 最大文件大小（字节） */
  maxSize?: number;
  /** 允许的文件类型 */
  allowedTypes?: string[];
  /** 压缩质量（0-1） */
  compressionQuality?: number;
  /** 输出格式 */
  outputFormat?: 'jpeg' | 'png' | 'webp';
}

// 图片裁剪配置接口
export interface ICropConfig {
  /** 裁剪起始X坐标 */
  x: number;
  /** 裁剪起始Y坐标 */
  y: number;
  /** 裁剪宽度 */
  width: number;
  /** 裁剪高度 */
  height: number;
}

// 图片处理结果接口
export interface IImageProcessResult {
  /** 原始文件 */
  originalFile: File;
  /** 处理后的文件 */
  processedFile: File;
  /** 原始文件大小 */
  originalSize: number;
  /** 压缩后文件大小 */
  compressedSize: number;
  /** 压缩比例 */
  compressionRatio: number;
  /** 图片尺寸信息 */
  dimensions: {
    width: number;
    height: number;
  };
}

// 工具执行结果接口
export interface IToolResult<T = any> {
  /** 是否执行成功 */
  success: boolean;
  /** 返回数据 */
  data?: T;
  /** 错误信息 */
  error?: string;
}

// 图片工具接口
export interface IImageTool {
  /** 上传并处理图片 */
  upload(
    file: File,
    config?: IImageToolConfig,
  ): Promise<IToolResult<IImageProcessResult>>;
  /** 裁剪图片 */
  crop(file: File, cropConfig: ICropConfig): Promise<IToolResult<File>>;
  /** 压缩图片 */
  compress(file: File, quality?: number): Promise<IToolResult<File>>;
}

// 工具管理器接口
export interface IToolManager {
  /** 注册工具 */
  registerTool(name: string, tool: any): void;
  /** 获取工具 */
  getTool<T = any>(name: string): T | null;
  /** 移除工具 */
  removeTool(name: string): boolean;
  /** 列出所有工具 */
  listTools(): string[];
}
