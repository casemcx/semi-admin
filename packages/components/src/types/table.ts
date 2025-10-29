import type { ColProps } from '@douyinfe/semi-ui/lib/es/grid';
import type { ColumnProps } from '@douyinfe/semi-ui/lib/es/table/interface';
import type { FormSchema } from './form';
import type { SemiFormType } from './semi';

export type ProTableSchema<
  T extends Record<string, any>,
  V extends SemiFormType = SemiFormType,
> = FormSchema<T, V> &
  ColumnProps & {
    /** 是否在搜索中隐藏该列 */
    hiddenInSearch?: boolean;
    /** 是否在编辑中隐藏该列 */
    hiddenInEdit?: boolean;
    /** 是否在创建中隐藏该列 */
    hiddenInCreate?: boolean;

    /** 是否在表格中隐藏该列 */
    hiddenInTable?: boolean;

    /** 是否在详情中隐藏该列 */
    hiddenInDetail?: boolean;

    colProps?: ColProps;
  };
