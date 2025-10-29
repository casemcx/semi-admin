import type { Form } from '@douyinfe/semi-ui';
import type { ButtonProps } from '@douyinfe/semi-ui/lib/es/button';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import type { FormInstance, FormSchema } from '@components/form/types';

export interface ProFormProps<T extends Record<string, any> = any>
  extends Omit<
    ComponentPropsWithoutRef<typeof Form>,
    'children' | 'onSubmit' | 'getFormApi'
  > {
  /**
   * @description 表单字段配置数组
   */
  columns?: FormSchema<T>[] | Array<FormSchema<T> & Record<string, any>>;

  /**
   * @description 自定义渲染内容
   */
  children?: ReactNode;

  /**
   * @description 是否显示提交按钮
   * @default true
   */
  showSubmit?: boolean;

  /**
   * @description 是否显示重置按钮
   * @default true
   */
  showReset?: boolean;

  /**
   * @description 提交按钮文本
   * @default "提交"
   */
  submitText?: string;

  /**
   * @description 重置按钮文本
   * @default "重置"
   */
  resetText?: string;

  /**
   * @description 表单项的栅格配置
   * @default { span: 24 }
   */
  colProps?: {
    span?: number;
    offset?: number;
    push?: number;
    pull?: number;
    order?: number;
  };

  /**
   * @description 表单项之间的间距
   * @default 16
   */
  gutter?: number | [number, number];

  /**
   * @description 操作按钮的对齐方式
   * @default "end"
   */
  actionsAlign?: 'start' | 'center' | 'end';

  /**
   * @description 是否为只读模式（详情展示模式）
   * @default false
   */
  readonly?: boolean;

  /**
   * @description 表单提交回调
   */
  onSubmit?: (values: T) => void | Promise<void>;

  getFormApi?: (formApi: FormInstance<T>) => void;

  /**
   * @description 表单底部内容
   */
  footer?: ReactNode;

  submitButtonProps?: ButtonProps;

  resetButtonProps?: ButtonProps;
}
