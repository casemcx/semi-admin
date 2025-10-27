import { Outlet } from '@modern-js/runtime/router';
import './tailwind.css';

export default function Layout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
