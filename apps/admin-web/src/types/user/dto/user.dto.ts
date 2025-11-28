import type { QueryPage } from '@packages/share';
import type { User } from '../user';

export type UserQuery = QueryPage<User>;

export type CreateUserDto = Omit<
  User,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
  | 'lastLoginTime'
  | 'lastLoginIp'
> & {
  password: string; // 创建用户时密码是必需的
};

export type UpdateUserDto = Partial<Omit<CreateUserDto, 'password'>> & {
  id: string;
  password?: string; // 更新时密码是可选的
};
