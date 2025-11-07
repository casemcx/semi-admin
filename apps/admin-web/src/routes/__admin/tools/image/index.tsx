import { ImageUpload } from '@/components/tools/ImageUpload';
import type { IImageProcessResult } from '@/types/tools';
import { initializeTools } from '@/utils/tools';
import {
  IconCrop,
  IconDelete,
  IconImage,
  IconInfoCircle,
  IconUpload,
} from '@douyinfe/semi-icons';
import { Button, Toast } from '@douyinfe/semi-ui';
import { useLocalStorageState } from 'ahooks';
import React, { useEffect, useCallback } from 'react';

// 简化的缓存结果类型
interface IStoredCacheResult {
  id: string;
  timestamp: number;
  originalFile: {
    name: string;
    size: number;
    type: string;
    lastModified: number;
  };
  processedFile: {
    name: string;
    size: number;
    type: string;
    lastModified: number;
  };
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  dimensions: {
    width: number;
    height: number;
  };
  previewData?: string;
}

// 缓存数据的结构
interface ICacheData {
  version: string;
  timestamp: number;
  results: IStoredCacheResult[];
}

const CACHE_KEY = 'image_process_history';
const CACHE_VERSION = '1.0';
const MAX_CACHE_ITEMS = 20;

// 默认缓存数据
const DEFAULT_CACHE_DATA: ICacheData = {
  version: CACHE_VERSION,
  timestamp: Date.now(),
  results: [],
};

/**
 * 图片工具页面组件
 */
export default function ImageToolPage() {
  // 使用 useLocalStorageState 管理所有处理结果
  const [cacheData = DEFAULT_CACHE_DATA, setCacheData] =
    useLocalStorageState<ICacheData>(CACHE_KEY, {
      defaultValue: DEFAULT_CACHE_DATA,
    });

  // 初始化工具集
  useEffect(() => {
    initializeTools();
  }, []);

  // 将处理结果转换为可缓存格式
  const convertToStoredFormat = useCallback(
    async (result: IImageProcessResult): Promise<IStoredCacheResult> => {
      // 生成预览图的base64数据
      const previewData = await fileToBase64(result.processedFile, 200);

      return {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        timestamp: Date.now(),
        originalFile: {
          name: result.originalFile.name,
          size: result.originalFile.size,
          type: result.originalFile.type,
          lastModified: result.originalFile.lastModified,
        },
        processedFile: {
          name: result.processedFile.name,
          size: result.processedFile.size,
          type: result.processedFile.type,
          lastModified: result.processedFile.lastModified,
        },
        originalSize: result.originalSize,
        compressedSize: result.compressedSize,
        compressionRatio: result.compressionRatio,
        dimensions: result.dimensions,
        previewData,
      };
    },
    [],
  );

  // 将文件转换为base64编码
  const fileToBase64 = useCallback(
    (file: File, maxSize: number): Promise<string> => {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
          const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;

          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          const base64 = canvas.toDataURL('image/jpeg', 0.7);
          resolve(base64);
        };

        img.onerror = () => {
          reject(new Error('图片加载失败'));
        };

        img.src = URL.createObjectURL(file);
      });
    },
    [],
  );

  // 格式化时间戳
  const formatTimestamp = useCallback((timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;

    return date.toLocaleDateString('zh-CN');
  }, []);

  // 格式化缓存大小
  const formatCacheSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  }, []);

  /**
   * 处理成功回调
   */
  const handleSuccess = async (result: IImageProcessResult) => {
    Toast.success({
      content: '图片处理成功！',
      duration: 3,
    });

    // 转换并保存到本地缓存
    try {
      const storedResult = await convertToStoredFormat(result);

      // 使用 useLocalStorageState 更新缓存
      setCacheData((prev = DEFAULT_CACHE_DATA) => {
        const newResults = [
          storedResult,
          ...prev.results.slice(0, MAX_CACHE_ITEMS - 1),
        ];
        return {
          version: CACHE_VERSION,
          timestamp: Date.now(),
          results: newResults,
        };
      });
    } catch (error) {
      console.warn('保存到缓存失败:', error);
    }
  };

  /**
   * 处理失败回调
   */
  const handleError = (error: string) => {
    Toast.error({
      content: `处理失败: ${error}`,
      duration: 5,
    });
  };

  /**
   * 删除单条缓存记录
   */
  const handleDeleteHistory = (index: number) => {
    setCacheData((prev = DEFAULT_CACHE_DATA) => {
      const newResults = prev.results.filter(
        (_: IStoredCacheResult, i: number) => i !== index,
      );
      return {
        version: CACHE_VERSION,
        timestamp: Date.now(),
        results: newResults,
      };
    });

    Toast.info({
      content: '已删除该条记录',
      duration: 2,
    });
  };

  /**
   * 清空历史记录
   */
  const handleClearHistory = () => {
    setCacheData({
      version: CACHE_VERSION,
      timestamp: Date.now(),
      results: [],
    });

    Toast.info({
      content: '历史记录已清空',
      duration: 2,
    });
  };

  /**
   * 获取缓存统计信息
   */
  const getCacheStats = useCallback(() => {
    const results = cacheData.results;
    const totalSize = results.reduce(
      (sum: number, result: IStoredCacheResult) =>
        sum + result.processedFile.size,
      0,
    );
    const oldestTimestamp =
      results.length > 0
        ? Math.min(...results.map((r: IStoredCacheResult) => r.timestamp))
        : 0;

    return {
      count: results.length,
      totalSize,
      oldestTimestamp,
    };
  }, [cacheData.results]);

  /**
   * 渲染处理历史
   */
  const renderHistory = () => {
    if (cacheData.results.length === 0) {
      return (
        <div className="text-center py-10">
          <IconImage size="large" className="text-gray-400 mb-4" />
          <p className="text-gray-500">暂无处理历史</p>
          <p className="text-gray-400 text-xs mt-2">
            处理完的图片会自动保存到本地缓存
          </p>
        </div>
      );
    }

    const stats = getCacheStats();

    return (
      <div className="space-y-4">
        {/* 缓存统计信息 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-blue-700">
              <IconInfoCircle className="mr-2" />
              <span className="text-sm font-medium">本地缓存统计</span>
            </div>
            <Button
              size="small"
              onClick={handleClearHistory}
              className="text-blue-600 hover:text-blue-800"
              title="清空所有历史记录"
            >
              <IconDelete />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-blue-600">
            <div>
              <span className="font-medium">缓存数量:</span> {stats.count}/20
            </div>
            <div>
              <span className="font-medium">占用空间:</span>{' '}
              {formatCacheSize(stats.totalSize)}
            </div>
          </div>
        </div>

        {/* 历史记录列表 */}
        <div className="space-y-3 max-h-[calc(100vh-380px)] overflow-y-auto">
          {cacheData.results.map((item: IStoredCacheResult, index: number) => {
            return (
              <div
                key={item.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200 relative group hover:border-blue-300 transition-colors"
              >
                {/* 状态指示器 */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-semibold text-gray-900">
                      记录 #{index + 1}
                    </h4>
                  </div>
                  <Button
                    size="small"
                    onClick={() => handleDeleteHistory(index)}
                    className="text-red-600 hover:text-red-800"
                    title="删除记录"
                  >
                    ×
                  </Button>
                </div>

                {/* 图片预览 */}
                <div className="mb-3">
                  <div className="w-full h-24 border border-gray-300 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                    {item.previewData ? (
                      <img
                        src={item.previewData}
                        alt="预览"
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div className="text-center text-gray-400">
                        <IconImage size="large" />
                        <p className="text-xs mt-1">无预览</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 文件信息 */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">原始大小:</span>
                    <span className="font-medium text-gray-800">
                      {(item.originalSize / 1024).toFixed(1)}KB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">处理后:</span>
                    <span className="font-medium text-gray-800">
                      {(item.compressedSize / 1024).toFixed(1)}KB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">压缩:</span>
                    <span
                      className={`font-medium ${
                        item.compressionRatio > 0
                          ? 'text-green-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {item.compressionRatio > 0
                        ? `${(item.compressionRatio * 100).toFixed(1)}%`
                        : '无变化'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">尺寸:</span>
                    <span className="font-medium text-gray-800">
                      {item.dimensions.width} × {item.dimensions.height}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">文件名:</span>
                    <span
                      className="font-medium text-gray-800 truncate max-w-20"
                      title={item.processedFile.name}
                    >
                      {item.processedFile.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">处理时间:</span>
                    <span className="font-medium text-gray-800">
                      {formatTimestamp(item.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <IconImage size="large" className="text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  图片处理工具
                </h1>
                <p className="text-sm text-gray-500">
                  支持图片上传、裁剪、压缩等功能
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧主要功能区 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 图片处理区域 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-6">
                <IconUpload className="text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">
                  图片处理
                </h2>
              </div>
              <ImageUpload
                showCrop={true}
                showCompress={true}
                defaultQuality={0.8}
                uploadConfig={{
                  maxSize: 10 * 1024 * 1024, // 10MB
                  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
                  compressionQuality: 0.8,
                  outputFormat: 'jpeg',
                }}
                onSuccess={handleSuccess}
                onError={handleError}
              />
            </div>

            {/* 使用说明 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                使用说明
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <IconUpload className="text-blue-600 mt-1" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-base font-medium text-gray-900">
                      支持的格式
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      JPEG、PNG、WebP、GIF 格式，文件大小不超过 10MB
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <IconCrop className="text-green-600 mt-1" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-base font-medium text-gray-900">
                      裁剪功能
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      可自定义裁剪区域，输入 X、Y 坐标和宽度、高度进行精确裁剪
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <IconImage className="text-purple-600 mt-1" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-base font-medium text-gray-900">
                      压缩功能
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      支持 10% - 100% 质量调节，自动计算压缩比例和文件大小变化
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 text-xs font-semibold">
                        →
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-base font-medium text-gray-900">
                      处理流程
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      上传 → 验证 → 裁剪（可选）→ 压缩 → 完成
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧历史记录区 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <IconImage className="text-blue-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    处理记录
                  </h2>
                </div>
                <Button
                  size="small"
                  onClick={handleClearHistory}
                  disabled={cacheData.results.length === 0}
                  className="text-gray-500 hover:text-gray-700"
                >
                  清空
                </Button>
              </div>

              <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto">
                {renderHistory()}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
