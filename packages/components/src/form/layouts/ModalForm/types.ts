import type { ProFormProps } from '@/form/BaseForm';
import type { FormSchema } from '@/types';
import type { Modal } from '@douyinfe/semi-ui';
import type { ComponentPropsWithoutRef } from 'react';

// @ts-ignore
export type ModalProps = ComponentPropsWithoutRef<typeof Modal>;

export interface ModalFormProps<T extends Record<string, any>>
  extends Omit<ModalProps, 'onOk' | 'footer'> {
  /** 表单字段配置 */
  columns?: FormSchema<T>[] | Array<FormSchema<T> & Record<string, any>>;
  /** 初始值 */
  initialValues?: Partial<T>;
  /** 是否加载中 */
  loading?: boolean;
  /** 确认按钮文字 */
  okText?: string;
  /** 取消按钮文字 */
  cancelText?: string;
  /** 重置按钮文字 */
  resetText?: string;
  /** 是否显示重置按钮 */
  showReset?: boolean;
  /** 表单项的栅格配置 */
  colProps?: ProFormProps<T>['colProps'];
  /** 表单项之间的间距 */
  gutter?: ProFormProps<T>['gutter'];
  /** 是否为只读模式（详情展示模式） */
  readonly?: boolean;
  /** 表单提交 */
  onSubmit?: (values: T) => void | Promise<void>;
  /** 重置表单 */
  onReset?: () => void;
  /** 获取表单API */
  getFormApi?: ProFormProps<T>['getFormApi'];

  /**
   * @description 表单名称
   * @default "modal-form"
   */
  formName?: string;

  /** 表单配置 */
  formProps?: ProFormProps<T>;
}
