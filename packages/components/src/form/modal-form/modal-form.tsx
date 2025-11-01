import type { FormSchema } from '@/types';
import { Button, Modal, Space } from '@douyinfe/semi-ui';
import { useState } from 'react';
import { ProForm } from '../pro-form';

import type { ModalFormProps } from './types';

function ModalForm<T extends Record<string, any>>({
  columns,
  initialValues,
  loading = false,
  okText = '保存',
  cancelText = '取消',
  resetText = '重置',
  showReset = true,
  readonly = false,
  onSubmit,
  onCancel,
  onReset,
  colProps,
  gutter,
  getFormApi,
  formName = 'modal-form',
  formProps,
  children,
  className,
  ...modalProps
}: ModalFormProps<T>) {
  const [internalLoading, setInternalLoading] = useState(false);

  const handleSubmit = async (values: T) => {
    if (!onSubmit) {
      return;
    }

    try {
      setInternalLoading(true);
      const result = onSubmit(values);

      if (result && typeof result.then === 'function') {
        await result;
      }
    } catch (error) {
      console.error('Modal form submit error:', error);
      throw error;
    } finally {
      setInternalLoading(false);
    }
  };

  const handleReset = () => {
    onReset?.();
  };

  const submitLoading = internalLoading || loading;
  const isDisabled = internalLoading || loading;

  return (
    <Modal
      onCancel={onCancel}
      footer={null}
      bodyStyle={{ maxHeight: 'calc(80vh - 120px)', overflowY: 'auto' }}
      className={className}
      {...modalProps}
    >
      <div className="modal-form-wrapper w-full h-full overflow-hidden flex flex-col">
        <div className="modal-form-content flex-1 overflow-y-auto h-0">
          <ProForm<T>
            id={formName}
            columns={columns as FormSchema<T>[]}
            initValues={initialValues as any}
            onSubmit={handleSubmit}
            colProps={colProps}
            gutter={gutter}
            getFormApi={getFormApi}
            readonly={readonly}
            showSubmit={false}
            showReset={false}
            footer={
              readonly ? (
                <div className="flex w-full justify-end pt-6 px-6 pb-6">
                  <Button onClick={onCancel}>关闭</Button>
                </div>
              ) : (
                <div className="flex w-full justify-end pt-6 px-6 pb-6">
                  <Space>
                    {showReset && (
                      <Button
                        htmlType="reset"
                        onClick={handleReset}
                        disabled={isDisabled}
                      >
                        {resetText}
                      </Button>
                    )}
                    <Button onClick={onCancel} disabled={isDisabled}>
                      {cancelText}
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      form={formName}
                      loading={submitLoading}
                    >
                      {okText}
                    </Button>
                  </Space>
                </div>
              )
            }
            {...formProps}
          >
            {children}
          </ProForm>
        </div>
        <div className="h-[24px]" />
      </div>
    </Modal>
  );
}

export default ModalForm;
