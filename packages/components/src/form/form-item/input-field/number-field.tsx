import { Form } from '@douyinfe/semi-ui';
import { useFormPlaceholders } from '../../hooks';

import type { FormSchema } from '@components/form/types';

interface FormFieldProps<T extends Record<string, any>> {
  column: FormSchema<T>;
}

export const NumberField = <T extends Record<string, any>>({
  column,
}: FormFieldProps<T>) => {
  const { name, title, fieldProps = {} as any, rules } = column;
  const { inputPlaceholder } = useFormPlaceholders(title);

  return (
    <Form.InputNumber
      field={name}
      label={title}
      placeholder={inputPlaceholder}
      style={{ width: '100%' }}
      rules={rules}
      {...fieldProps}
    />
  );
};
