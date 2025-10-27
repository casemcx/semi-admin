import { Button, Col, Form, Row, Space } from '@douyinfe/semi-ui';
import { useRequest } from 'ahooks';
import { useCallback, useState } from 'react';
import type { ProFormProps } from '../types';
import { FieldRender } from './field-renderer';

import { clsx } from '@packages/utils';

const ProForm = <T extends Record<string, any> = any>({
  columns = [],
  children,
  footer,
  showSubmit = true,
  showReset = true,
  submitText = '提交',
  resetText = '重置',
  colProps = { span: 24 },
  gutter = 16,
  actionsAlign = 'end',
  readonly = false,
  onSubmit,
  getFormApi,
  submitButtonProps,
  resetButtonProps,
  ...formProps
}: ProFormProps<T>) => {
  const { loading, run } = useRequest(
    async (values: any) => onSubmit?.(values),
    {
      manual: true,
    },
  );

  const renderFormContent = useCallback(() => {
    if (children) {
      return children;
    }

    if (columns.length === 0) {
      return null;
    }

    return (
      <Row gutter={readonly ? 42 : gutter}>
        {columns.map((column, index) => (
          <Col
            {...colProps}
            {...column.colProps}
            {...(readonly && !column.colProps ? { span: 24 } : {})}
            key={String(column.name)}
            className="py-2"
          >
            <FieldRender
              column={{ ...column, readonly: readonly || column.readonly }}
              index={index}
            />
          </Col>
        ))}
      </Row>
    );
  }, [columns, children, gutter, colProps, readonly]);

  const renderActions = () => {
    // 只读模式下不显示操作按钮
    if (readonly || (!showSubmit && !showReset)) {
      return null;
    }

    const justifyClass =
      actionsAlign === 'start'
        ? 'justify-start'
        : actionsAlign === 'center'
          ? 'justify-center'
          : 'justify-end';

    return (
      <div className={`flex w-full ${justifyClass} pt-4`}>
        <Space>
          {showReset && (
            <Button htmlType="reset" disabled={loading} {...resetButtonProps}>
              {resetText}
            </Button>
          )}
          {showSubmit && (
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              {...submitButtonProps}
            >
              {submitText}
            </Button>
          )}
        </Space>
      </div>
    );
  };

  const handleGetFormApi = (formApi: any) => {
    getFormApi?.(formApi);
  };

  return (
    <Form
      onSubmit={run}
      getFormApi={handleGetFormApi}
      {...formProps}
      className={`${formProps.className || ''} ${readonly ? 'readonly-form' : ''}`}
    >
      {renderFormContent()}
      {renderActions()}
      {footer}
    </Form>
  );
};

ProForm.displayName = 'ProForm';

export default ProForm;
