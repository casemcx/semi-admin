import type { LoginDto, UserInfo } from '@/types/user';

/**
 * @description 登录
 * @param data LoginDto
 * @returns string
 */
export const login = (data: LoginDto) => {
  return request.post<string>('/api/user/login', data);
};

/**
 * @description 获取用户信息
 * @returns UserInfo
 */
export const getUserInfo = () => {
  return request.get<UserInfo>('/api/user/info');
};
