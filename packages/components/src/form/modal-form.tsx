import { Button, Modal, Space } from '@douyinfe/semi-ui';
import type { ComponentPropsWithoutRef } from 'react';
import { useState } from 'react';

import type { FormSchema, ProFormProps } from '../types/form';
import ProForm from './pro-form';

type ModalProps = ComponentPropsWithoutRef<typeof Modal>;

interface ModalFormProps<T extends Record<string, any>>
  extends Omit<ModalProps, 'onOk' | 'children' | 'footer'> {
  /** 表单字段配置 */
  columns?: FormSchema<T>[] | Array<FormSchema<T> & Record<string, any>>;
  /** 初始值 */
  initialValues?: Partial<T>;
  /** 是否加载中 */
  loading?: boolean;
  /** 确认按钮文字 */
  okText?: string;
  /** 取消按钮文字 */
  cancelText?: string;
  /** 重置按钮文字 */
  resetText?: string;
  /** 是否显示重置按钮 */
  showReset?: boolean;
  /** 表单项的栅格配置 */
  colProps?: ProFormProps<T>['colProps'];
  /** 表单项之间的间距 */
  gutter?: ProFormProps<T>['gutter'];
  /** 是否为只读模式（详情展示模式） */
  readonly?: boolean;
  /** 表单提交 */
  onSubmit?: (values: T) => void | Promise<void>;
  /** 重置表单 */
  onReset?: () => void;
  /** 获取表单API */
  getFormApi?: ProFormProps<T>['getFormApi'];

  /**
   * @description 表单名称
   * @default "modal-form"
   */
  formName?: string;
}

export function ModalForm<T extends Record<string, any>>({
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
  // ProForm props
  colProps,
  gutter,
  getFormApi,
  formName = 'modal-form',
  ...modalProps
}: ModalFormProps<T>) {
  const [internalLoading, setInternalLoading] = useState(false);

  const handleSubmit = async (values: T) => {
    if (!onSubmit) return;

    try {
      setInternalLoading(true);
      const result = onSubmit(values);

      // 如果返回的是 Promise，等待其完成
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

  // 提交按钮显示 loading，其他按钮显示 disabled
  const submitLoading = internalLoading || loading;
  const isDisabled = internalLoading || loading;

  return (
    <Modal
      onCancel={onCancel}
      footer={null}
      bodyStyle={{ maxHeight: 'calc(80vh - 120px)', overflowY: 'auto' }}
      {...modalProps}
    >
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
      />
    </Modal>
  );
}
