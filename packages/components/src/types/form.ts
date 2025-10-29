import type { Form } from '@douyinfe/semi-ui';
import type { FormApi } from '@douyinfe/semi-ui/lib/es/form/interface';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

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
   * @description 是否隐藏表单项
   */
  hidden?: boolean;
};

export type { FieldRenderProps } from '@packages/components/form/field-renderer/types';
export type { ProFormProps } from '@packages/components/form/pro-form/types';
export type {
  ModalFormProps,
  ModalProps,
} from '@packages/components/form/modal-form/types';
export type { SchemaFormProps } from '@packages/components/form/schema-form/types';
