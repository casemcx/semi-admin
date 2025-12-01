import { FormField } from '@/form/components/FormField';
import { ReadonlyField } from '@/form/components/ReadonlyField';
import type { FormSchema } from '@/types';

export type FormItemProps<T extends Record<string, any>> = {
  column: FormSchema<T>;
  index: number;
};

export const FormItem = <T extends Record<string, any>>(
  props: FormItemProps<T>,
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
