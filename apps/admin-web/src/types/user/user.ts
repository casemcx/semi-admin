import type { Status } from '@packages/share';

export interface User {
  id: string;
  username: string;
  password?: string; // 前端一般不需要显示密码
  email?: string;
  phone?: string;
  nickname?: string;
  avatar?: string;
  status: Status;
  lastLoginTime?: Date;
  lastLoginIp?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
