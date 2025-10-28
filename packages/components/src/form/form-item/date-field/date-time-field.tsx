import { Form } from '@douyinfe/semi-ui';
import { useFormPlaceholders } from '../hooks';

import type { FormSchema } from '../../../types';

interface FormFieldProps<T extends Record<string, any>> {
  column: FormSchema<T>;
}

export const DateTimeField = <T extends Record<string, any>>({
  column,
}: FormFieldProps<T>) => {
  const { name, title, fieldProps = {} as any, rules } = column;
  const { inputPlaceholder } = useFormPlaceholders(title);

  return (
    <Form.DatePicker
      type="dateTime"
      field={name}
      label={title}
      placeholder={inputPlaceholder}
      style={{ width: '100%' }}
      rules={rules}
      {...fieldProps}
    />
  );
};
