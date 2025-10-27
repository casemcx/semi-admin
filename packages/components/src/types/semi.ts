import type { Form as SemiForm } from '@douyinfe/semi-ui';
import type { ComponentPropsWithoutRef } from 'react';
import type { MarkdownProps } from '../form/field/markdown';

export type SemiFormType =
  | 'input'
  | 'password'
  | 'textarea'
  | 'number'
  | 'select'
  | 'date'
  | 'time'
  | 'datetime'
  | 'date-range'
  | 'switch'
  | 'checkbox'
  | 'radio'
  | 'upload'
  | 'image'
  | 'cascader'
  | 'treeSelect'
  | 'markdown';

export type SemiFormProps<V extends SemiFormType = SemiFormType> =
  V extends 'markdown'
    ? MarkdownProps
    : V extends 'image'
      ? ComponentPropsWithoutRef<(typeof SemiForm)['Upload']> & {
          /** 是否支持多张图片上传 */
          multiple?: boolean;
          /** 最大上传数量 */
          maxCount?: number;
          /** 接受的文件类型 */
          accept?: string;
          /** 预览类型 */
          listType?: 'text' | 'picture' | 'picture-card';
          /** 图片预览功能 */
          showPreview?: boolean;
        }
      : // @ts-ignore
        ComponentPropsWithoutRef<(typeof SemiForm)[Capitalize<V>]>;
