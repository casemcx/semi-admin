import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useFormPlaceholders = (title?: string) => {
  const { t } = useTranslation();

  const selectPlaceholder = useMemo(() => {
    return t('common.pleaseSelectField', {
      field: title,
    });
  }, [t, title]);

  const inputPlaceholder = useMemo(() => {
    return t('common.pleaseEnterField', {
      field: title,
    });
  }, [t, title]);

  const uploadPlaceholder = useMemo(() => {
    return t('common.pleaseUploadField', {
      field: title,
    });
  }, [t, title]);

  return {
    selectPlaceholder,
    inputPlaceholder,
    uploadPlaceholder,
  };
};
