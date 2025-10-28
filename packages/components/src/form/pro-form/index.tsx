import { Button, Col, Form, Row, Space } from '@douyinfe/semi-ui';
import { useRequest } from 'ahooks';
import { useCallback, useMemo } from 'react';

import { clsx } from '@packages/utils';

import { FieldRender } from '../field-renderer';

import type { ProFormProps } from './types';

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
  className,
  ...formProps
}: ProFormProps<T>) => {
  const { loading, run } = useRequest(
    async (values: any) => onSubmit?.(values),
    { manual: true },
  );

  const formClassName = useMemo(
    () => clsx(className, { 'readonly-form': readonly }),
    [className, readonly],
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
  }, [children, columns, colProps, gutter, readonly]);

  const renderActions = useCallback(() => {
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
  }, [
    actionsAlign,
    loading,
    resetButtonProps,
    resetText,
    showReset,
    showSubmit,
    submitButtonProps,
    submitText,
    readonly,
  ]);

  const handleGetFormApi = useCallback(
    (formApi: any) => {
      getFormApi?.(formApi);
    },
    [getFormApi],
  );

  return (
    <Form
      onSubmit={run}
      getFormApi={handleGetFormApi}
      className={formClassName}
      {...formProps}
    >
      {renderFormContent()}
      {renderActions()}
      {footer}
    </Form>
  );
};

ProForm.displayName = 'ProForm';

export default ProForm;
export type { ProFormProps } from './types';
