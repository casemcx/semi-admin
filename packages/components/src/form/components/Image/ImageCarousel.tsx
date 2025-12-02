import { useConfigStore } from '@/provider';
import { Carousel, ImagePreview } from '@douyinfe/semi-ui';
import type { UploadFile } from '@packages/share';
import { type FC, type ReactNode, useMemo, useState } from 'react';

export interface ImageCarouselProps {
  /** 图片列表 */
  images: UploadFile[] | string[];
  /** 轮播图宽度 */
  width?: number | string;
  /** 轮播图高度 */
  height?: number | string;
  /** 是否显示导航箭头 */
  showArrow?: boolean;
  /** 箭头显示类型 */
  arrowType?: 'hover' | 'always';
  /** 指示器类型 */
  indicatorType?: 'dot' | 'line' | 'columnar';
  /** 指示器位置 */
  indicatorPosition?: 'left' | 'center' | 'right';
  /** 是否自动播放 */
  autoPlay?: boolean | { interval: number; hoverToPause?: boolean };
  /** 动画效果 */
  animation?: 'slide' | 'fade';
  /** 主题 */
  theme?: 'primary' | 'light' | 'dark';
  /** 是否启用预览功能 */
  preview?: boolean;
  /** 图片样式 */
  imageStyle?: React.CSSProperties;
  /** 容器样式 */
  style?: React.CSSProperties;
  /** 自定义渲染函数 */
  renderItem?: (item: UploadFile | string, index: number) => ReactNode;
}

const ImageCarousel: FC<ImageCarouselProps> = ({
  images,
  width = '100%',
  height = 200,
  showArrow = true,
  arrowType = 'hover',
  indicatorType = 'dot',
  indicatorPosition = 'center',
  autoPlay = false,
  animation = 'slide',
  theme = 'light',
  preview = true,
  imageStyle,
  style,
  renderItem,
}) => {
  const t = useConfigStore(state => state.t);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          color: '#999',
          ...style,
        }}
      >
        {t('noImage')}
      </div>
    );
  }

  // 标准化图片数据
  const normalizedImages: UploadFile[] = useMemo(() => {
    return images.map(item => {
      if (typeof item === 'string') {
        return { fileUrl: item, fileName: t('preview') };
      }
      return item;
    });
  }, [images, t]);

  // 获取所有图片URL用于预览
  const previewUrls = useMemo(() => {
    return normalizedImages
      .filter(item => item.fileUrl)
      .map(item => item.fileUrl as string);
  }, [normalizedImages]);

  const handleImageClick = (index: number) => {
    if (preview) {
      setCurrentIndex(index);
      setPreviewVisible(true);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleImageClick(index);
    }
  };

  const defaultImageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    cursor: preview ? 'pointer' : 'default',
    ...imageStyle,
  };

  return (
    <>
      <div style={{ width, height, ...style }}>
        <Carousel
          showArrow={showArrow}
          arrowType={arrowType}
          indicatorType={indicatorType}
          indicatorPosition={indicatorPosition}
          autoPlay={autoPlay}
          animation={animation}
          theme={theme}
          style={{ width: '100%', height: '100%' }}
        >
          {normalizedImages.map((item, index) => {
            const imageUrl = item.fileUrl;
            const imageAlt = item.fileName || `${t('preview')} ${index + 1}`;

            if (!imageUrl) return null;

            return (
              <div
                key={item.fileId || imageUrl}
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
                onClick={() => handleImageClick(index)}
                onKeyDown={event => handleKeyDown(event, index)}
                role={preview ? 'button' : undefined}
                tabIndex={preview ? 0 : undefined}
                aria-label={
                  preview ? t('viewImage', { index: index + 1 }) : undefined
                }
              >
                {renderItem ? (
                  renderItem(item, index)
                ) : (
                  <img
                    src={imageUrl}
                    alt={imageAlt}
                    style={defaultImageStyle}
                  />
                )}
              </div>
            );
          })}
        </Carousel>
      </div>

      {preview && previewUrls.length > 0 && (
        <ImagePreview
          visible={previewVisible}
          src={previewUrls}
          currentIndex={currentIndex}
          infinite
          onVisibleChange={(visible: boolean) => setPreviewVisible(visible)}
        />
      )}
    </>
  );
};

export default ImageCarousel;
