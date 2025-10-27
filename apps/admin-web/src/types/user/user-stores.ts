import type { UserInfo } from './user-info';

/**
 * @description 用户状态store类型
 */
export type UserState = {
  /**
   * @description 用户信息
   */
  userInfo: UserInfo | null;
  /**
   * @description 认证token
   */
  token: string | null;
  /**
   * @description 是否已登录
   */
  isAuthenticated: boolean;
  /**
   * @description 是否正在加载
   */
  loading: boolean;
};

/**
 * @description 用户状态操作类型
 */
export type UserActions = {
  /**
   * @description 设置用户信息
   */
  setUserInfo: (userInfo: UserInfo) => void;
  /**
   * @description 设置token
   */
  setToken: (token: string) => void;
  /**
   * @description 更新用户信息
   */
  updateUserInfo: (updates: Partial<UserInfo>) => void;
  /**
   * @description 设置加载状态
   */
  setLoading: (loading: boolean) => void;
};

/**
 * @description 完整的用户store类型
 */
export type UserStore = UserState & UserActions;
