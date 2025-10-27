import type {
  LoginDto,
  LoginResponse,
  UserInfo,
  UserStore,
} from '@/types/user';
import { merge } from 'lodash-es';

import { login as loginApi } from '@/api';

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
      // 初始状态
      userInfo: null,
      token: null,
      isAuthenticated: false,
      loading: false,

      // 设置用户信息
      setUserInfo: (userInfo: UserInfo) => {
        set({ userInfo });
      },

      // 设置token
      setToken: (token: string) => {
        set({ token });
      },

      // 更新用户信息
      updateUserInfo: (updates: Partial<UserInfo>) => {
        const currentUserInfo = get().userInfo;
        if (currentUserInfo) {
          set({
            userInfo: merge(currentUserInfo, updates),
          });
        }
      },

      // 设置加载状态
      setLoading: (loading: boolean) => {
        set({ loading });
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

  const login = async (loginDto: LoginDto) => {
    const response = await loginApi(loginDto);
    userStore.setLoading(true);
    try {
      if (response.code === ResultCode.SUCCESS) {
        const { userInfo, token } = response.data;

        userStore.setToken(token);
        userStore.setUserInfo(userInfo);
      } else {
        return Promise.reject(response.msg);
      }
    } finally {
      userStore.setLoading(false);
    }
  };

  return {
    ...userStore,
    login,
  };
};
