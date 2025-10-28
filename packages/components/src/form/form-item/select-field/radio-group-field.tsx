import { Form } from '@douyinfe/semi-ui';

import type { FormSchema } from '../../../types';

interface FormFieldProps<T extends Record<string, any>> {
  column: FormSchema<T>;
}

export const RadioGroupField = <T extends Record<string, any>>({
  column,
}: FormFieldProps<T>) => {
  const { name, title, fieldProps = {} as any, rules } = column;

  return (
    <Form.RadioGroup field={name} label={title} rules={rules} {...fieldProps} />
  );
};
