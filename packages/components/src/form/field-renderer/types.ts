import type { FormSchema } from '@components/form/types';

export type FieldRenderProps<T extends Record<string, any>> = {
  column: FormSchema<T>;
  index: number;
};
