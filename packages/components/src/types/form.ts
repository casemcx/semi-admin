import type { Form, Modal } from '@douyinfe/semi-ui';

import type { FormApi } from '@douyinfe/semi-ui/lib/es/form/interface';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import type { ButtonProps } from '@douyinfe/semi-ui/lib/es/button';
import type { SchemaBase } from './schema';
import type { SemiFormProps, SemiFormType } from './semi';

export type FormInstance<T extends Record<string, any>> = FormApi<T>;

export type FormSchema<
  T extends Record<string, any>,
  V extends SemiFormType = SemiFormType,
  N extends keyof T = keyof T,
> = SchemaBase<T> & {
  /**
   * @description 表单项的类型
   * @default 'input'
   */
  type?: V;

  /**
   * @description 表单项的配置
   */
  fieldProps?: SemiFormProps<V>;

  /**
   * @description 自定义渲染表单项
   */
  renderFormItem?: () => ReactNode;

  /**
   * @description 自定义渲染表单项
   */
  render?: (value: T[N], record: T, index: number) => ReactNode;

  /**
   * @description 占位符文本
   */
  placeholder?: string;

  /**
   * @description 是否在搜索表单中隐藏
   * @default false
   */
  hiddenInSearch?: boolean;

  /**
   * @description 是否在创建表单中隐藏
   * @default false
   */
  hiddenInCreate?: boolean;

  /**
   * @description 是否在编辑表单中隐藏
   * @default false
   */
  hiddenInEdit?: boolean;

  /**
   * @description 栅格布局配置
   */
  colProps?: {
    span?: number;
    offset?: number;
    push?: number;
    pull?: number;
    order?: number;
  };

  /**
   * @description 表单验证规则
   */
  rules?: ComponentPropsWithoutRef<typeof Form.Input>['rules'];

  /**
   * @description 表单项的依赖关系
   */
  dependencies?: string[];

  /**
   * @description 是否为只读字段
   * @default false
   */
  readonly?: boolean;

  /**
   * @description 是否禁用
   * @default false
   */
  disabled?: boolean;

  /**
   * @description 表单项的值
   */
  hidden?: boolean;
};

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

export type ModalProps = ComponentPropsWithoutRef<typeof Modal>;

export interface ModalFormProps<T extends Record<string, any>>
  extends Omit<ModalProps, 'onOk' | 'children' | 'footer'> {
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
}
