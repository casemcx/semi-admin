import type { FormSchema } from '@packages/components/types';

export type FieldRenderProps<T extends Record<string, any>> = {
  column: FormSchema<T>;
  index: number;
};
