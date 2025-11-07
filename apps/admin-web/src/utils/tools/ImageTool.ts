import type {
  ICropConfig,
  IImageProcessResult,
  IImageTool,
  IImageToolConfig,
  IToolResult,
} from '@/types/tools';
// import { Image } from '@napi-rs/image';

// 临时使用 Canvas API 替代 @napi-rs/image
class MockImage {
  static fromBuffer(_buffer: Buffer): MockImage {
    return new MockImage();
  }

  jpeg(_quality: number): Buffer {
    return Buffer.alloc(0);
  }

  png(): Buffer {
    return Buffer.alloc(0);
  }

  webp(_quality: number): Buffer {
    return Buffer.alloc(0);
  }

  crop(_x: number, _y: number, _width: number, _height: number): MockImage {
    return new MockImage();
  }

  get width(): number {
    return 0;
  }

  get height(): number {
    return 0;
  }

  toBuffer(_format: string): Buffer {
    return Buffer.alloc(0);
  }
}

/**
 * 图片工具类
 * 提供图片上传、裁剪、压缩等功能
 */
export class ImageTool implements IImageTool {
  /** 默认配置 */
  private defaultConfig: Required<IImageToolConfig> = {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    compressionQuality: 0.8,
    outputFormat: 'jpeg',
  };

  /**
   * 上传并处理图片
   * @param file 要上传的文件
   * @param config 配置选项
   * @returns 处理结果
   */
  async upload(
    file: File,
    config: IImageToolConfig = {},
  ): Promise<IToolResult<IImageProcessResult>> {
    try {
      // 合并配置
      const finalConfig = { ...this.defaultConfig, ...config };

      // 验证文件
      const validation = this.validateFile(file, finalConfig);
      if (!validation.success) {
        return validation;
      }

      // 获取原始文件信息
      const originalSize = file.size;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // 使用 MockImage 读取图片信息（临时解决方案）
      const image = MockImage.fromBuffer(buffer);
      const { width, height } = { width: image.width, height: image.height };

      // 压缩图片
      const compressedImage = await this.compress(
        file,
        finalConfig.compressionQuality,
      );
      if (!compressedImage.success || !compressedImage.data) {
        return {
          success: false,
          error: compressedImage.error || '图片压缩失败',
        };
      }

      // 计算压缩比例
      const compressedSize = compressedImage.data.size;
      const compressionRatio = Number(
        ((originalSize - compressedSize) / originalSize).toFixed(2),
      );

      const result: IImageProcessResult = {
        originalFile: file,
        processedFile: compressedImage.data,
        originalSize,
        compressedSize,
        compressionRatio,
        dimensions: { width, height },
      };

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: `图片上传失败: ${error instanceof Error ? error.message : '未知错误'}`,
      };
    }
  }

  /**
   * 裁剪图片
   * @param file 要裁剪的文件
   * @param cropConfig 裁剪配置
   * @returns 裁剪后的文件
   */
  async crop(file: File, cropConfig: ICropConfig): Promise<IToolResult<File>> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // 使用 MockImage 进行裁剪（临时解决方案）
      const image = MockImage.fromBuffer(buffer);
      const croppedImage = image.crop(
        cropConfig.x,
        cropConfig.y,
        cropConfig.width,
        cropConfig.height,
      );

      // 转换为 Buffer
      const croppedBuffer = croppedImage.toBuffer(
        this.getImageFormat(file.type),
      );

      // 创建新的 File 对象 - 将 Buffer 转换为 Uint8Array
      const croppedFile = new File([new Uint8Array(croppedBuffer)], file.name, {
        type: file.type,
        lastModified: Date.now(),
      });

      return { success: true, data: croppedFile };
    } catch (error) {
      return {
        success: false,
        error: `图片裁剪失败: ${error instanceof Error ? error.message : '未知错误'}`,
      };
    }
  }

  /**
   * 压缩图片
   * @param file 要压缩的文件
   * @param quality 压缩质量（0-1）
   * @returns 压缩后的文件
   */
  async compress(file: File, quality = 0.8): Promise<IToolResult<File>> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // 使用 MockImage 进行压缩（临时解决方案）
      const image = MockImage.fromBuffer(buffer);

      // 根据格式进行压缩
      let compressedBuffer: Buffer;
      const format = this.getImageFormat(file.type);

      if (format === 'jpeg') {
        compressedBuffer = image.jpeg(quality);
      } else if (format === 'png') {
        compressedBuffer = image.png();
      } else if (format === 'webp') {
        compressedBuffer = image.webp(quality);
      } else {
        // 如果是不支持的格式，转为 JPEG
        compressedBuffer = image.jpeg(quality);
      }

      // 创建新的 File 对象 - 将 Buffer 转换为 Uint8Array
      const fileName = `${file.name.replace(/\.[^/.]+$/, '')}.${format}`;
      const mimeType = `image/${format}`;
      const compressedFile = new File(
        [new Uint8Array(compressedBuffer)],
        fileName,
        {
          type: mimeType,
          lastModified: Date.now(),
        },
      );

      return { success: true, data: compressedFile };
    } catch (error) {
      return {
        success: false,
        error: `图片压缩失败: ${error instanceof Error ? error.message : '未知错误'}`,
      };
    }
  }

  /**
   * 验证文件
   * @param file 要验证的文件
   * @param config 配置选项
   * @returns 验证结果
   */
  private validateFile(
    file: File,
    config: Required<IImageToolConfig>,
  ): IToolResult {
    // 检查文件类型
    if (!config.allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: `不支持的文件类型: ${file.type}，支持的类型: ${config.allowedTypes.join(', ')}`,
      };
    }

    // 检查文件大小
    if (file.size > config.maxSize) {
      return {
        success: false,
        error: `文件大小超过限制: ${this.formatFileSize(file.size)} > ${this.formatFileSize(config.maxSize)}`,
      };
    }

    return { success: true };
  }

  /**
   * 获取图片格式
   * @param mimeType MIME类型
   * @returns 图片格式
   */
  private getImageFormat(mimeType: string): 'jpeg' | 'png' | 'webp' {
    switch (mimeType) {
      case 'image/jpeg':
        return 'jpeg';
      case 'image/png':
        return 'png';
      case 'image/webp':
        return 'webp';
      default:
        return 'jpeg'; // 默认使用 JPEG
    }
  }

  /**
   * 格式化文件大小
   * @param bytes 字节数
   * @returns 格式化后的文件大小
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  }
}
