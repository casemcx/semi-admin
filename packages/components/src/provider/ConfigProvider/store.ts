import { create } from 'zustand';

import { locales } from './locales';
import type { ConfigStore, Locale, LocaleMessages } from './types';

const createTranslator = (messages: LocaleMessages) => {
  return (
    key: keyof LocaleMessages,
    params?: Record<string, string | number>,
  ): string => {
    let text = messages[key] || key;
    if (params) {
      for (const [paramKey, paramValue] of Object.entries(params)) {
        text = text.replace(`{${paramKey}}`, String(paramValue));
      }
    }
    return text;
  };
};

export const useConfigStore = create<ConfigStore>((set, get) => ({
  locale: 'zh-CN',
  messages: locales['zh-CN'],
  t: (key, params) => createTranslator(get().messages)(key, params),
}));

export const initLocale = (locale: Locale) => {
  useConfigStore.setState({
    locale,
    messages: locales[locale],
  });
};
