import type { FormSchema } from '@packages/components/types';
import { DateField, DateTimeField, TimeField } from './fields/date-field';
import { ImageUploadField } from './fields/image';
import {
  InputField,
  NumberField,
  PasswordField,
  TextAreaField,
} from './fields/input-field';
import MarkdownFormField from './fields/markdown';
import {
  CascaderField,
  CheckboxGroupField,
  RadioGroupField,
  SelectField,
  TreeSelectField,
} from './fields/select-field';
import { SwitchField, UploadField } from './fields/special-field';

interface FormFieldProps<T extends Record<string, any>> {
  column: FormSchema<T>;
}

export const FormField = <T extends Record<string, any>>({
  column,
}: FormFieldProps<T>) => {
  const { type = 'input' } = column;

  if (column.renderFormItem) {
    return column.renderFormItem();
  }

  switch (type) {
    case 'input':
      return <InputField column={column} />;
    case 'password':
      return <PasswordField column={column} />;
    case 'textarea':
      return <TextAreaField column={column} />;
    case 'number':
      return <NumberField column={column} />;
    case 'select':
      return <SelectField column={column} />;
    case 'date':
      return <DateField column={column} />;
    case 'time':
      return <TimeField column={column} />;
    case 'datetime':
      return <DateTimeField column={column} />;
    case 'switch':
      return <SwitchField column={column} />;
    case 'checkbox':
      return <CheckboxGroupField column={column} />;
    case 'radio':
      return <RadioGroupField column={column} />;
    case 'upload':
      return <UploadField column={column} />;
    case 'image':
      return <ImageUploadField {...column} />;
    case 'cascader':
      return <CascaderField column={column} />;
    case 'treeSelect':
      return <TreeSelectField column={column} />;
    case 'markdown':
      return (
        <MarkdownFormField
          id={String(column.name)}
          field={String(column.name)}
          {...(column.fieldProps || {})}
        />
      );
    default:
      // 默认使用 Input
      return <InputField column={column} />;
  }
};
