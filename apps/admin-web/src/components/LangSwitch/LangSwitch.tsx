import { langs } from '@/locales';
import { IconLanguage } from '@douyinfe/semi-icons';
import { Dropdown } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';

const LanguageSwitch = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
  };

  const getCurrentLanguageLabel = () => {
    return langs.find(lang => lang.key === i18n.language)?.label || '简体中文';
  };

  return (
    <Dropdown
      trigger="click"
      position="bottomRight"
      menu={langs.map(lang => ({
        node: 'item',
        key: lang.key,
        name: lang.label,
        onClick: () => handleLanguageChange(lang.key),
      }))}
    >
      <div className="flex items-center cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
        <IconLanguage size="large" className="mr-2" />
        <span className="text-sm">{getCurrentLanguageLabel()}</span>
      </div>
    </Dropdown>
  );
};

export default LanguageSwitch;
