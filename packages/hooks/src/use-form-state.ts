import { useCallback, useMemo, useState } from 'react';

export type FormMode = 'create' | 'edit';

export interface UseModalFormStateOptions<T> {
  onSubmit?: (values: T, mode: FormMode) => Promise<any>;
  onCancel?: () => void;
  onBeforeOpen?: (mode: FormMode, record?: T) => void;
  onAfterClose?: () => void;
}

export const useModalFormState = <
  T extends Record<string, any> = Record<string, any>,
>(
  initialValues?: Partial<T>,
  options?: UseModalFormStateOptions<T>,
) => {
  const [formValues, setFormValues] = useState<Partial<T>>(initialValues ?? {});
  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState<FormMode>('create');
  const [loading, setLoading] = useState(false);

  const isEdit = useMemo(() => mode === 'edit', [mode]);

  const openCreate = useCallback(() => {
    setMode('create');
    setModalVisible(true);
    setFormValues(initialValues ?? {});
    options?.onBeforeOpen?.('create');
  }, [initialValues, options]);

  const openEdit = useCallback(
    (record: T) => {
      setMode('edit');
      setModalVisible(true);
      setFormValues(record);
      options?.onBeforeOpen?.('edit', record);
    },
    [options],
  );

  const submit = useCallback(
    async (values: T) => {
      if (options?.onSubmit) {
        setLoading(true);
        try {
          await options.onSubmit(values, mode);
          close();
        } catch (error) {
          console.error('Form submission error:', error);
          throw error;
        } finally {
          setLoading(false);
        }
      }
    },
    [mode, options],
  );

  const close = useCallback(() => {
    setModalVisible(false);
    setFormValues(initialValues ?? {});
    setMode('create');
    options?.onCancel?.();
    options?.onAfterClose?.();
  }, [initialValues, options]);

  return {
    // Form state
    formValues,
    mode,
    isEdit,

    // Modal state
    modalVisible,
    loading,

    // Actions
    openCreate,
    openEdit,
    submit,
    close,
  };
};
