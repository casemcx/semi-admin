import type { LoginDto, UserInfo, UserStore } from '@/types/user';
import { merge } from 'lodash-es';

import { getUserInfo, login as loginApi } from '@/api';

import { ResultCode } from '@packages/share';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * 用户状态管理store
 * 使用zustand进行状态管理，并通过persist中间件实现本地缓存
 */
const _useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      /**
       * @description 用户信息
       */
      userInfo: undefined,
      token: undefined,
      isAuthenticated: false,
      loading: false,
      roles: [],
      permissions: [],

      /**
       * @description 设置用户信息
       */
      setUserInfo: (userInfo?: UserInfo) => {
        set({ userInfo });
      },

      /**
       * @description 设置token
       */
      setToken: (token?: string) => {
        set({ token });
      },

      /**
       * @description 更新用户信息
       */
      updateUserInfo: (updates: Partial<UserInfo>) => {
        const currentUserInfo = get().userInfo;
        if (currentUserInfo) {
          set({
            userInfo: merge(currentUserInfo, updates),
          });
        }
      },

      /**
       * @description 设置加载状态
       */
      setLoading: (loading: boolean) => {
        set({ loading });
      },

      /**
       * @description 设置角色
       */
      setRoles: (roles: string[]) => {
        set({ roles });
      },

      /**
       * @description 设置权限
       */
      setPermissions: (permissions: string[]) => {
        set({ permissions });
      },
    }),
    {
      name: 'user-storage', // 存储的key名称
      storage: createJSONStorage(() => localStorage), // 使用localStorage
      // 只持久化关键数据，loading状态不需要持久化
      partialize: state => ({
        userInfo: state.userInfo,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export const getToken = () => {
  return _useUserStore.getState().token;
};

export const useUserStore = () => {
  const userStore = _useUserStore();

  /**
   * @description 登录
   * @param loginDto LoginDto
   * @returns Promise<void>
   */
  const login = async (loginDto: LoginDto) => {
    const response = await loginApi(loginDto);
    userStore.setLoading(true);
    try {
      if (response.code === ResultCode.SUCCESS) {
        const token = response.data;

        userStore.setToken(token);

        // 获取角色和权限
        const result = await getUserInfo();
        if (result.code === ResultCode.SUCCESS) {
          userStore.setUserInfo(result.data);
          userStore.setRoles(result.data.roles);
          userStore.setPermissions(result.data.permissions);
        } else {
          return Promise.reject(result.msg);
        }
      } else {
        return Promise.reject(response.msg);
      }
    } finally {
      userStore.setLoading(false);
    }
  };

  /**
   * @description 退出登录
   * @returns Promise<void>
   */
  const logout = () => {
    userStore.setUserInfo();
    userStore.setToken();
    userStore.setRoles([]);
    userStore.setPermissions([]);
    userStore.setLoading(false);
  };

  return {
    ...userStore,
    login,
    logout,
  };
};
