import { Col, Row } from '@douyinfe/semi-ui';
import { useMemo } from 'react';

import { FieldRender } from '../field-renderer';
import ProForm from '../pro-form';
import type { FormSchema } from '../types';

import type { SchemaFormProps } from './types';

const SchemaForm = <T extends Record<string, any> = any>({
  columns,
  renderFieldsOnly = false,
  colProps = { span: 24 },
  gutter = 16,
  ...props
}: SchemaFormProps<T>) => {
  const formContent = useMemo(() => {
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
  }, [colProps, columns, gutter]);

  if (renderFieldsOnly) {
    return formContent;
  }

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
export type { SchemaFormProps } from './types';
