import { Outlet } from '@modern-js/runtime/router';
import './tailwind.css';
import './index.css';

// 初始化i18n
import '@/locales';

export default function Layout() {
  return (
    <div className="w-full h-full m-0 p-0">
      <Outlet />
    </div>
  );
}
