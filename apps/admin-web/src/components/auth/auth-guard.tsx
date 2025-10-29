import { useUserStore } from '@/stores/user';
import { Navigate } from '@modern-js/runtime/router';
import type { PropsWithChildren } from 'react';
import type { FC } from 'react';

const AuthGuard: FC<PropsWithChildren> = ({ children }) => {
  const userStore = useUserStore();

  if (!userStore.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AuthGuard;
