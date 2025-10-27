import type { LoginDto, LoginResponse } from '@/types/user';

export const login = (data: LoginDto) => {
  return request.post<LoginResponse>('/api/user/login', data);
};
