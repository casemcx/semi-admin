import { Form } from '@douyinfe/semi-ui';
import { useFormPlaceholders } from '../../hooks';

import type { FormSchema } from '@packages/components/types';

interface FormFieldProps<T extends Record<string, any>> {
  column: FormSchema<T>;
}

export const SelectField = <T extends Record<string, any>>({
  column,
}: FormFieldProps<T>) => {
  const { name, title, fieldProps = {} as any, rules } = column;
  const { selectPlaceholder } = useFormPlaceholders(title ?? '');

  return (
    <Form.Select
      field={name}
      label={title}
      style={{ width: '100%' }}
      rules={rules}
      {...fieldProps}
    />
  );
};
