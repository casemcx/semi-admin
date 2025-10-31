import type { UserInfo } from '../user-info';

export interface LoginDto {
  /**
   * 用户名
   */
  username: string;
  /**
   * 密码
   */
  password: string;
}

export interface LoginResponse {
  /**
   * 用户信息
   */
  userInfo: UserInfo;
  /**
   * 认证token
   */
  token: string;
}
