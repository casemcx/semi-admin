import { useFormPlaceholders } from '../hooks';
import MarkdownField from '../markdown';

import type { FormSchema } from '../../../types';

interface FormFieldProps<T extends Record<string, any>> {
  column: FormSchema<T>;
}

export const MarkdownFormField = <T extends Record<string, any>>({
  column,
}: FormFieldProps<T>) => {
  const { name, title, fieldProps = {} as any, rules } = column;
  const { inputPlaceholder } = useFormPlaceholders(title);

  return (
    <MarkdownField
      field={name}
      label={title}
      rules={rules}
      style={{ width: '100%' }}
      placeholder={inputPlaceholder}
      {...fieldProps}
    />
  );
};
