import type { Form as SemiForm } from '@douyinfe/semi-ui';
import type { ComponentPropsWithoutRef } from 'react';
import type { MarkdownProps } from '../form';

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
  // @ts-ignore
  ComponentPropsWithoutRef<(typeof SemiForm)[Capitalize<V>]>;
