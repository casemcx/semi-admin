import type { Role } from './role';
import type { Status } from '@packages/share';

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
