import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { forwardRef } from 'react';

import { Col, Row } from '@douyinfe/semi-ui';

import type { FormSchema } from '../types/form';
import { FieldRender } from './field-renderer';
import ProForm from './pro-form';

export interface SchemaFormProps<T extends Record<string, any> = any>
  extends Omit<
    ComponentPropsWithoutRef<typeof ProForm<T>>,
    'columns' | 'children'
  > {
  /**
   * @description 表单字段配置数组
   */
  columns: FormSchema<T>[] | Array<FormSchema<T> & Record<string, any>>;

  /**
   * @description 是否只渲染字段内容，不包括 Form 包装和按钮
   * @default false
   */
  renderFieldsOnly?: boolean;

  /**
   * @description 表单项的栅格配置
   * @default { span: 24 }
   */
  colProps?: {
    span?: number;
    offset?: number;
    push?: number;
    pull?: number;
    order?: number;
  };

  /**
   * @description 表单项之间的间距
   * @default 16
   */
  gutter?: number | [number, number];
}

const SchemaForm = <T extends Record<string, any> = any>({
  columns,
  renderFieldsOnly = false,
  colProps = { span: 24 },
  gutter = 16,
  ...props
}: SchemaFormProps<T>) => {
  const renderFormContent = () => {
    if (columns.length === 0) {
      return null;
    }

    return (
      <Row gutter={gutter}>
        {columns.map((column, index) => (
          <Col {...colProps} {...column.colProps} key={String(column.name)}>
            <FieldRender column={column} index={index} />
          </Col>
        ))}
      </Row>
    );
  };

  // 如果只渲染字段内容，直接返回字段部分
  if (renderFieldsOnly) {
    return renderFormContent();
  }

  // 否则使用 ProForm 包装
  return (
    <ProForm<T>
      columns={columns as FormSchema<T>[]}
      colProps={colProps}
      gutter={gutter}
      {...props}
    />
  );
};

SchemaForm.displayName = 'SchemaForm';

export default SchemaForm;
