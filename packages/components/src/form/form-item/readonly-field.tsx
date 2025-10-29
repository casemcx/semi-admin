import { useFormState } from '@douyinfe/semi-ui';
import { useMemo } from 'react';
import { ImageCarousel, MarkdownPreview } from './fields';

import type { FormSchema } from '@packages/components/types';

interface ReadonlyFieldProps<T extends Record<string, any>> {
  column: FormSchema<T>;
  index: number;
  /** 外部传入的值，用于表格渲染 */
  value?: any;
  /** 外部传入的记录，用于表格渲染 */
  record?: T;
}

export const ReadonlyField = <T extends Record<string, any>>({
  column,
  index,
  value: externalValue,
  record: externalRecord,
}: ReadonlyFieldProps<T>) => {
  const { values: formRecord } = useFormState<T>();

  const { type = 'input', name, title, fieldProps = {} as any } = column;

  // 优先使用外部传入的record和value，如果没有则从form state获取
  const record = externalRecord || formRecord;
  const value = useMemo(() => {
    if (externalValue !== undefined) {
      return externalValue;
    }
    return (record as T)?.[name as keyof T];
  }, [externalValue, record, name]);

  const getReadonlyValue = () => {
    if (column.render && typeof column.render === 'function') {
      return column.render(value, record as T, index);
    }

    switch (type) {
      case 'select':
        if (fieldProps?.optionList && Array.isArray(fieldProps.optionList)) {
          const option = fieldProps.optionList.find(
            (opt: any) => opt.value === value,
          );
          return option ? option.label : value || '-';
        }
        return value || '-';
      case 'switch':
        return value ? '是' : '否';
      case 'checkbox':
      case 'radio':
        if (Array.isArray(value)) {
          return value.length > 0 ? value.join(', ') : '-';
        }
        return value || '-';
      case 'date':
      case 'datetime':
        if (value) {
          return new Date(value).toLocaleString();
        }
        return '-';
      case 'time':
        return value || '-';
      case 'textarea':
        return value || '-';
      case 'markdown':
        return value ? (
          <MarkdownPreview id={name as string} value={value} />
        ) : (
          '-'
        );
      case 'upload':
        if (value) {
          // Handle single file upload or multiple files
          const images = Array.isArray(value) ? value : [value];
          return (
            <div
              className="readonly-images"
              style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
            >
              {(images as string[]).map((img: string) => (
                <img
                  key={img}
                  src={img}
                  alt={title}
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    border: '1px solid var(--semi-color-border)',
                  }}
                />
              ))}
            </div>
          );
        }
        return '-';
      case 'image':
        if (value) {
          // 处理不同格式的图片数据
          const uploadFiles: any[] = [];

          if (Array.isArray(value)) {
            for (const item of value) {
              if (typeof item === 'object' && item.fileUrl) {
                uploadFiles.push(item);
              } else if (typeof item === 'string') {
                uploadFiles.push({ fileUrl: item, fileName: 'Image' });
              }
            }
          } else if (typeof value === 'object' && value.fileUrl) {
            uploadFiles.push(value);
          } else if (typeof value === 'string') {
            uploadFiles.push({ fileUrl: value, fileName: 'Image' });
          }

          if (uploadFiles.length > 0) {
            // 根据是否为表格渲染调整尺寸
            const isTableMode = externalValue !== undefined;
            const width = isTableMode ? 80 : 300;
            const height = isTableMode ? 60 : 200;

            return (
              <ImageCarousel
                images={uploadFiles}
                width={width}
                height={height}
                showArrow={uploadFiles.length > 1}
                indicatorType="dot"
                preview
                autoPlay={false}
                style={{ borderRadius: '4px' }}
              />
            );
          }
        }
        return '-';
      default:
        return value || '-';
    }
  };

  return (
    <div className="readonly-field">
      <div className="readonly-field-label font-bold text-base mb-1">
        {title}
      </div>
      <div
        className="readonly-field-value"
        style={{
          fontSize: '14px',
          color: 'var(--semi-color-text-0)',
          lineHeight: '22px',
          minHeight: '22px',
        }}
      >
        {getReadonlyValue()}
      </div>
    </div>
  );
};
