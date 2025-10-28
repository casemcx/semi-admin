import type { FormSchema } from '../types';

export type FieldRenderProps<T extends Record<string, any>> = {
  column: FormSchema<T>;
  index: number;
};
