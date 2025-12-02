export type Locale = 'zh-CN' | 'en-US';

export interface LocaleMessages {
  submit: string;
  reset: string;
  search: string;
  save: string;
  cancel: string;
  close: string;
  yes: string;
  no: string;
  noImage: string;
  preview: string;
  viewImage: string;
  pleaseSelect: string;
  pleaseEnter: string;
  pleaseUpload: string;
}

export interface ConfigStore {
  locale: Locale;
  messages: LocaleMessages;
  t: (
    key: keyof LocaleMessages,
    params?: Record<string, string | number>,
  ) => string;
}

export interface ConfigProviderProps {
  children: React.ReactNode;
  locale?: Locale;
}
