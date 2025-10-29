import { Form } from '@douyinfe/semi-ui';
import { useFormPlaceholders } from '@packages/components/hooks';
import type { FormSchema } from '@packages/components/types';

interface FormFieldProps<T extends Record<string, any>> {
  column: FormSchema<T>;
}

export const InputField = <T extends Record<string, any>>({
  column,
}: FormFieldProps<T>) => {
  const { name, title, fieldProps = {} as any, rules } = column;
  const { inputPlaceholder } = useFormPlaceholders(title);

  return (
    <Form.Input
      field={name}
      label={title}
      placeholder={inputPlaceholder}
      style={{ width: '100%' }}
      rules={rules}
      {...fieldProps}
    />
  );
};
