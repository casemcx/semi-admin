import { Form } from '@douyinfe/semi-ui';
import { useFormPlaceholders } from '../../hooks';

import type { FormSchema } from '../../types';

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

export const RadioGroupField = <T extends Record<string, any>>({
  column,
}: FormFieldProps<T>) => {
  const { name, title, fieldProps = {} as any, rules } = column;

  return (
    <Form.RadioGroup field={name} label={title} rules={rules} {...fieldProps} />
  );
};

export const CheckboxGroupField = <T extends Record<string, any>>({
  column,
}: FormFieldProps<T>) => {
  const { name, title, fieldProps = {} as any, rules } = column;

  return (
    <Form.CheckboxGroup
      field={name}
      label={title}
      rules={rules}
      {...fieldProps}
    />
  );
};

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

export const TreeSelectField = <T extends Record<string, any>>({
  column,
}: FormFieldProps<T>) => {
  const { name, title, fieldProps = {} as any, rules } = column;
  const { inputPlaceholder } = useFormPlaceholders(title ?? '');

  return (
    <Form.TreeSelect
      field={name}
      label={title}
      placeholder={inputPlaceholder}
      style={{ width: '100%' }}
      rules={rules}
      {...fieldProps}
    />
  );
};
