import type { ProFormProps } from '@components/form/pro-form/types';
import type { FormSchema } from '@components/form/types';

export interface SchemaFormProps<T extends Record<string, any> = any>
  extends Omit<ProFormProps<T>, 'columns' | 'children'> {
  /**
   * @description 表单字段配置数组
   */
  columns: FormSchema<T>[] | Array<FormSchema<T> & Record<string, any>>;

  /**
   * @description 是否只渲染字段内容，不包括 Form 包装和按钮
   * @default false
   */
  renderFieldsOnly?: boolean;
}
