import { Form } from '@douyinfe/semi-ui';

import type { FormSchema } from '../../types';

interface FormFieldProps<T extends Record<string, any>> {
  column: FormSchema<T>;
}

export const SwitchField = <T extends Record<string, any>>({
  column,
}: FormFieldProps<T>) => {
  const { name, title, fieldProps = {} as any, rules } = column;

  return (
    <Form.Switch field={name} label={title} rules={rules} {...fieldProps} />
  );
};

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

export const ImageUploadField = <T extends Record<string, any>>({
  column,
}: FormFieldProps<T>) => {
  const { name, title, fieldProps = {} as any, rules } = column;

  // 图片上传的默认配置
  const defaultImageProps = {
    accept: 'image/*',
    listType: 'picture-card' as const,
    multiple: false,
    maxCount: 1,
    showPreview: true,
    action: '/api/upload',
  };

  // 合并用户配置和默认配置
  const mergedFieldProps = {
    ...defaultImageProps,
    ...fieldProps,
  };

  return (
    <Form.Upload
      field={name}
      label={title}
      rules={rules}
      {...mergedFieldProps}
    />
  );
};
