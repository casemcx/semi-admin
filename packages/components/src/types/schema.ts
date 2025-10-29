import type { ColProps } from '@douyinfe/semi-ui/lib/es/grid';

export type SchemaBase<T extends Record<string, any>> = {
  /**
   * 栅格布局的列props
   */
  colProps?: ColProps;
  /**
   * 表单项的key
   */
  name: keyof T | 'action' | string | number;

  /**
   * 表单项的标题
   */
  title?: string;
};
