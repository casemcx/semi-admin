import type { Status } from '@packages/share';
import type { Role } from './role';

export interface UserRole {
  id: string;
  userId: string;
  roleId: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  role?: Role;
}
