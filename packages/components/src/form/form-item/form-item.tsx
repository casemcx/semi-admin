import { FormField } from './form-field';
import { ReadonlyField } from './readonly-field';

import type { FormSchema } from '../../types';

export type FieldRenderProps<T extends Record<string, any>> = {
  column: FormSchema<T>;
  index: number;
};

export const FieldRender = <T extends Record<string, any>>(
  props: FieldRenderProps<T>,
) => {
  const { column, index } = props;

  const { readonly } = column;

  // 处理只读字段
  if (readonly) {
    return <ReadonlyField column={column} index={index} />;
  }

  // 处理可编辑字段
  return <FormField column={column} />;
};
