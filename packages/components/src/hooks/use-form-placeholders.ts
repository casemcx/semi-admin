import { useMemo } from 'react';

import { useConfigStore } from '@/provider';

export const useFormPlaceholders = (title?: string) => {
  const t = useConfigStore(state => state.t);

  const selectPlaceholder = useMemo(() => {
    return t('pleaseSelect', { field: title || '' });
  }, [t, title]);

  const inputPlaceholder = useMemo(() => {
    return t('pleaseEnter', { field: title || '' });
  }, [t, title]);

  const uploadPlaceholder = useMemo(() => {
    return t('pleaseUpload', { field: title || '' });
  }, [t, title]);

  return {
    selectPlaceholder,
    inputPlaceholder,
    uploadPlaceholder,
  };
};
