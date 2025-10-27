import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next, useTranslation } from 'react-i18next';

import enUS from './en-US';
import zhCN from './zh-CN';

export const resources = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

export const availableLanguages = [
  { key: 'zh-CN', label: '简体中文' },
  { key: 'en-US', label: 'English' },
];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh-CN',
    lng: 'zh-CN',
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

export const useLocal = () => {
  const { t } = useTranslation();

  return {
    get(key: keyof typeof zhCN.translation, config?: any) {
      return t(key, config) as string;
    },

    /**
     * 请输入{{field}}
     * @param field 字段名
     * @returns
     */
    pleaseEnterField: (field: string) =>
      t('common.pleaseEnterField', { field }),

    /**
     * 请选择{{field}}
     * @param field 字段名
     * @returns
     */
    pleaseSelectField: (field: string) =>
      t('common.pleaseSelectField', { field }),

    /**
     * 请上传{{field}}
     * @param field 字段名
     * @returns
     */
    pleaseUploadField: (field: string) =>
      t('common.pleaseUploadField', { field }),

    /**
     * {{field}}不能为空
     * @param field 字段名
     * @returns
     */
    fieldRequired: (field: string) => t('common.fieldRequired', { field }),

    /**
     * 格式不正确
     * @returns
     */
    invalidFormat: () => t('common.invalidFormat'),

    /**
     * 请输入有效的邮箱地址
     * @returns
     */
    emailInvalid: () => t('common.emailInvalid'),

    /**
     * 请输入有效的手机号码
     * @returns
     */
    phoneInvalid: () => t('common.phoneInvalid'),

    /**
     * 密码至少需要{{min}}位字符
     * @param min 最小长度
     * @returns
     */
    passwordMinLength: (min: number) => t('common.passwordMinLength', { min }),

    /**
     * 两次输入的密码不一致
     * @returns
     */
    passwordMismatch: () => t('common.passwordMismatch'),

    /**
     * 至少需要{{min}}个字符
     * @param min 最小长度
     * @returns
     */
    minLength: (min: number) => t('common.minLength', { min }),
  };
};

export default i18n;
