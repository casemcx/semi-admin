import { Outlet } from '@modern-js/runtime/router';
import { Galaxy, SplashCursor } from '@packages/ui';

export default function Layout() {
  return (
    <div className="auth-layout relative w-screen h-screen bg-black m-0 p-0">
      <SplashCursor />
      <Galaxy className="absolute inset-0" />
      <div className="auth-layout-content absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Outlet />
      </div>
    </div>
  );
}
