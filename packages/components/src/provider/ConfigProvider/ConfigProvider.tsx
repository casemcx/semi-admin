import { useEffect } from 'react';

import { initLocale } from './store';
import type { ConfigProviderProps } from './types';

const ConfigProvider = ({
  children,
  locale = 'zh-CN',
}: ConfigProviderProps) => {
  useEffect(() => {
    initLocale(locale);
  }, [locale]);

  return <>{children}</>;
};

export default ConfigProvider;
