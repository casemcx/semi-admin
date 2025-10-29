import { Form } from '@douyinfe/semi-ui';
import type { FormSchema } from '@packages/components/types';
import { useFormPlaceholders } from '../../hooks';

interface FormFieldProps<T extends Record<string, any>> {
  column: FormSchema<T>;
}

export const CascaderField = <T extends Record<string, any>>({
  column,
}: FormFieldProps<T>) => {
  const { name, title, fieldProps = {} as any, rules } = column;
  const { inputPlaceholder } = useFormPlaceholders(title ?? '');

  return (
    <Form.Cascader
      field={name}
      label={title}
      placeholder={inputPlaceholder}
      style={{ width: '100%' }}
      rules={rules}
      {...fieldProps}
    />
  );
};
