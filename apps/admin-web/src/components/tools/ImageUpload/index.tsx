import { useImageTool } from '@/hooks/useImageTool';
import type { ICropConfig, IImageToolConfig } from '@/types/tools';
import { IconCrop, IconDownload, IconUpload } from '@douyinfe/semi-icons';
import {
  Button,
  Card,
  Image,
  Progress,
  Space,
  Toast,
  Typography,
  Upload,
} from '@douyinfe/semi-ui';
import React, { useRef, useState } from 'react';

const { Title, Text } = Typography;

/**
 * 图片上传组件属性
 */
export interface IImageUploadProps {
  /** 上传配置 */
  uploadConfig?: IImageToolConfig;
  /** 是否显示裁剪选项 */
  showCrop?: boolean;
  /** 是否显示压缩选项 */
  showCompress?: boolean;
  /** 默认压缩质量 */
  defaultQuality?: number;
  /** 处理完成回调 */
  onSuccess?: (result: any) => void;
  /** 处理失败回调 */
  onError?: (error: string) => void;
}

/**
 * 图片上传组件
 * 提供完整的图片上传、裁剪、压缩功能
 */
export const ImageUpload: React.FC<IImageUploadProps> = ({
  uploadConfig,
  showCrop = true,
  showCompress = true,
  defaultQuality = 0.8,
  onSuccess,
  onError,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [cropConfig, setCropConfig] = useState<ICropConfig | undefined>();
  const [quality, setQuality] = useState(defaultQuality);

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

  /**
   * 文件选择处理
   */
  const handleFileSelect = (options: any) => {
    const { file } = options;
    setSelectedFile(file);
    clearError();

    // 生成预览URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return true; // 返回true允许上传
  };

  /**
   * 手动上传处理
   */
  const handleUpload = async () => {
    if (!selectedFile) return;

    if (showCrop && cropConfig) {
      // 完整流程：上传 -> 裁剪 -> 压缩
      await handleProcessImage(selectedFile, cropConfig, uploadConfig, quality);
    } else if (showCompress) {
      // 上传 + 压缩
      await handleProcessImage(selectedFile, undefined, uploadConfig, quality);
    } else {
      // 仅上传
      await handleUploadImage(selectedFile, uploadConfig);
    }
  };

  /**
   * 重置处理
   */
  const handleReset = () => {
    reset();
    setSelectedFile(null);
    setPreviewUrl('');
    setCropConfig(undefined);
    // 清理预览URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  /**
   * 监听处理结果变化
   */
  React.useEffect(() => {
    if (result && onSuccess) {
      onSuccess(result);
    }
  }, [result, onSuccess]);

  /**
   * 监听错误变化
   */
  React.useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  /**
   * 清理预览URL
   */
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">图片处理工具</h2>
        <p className="text-gray-600">支持图片上传、裁剪、压缩等功能</p>
      </div>

      <div className="space-y-6">
        {/* 文件上传区域 */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">选择图片</h3>
          <Upload
            action=""
            beforeUpload={handleFileSelect}
            showUploadList={false}
            accept="image/*"
            disabled={loading}
          >
            <Button
              icon={<IconUpload />}
              disabled={loading}
              loading={loading}
              className="w-full sm:w-auto"
            >
              选择图片文件
            </Button>
          </Upload>
        </div>

        {/* 图片预览 */}
        {previewUrl && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              图片预览
            </h3>
            <div className="flex justify-center">
              <Image
                src={previewUrl}
                alt="预览图片"
                width={200}
                height={200}
                className="object-cover border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        )}

        {/* 裁剪配置 */}
        {showCrop && selectedFile && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              裁剪设置（可选）
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <input
                type="number"
                placeholder="X坐标"
                onChange={e =>
                  setCropConfig(prev =>
                    prev
                      ? { ...prev, x: Number(e.target.value) }
                      : {
                          x: Number(e.target.value),
                          y: 0,
                          width: 0,
                          height: 0,
                        },
                  )
                }
                disabled={loading}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Y坐标"
                onChange={e =>
                  setCropConfig(prev =>
                    prev
                      ? { ...prev, y: Number(e.target.value) }
                      : {
                          x: 0,
                          y: Number(e.target.value),
                          width: 0,
                          height: 0,
                        },
                  )
                }
                disabled={loading}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="宽度"
                onChange={e =>
                  setCropConfig(prev =>
                    prev
                      ? { ...prev, width: Number(e.target.value) }
                      : {
                          x: 0,
                          y: 0,
                          width: Number(e.target.value),
                          height: 0,
                        },
                  )
                }
                disabled={loading}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="高度"
                onChange={e =>
                  setCropConfig(prev =>
                    prev
                      ? { ...prev, height: Number(e.target.value) }
                      : {
                          x: 0,
                          y: 0,
                          width: 0,
                          height: Number(e.target.value),
                        },
                  )
                }
                disabled={loading}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* 压缩配置 */}
        {showCompress && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              压缩质量: {Math.round(quality * 100)}%
            </h3>
            <div className="space-y-2">
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={quality}
                onChange={e => setQuality(Number(e.target.value))}
                disabled={loading}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>低质量</span>
                <span>高质量</span>
              </div>
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        {selectedFile && (
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              icon={<IconUpload />}
              onClick={handleUpload}
              loading={loading}
              type="primary"
              className="flex-1"
            >
              {loading ? '处理中...' : '开始处理'}
            </Button>
            <Button onClick={handleReset} disabled={loading} className="flex-1">
              重置
            </Button>
          </div>
        )}

        {/* 进度显示 */}
        {progress && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-700 text-center">{progress}</p>
          </div>
        )}

        {/* 错误显示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <strong className="text-red-700">处理失败:</strong>
                <span className="text-red-600 ml-2">{error}</span>
              </div>
              <Button
                size="small"
                onClick={clearError}
                type="tertiary"
                className="text-red-600 hover:text-red-800"
              >
                ×
              </Button>
            </div>
          </div>
        )}

        {/* 处理结果 */}
        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-700 mb-3">
              处理结果
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-white p-3 rounded border border-green-200">
                <span className="text-gray-600">原始大小:</span>
                <span className="font-semibold text-gray-800 ml-2">
                  {(result.originalSize / 1024).toFixed(2)} KB
                </span>
              </div>
              <div className="bg-white p-3 rounded border border-green-200">
                <span className="text-gray-600">处理后大小:</span>
                <span className="font-semibold text-gray-800 ml-2">
                  {(result.compressedSize / 1024).toFixed(2)} KB
                </span>
              </div>
              <div className="bg-white p-3 rounded border border-green-200">
                <span className="text-gray-600">压缩比例:</span>
                <span
                  className={`font-semibold ml-2 ${
                    result.compressionRatio > 0
                      ? 'text-green-600'
                      : 'text-gray-600'
                  }`}
                >
                  {(result.compressionRatio * 100).toFixed(1)}%
                </span>
              </div>
              <div className="bg-white p-3 rounded border border-green-200">
                <span className="text-gray-600">图片尺寸:</span>
                <span className="font-semibold text-gray-800 ml-2">
                  {result.dimensions.width} × {result.dimensions.height}
                </span>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <Button
                icon={<IconDownload />}
                onClick={() => {
                  const url = URL.createObjectURL(result.processedFile);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = result.processedFile.name;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                下载处理后的图片
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
