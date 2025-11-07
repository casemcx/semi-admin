import {
  type ICropConfig,
  type IImageProcessResult,
  type IImageToolConfig,
  IToolResult,
} from '@/types/tools';
import {
  compressImage,
  cropImage,
  processImage,
  uploadImage,
} from '@/utils/tools';
import { useCallback, useState } from 'react';

/**
 * 图片工具Hook状态接口
 */
export interface IUseImageToolState {
  /** 是否正在处理 */
  loading: boolean;
  /** 错误信息 */
  error: string | null;
  /** 处理结果 */
  result: IImageProcessResult | null;
  /** 进度信息 */
  progress: string;
}

/**
 * 图片工具Hook返回值接口
 */
export interface IUseImageToolReturn extends IUseImageToolState {
  /** 处理图片（完整流程） */
  handleProcessImage: (
    file: File,
    cropConfig?: ICropConfig,
    uploadConfig?: IImageToolConfig,
    quality?: number,
  ) => Promise<void>;
  /** 仅上传图片 */
  handleUploadImage: (file: File, config?: IImageToolConfig) => Promise<void>;
  /** 仅裁剪图片 */
  handleCropImage: (file: File, cropConfig: ICropConfig) => Promise<void>;
  /** 仅压缩图片 */
  handleCompressImage: (file: File, quality?: number) => Promise<void>;
  /** 重置状态 */
  reset: () => void;
  /** 清除错误 */
  clearError: () => void;
}

/**
 * 图片工具Hook
 * 提供图片处理的状态管理和方法
 * @returns 图片工具的状态和方法
 */
export function useImageTool(): IUseImageToolReturn {
  const [state, setState] = useState<IUseImageToolState>({
    loading: false,
    error: null,
    result: null,
    progress: '',
  });

  /**
   * 更新状态
   */
  const updateState = useCallback((updates: Partial<IUseImageToolState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * 重置状态
   */
  const reset = useCallback(() => {
    setState({
      loading: false,
      error: null,
      result: null,
      progress: '',
    });
  }, []);

  /**
   * 清除错误
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  /**
   * 处理图片（完整流程：上传 -> 裁剪 -> 压缩）
   */
  const handleProcessImage = useCallback(
    async (
      file: File,
      cropConfig?: ICropConfig,
      uploadConfig?: IImageToolConfig,
      quality = 0.8,
    ) => {
      updateState({ loading: true, error: null, progress: '开始处理图片...' });

      try {
        updateState({ progress: '正在上传并验证图片...' });
        const result = await processImage(
          file,
          cropConfig,
          uploadConfig,
          quality,
        );

        if (result.success && result.data) {
          updateState({
            loading: false,
            result: result.data,
            progress: `处理完成！压缩率: ${(result.data.compressionRatio * 100).toFixed(1)}%`,
          });
        } else {
          updateState({
            loading: false,
            error: result.error || '图片处理失败',
            progress: '',
          });
        }
      } catch (error) {
        updateState({
          loading: false,
          error:
            error instanceof Error ? error.message : '处理过程中发生未知错误',
          progress: '',
        });
      }
    },
    [updateState],
  );

  /**
   * 仅上传图片
   */
  const handleUploadImage = useCallback(
    async (file: File, config?: IImageToolConfig) => {
      updateState({ loading: true, error: null, progress: '正在上传图片...' });

      try {
        const result = await uploadImage(file, config);

        if (result.success && result.data) {
          updateState({
            loading: false,
            result: result.data,
            progress: '上传完成！',
          });
        } else {
          updateState({
            loading: false,
            error: result.error || '图片上传失败',
            progress: '',
          });
        }
      } catch (error) {
        updateState({
          loading: false,
          error:
            error instanceof Error ? error.message : '上传过程中发生未知错误',
          progress: '',
        });
      }
    },
    [updateState],
  );

  /**
   * 仅裁剪图片
   */
  const handleCropImage = useCallback(
    async (file: File, cropConfig: ICropConfig) => {
      updateState({ loading: true, error: null, progress: '正在裁剪图片...' });

      try {
        const result = await cropImage(file, cropConfig);

        if (result.success && result.data) {
          // 将裁剪结果转换为 IImageProcessResult 格式
          const processResult: IImageProcessResult = {
            originalFile: file,
            processedFile: result.data,
            originalSize: file.size,
            compressedSize: result.data.size,
            compressionRatio: 0, // 裁剪不改变文件大小
            dimensions: { width: 0, height: 0 }, // 需要从结果中获取
          };

          updateState({
            loading: false,
            result: processResult,
            progress: '裁剪完成！',
          });
        } else {
          updateState({
            loading: false,
            error: result.error || '图片裁剪失败',
            progress: '',
          });
        }
      } catch (error) {
        updateState({
          loading: false,
          error:
            error instanceof Error ? error.message : '裁剪过程中发生未知错误',
          progress: '',
        });
      }
    },
    [updateState],
  );

  /**
   * 仅压缩图片
   */
  const handleCompressImage = useCallback(
    async (file: File, quality = 0.8) => {
      updateState({ loading: true, error: null, progress: '正在压缩图片...' });

      try {
        const result = await compressImage(file, quality);

        if (result.success && result.data) {
          // 将压缩结果转换为 IImageProcessResult 格式
          const processResult: IImageProcessResult = {
            originalFile: file,
            processedFile: result.data,
            originalSize: file.size,
            compressedSize: result.data.size,
            compressionRatio: Number(
              ((file.size - result.data.size) / file.size).toFixed(2),
            ),
            dimensions: { width: 0, height: 0 }, // 需要从结果中获取
          };

          updateState({
            loading: false,
            result: processResult,
            progress: `压缩完成！压缩率: ${(((file.size - result.data.size) / file.size) * 100).toFixed(1)}%`,
          });
        } else {
          updateState({
            loading: false,
            error: result.error || '图片压缩失败',
            progress: '',
          });
        }
      } catch (error) {
        updateState({
          loading: false,
          error:
            error instanceof Error ? error.message : '压缩过程中发生未知错误',
          progress: '',
        });
      }
    },
    [updateState],
  );

  return {
    ...state,
    handleProcessImage,
    handleUploadImage,
    handleCropImage,
    handleCompressImage,
    reset,
    clearError,
  };
}
