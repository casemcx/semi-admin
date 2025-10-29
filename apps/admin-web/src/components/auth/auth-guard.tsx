import type { Permission } from '@/configs/pemission';
import { useUserStore } from '@/stores/user';
import { Navigate } from '@modern-js/runtime/router';
import type { PropsWithChildren } from 'react';
import type { FC } from 'react';

export interface AuthGuardProps {
  /**
   * @description 权限列表
   */
  permissions?: Permission[];

  /**
   * @description 权限关系
   * @default 'any'
   */
  relationship?: 'any' | 'all';

  /**
   * @description 断言函数
   */
  assert?: (permissions: Permission[]) => boolean;

  /**
   * @description 未登陆是否自动重定向
   * @default true
   */
  autoRedirect?: boolean;

  /**
   * @description 重定向路径
   * @default '/login'
   */
  redirectPath?: string;
}

const AuthGuard: FC<PropsWithChildren<AuthGuardProps>> = ({
  children,
  permissions,
  relationship = 'any',
  assert,
  autoRedirect = true,
  redirectPath = '/login',
}) => {
  const userStore = useUserStore();

  if (!userStore.isAuthenticated && autoRedirect) {
    return <Navigate to={redirectPath} />;
  }

  if (!userStore.isAuthenticated) {
    return <div />;
  }

  if (assert?.(userStore.permissions)) {
    return children;
  }

  if (
    relationship === 'any' &&
    permissions?.some(permission => userStore.permissions.includes(permission))
  ) {
    return children;
  }

  if (
    relationship === 'all' &&
    permissions?.every(permission => userStore.permissions.includes(permission))
  ) {
    return children;
  }

  return <div />;
};

export default AuthGuard;
