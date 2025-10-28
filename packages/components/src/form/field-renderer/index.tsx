import { FormField, ReadonlyField } from '../form-item';

import type { FieldRenderProps } from './types';

export const FieldRender = <T extends Record<string, any>>({
  column,
  index,
}: FieldRenderProps<T>) => {
  if (column.readonly) {
    return <ReadonlyField column={column} index={index} />;
  }

  return <FormField column={column} />;
};

FieldRender.displayName = 'FieldRender';

export type { FieldRenderProps } from './types';
