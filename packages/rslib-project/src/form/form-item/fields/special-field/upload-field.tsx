import { Form } from '@douyinfe/semi-ui';

import type { FormSchema } from '@packages/components/types';

interface FormFieldProps<T extends Record<string, any>> {
  column: FormSchema<T>;
}

export const UploadField = <T extends Record<string, any>>({
  column,
}: FormFieldProps<T>) => {
  const { name, title, fieldProps = {} as any, rules } = column;

  return (
    <Form.Upload
      field={name}
      label={title}
      action="/api/upload"
      rules={rules}
      {...fieldProps}
    />
  );
};
