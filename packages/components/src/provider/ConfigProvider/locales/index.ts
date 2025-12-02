import type { Locale, LocaleMessages } from '../types';
import enUS from './en-US';
import zhCN from './zh-CN';

export const locales: Record<Locale, LocaleMessages> = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

export { zhCN, enUS };
