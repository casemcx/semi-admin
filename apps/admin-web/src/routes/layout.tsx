import { Outlet } from '@modern-js/runtime/router';

import { ConfigProvider } from '@douyinfe/semi-ui';
import '@douyinfe/semi-ui/dist/css/semi.min.css';
import zh_CN from '@douyinfe/semi-ui/lib/es/locale/source/zh_CN';

import './tailwind.css';
import './index.css';
import '@packages/components/styles.css';

// 初始化i18n
import '@/locales';

export default function Layout() {
  return (
    <ConfigProvider locale={zh_CN}>
      <div className="w-full h-full m-0 p-0">
        <Outlet />
      </div>
    </ConfigProvider>
  );
}
