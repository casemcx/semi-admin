import { useFormPlaceholders } from '@/hooks';
import type { FormSchema } from '@/types';
import { Form } from '@douyinfe/semi-ui';

interface FormFieldProps<T extends Record<string, any>> {
  column: FormSchema<T>;
}

export const TextAreaField = <T extends Record<string, any>>({
  column,
}: FormFieldProps<T>) => {
  const { name, title, fieldProps = {} as any, rules } = column;
  const { inputPlaceholder } = useFormPlaceholders(title);

  return (
    <Form.TextArea
      field={name}
      label={title}
      placeholder={inputPlaceholder}
      rules={rules}
      {...fieldProps}
    />
  );
};
