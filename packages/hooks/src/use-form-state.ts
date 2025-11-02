import { useState } from 'react';

export interface UseTableFormStateOptions<T> {
  onSubmit?: (values: T, isEdit: boolean) => Promise<any>;
  onCancel?: () => void;
  onReset?: () => void;
}

export const useTableFormState = <
  T extends Record<string, any> = Record<string, any>,
>(
  initialValues?: Partial<T>,
  options?: UseTableFormStateOptions<T>,
) => {
  const [formValues, setFormValues] = useState<Partial<T>>(initialValues ?? {});
  const [modalVisible, setModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAdd = () => {
    setModalVisible(true);
    setFormValues({});
    setIsEdit(false);
  };

  const handleEdit = (record: T) => {
    setModalVisible(true);
    setFormValues(record);
    setIsEdit(true);
  };

  const handleModalOk = async (values: T) => {
    if (options?.onSubmit) {
      setLoading(true);
      try {
        await options.onSubmit(values, isEdit);
        handleModalCancel();
      } catch (error) {
        console.error('Form submission error:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setFormValues({});
    setIsEdit(false);
    options?.onCancel?.();
  };

  const handleReset = () => {
    setFormValues({});
    options?.onReset?.();
  };

  return {
    // Form state
    formValues,
    setFormValues,

    // Modal state
    modalVisible,
    setModalVisible,
    isEdit,
    loading,

    // Actions
    handleAdd,
    handleEdit,
    handleModalOk,
    handleModalCancel,
    handleReset,
  };
};
