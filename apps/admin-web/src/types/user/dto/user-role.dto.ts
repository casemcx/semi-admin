import type { QueryPage } from '@packages/share';
import type { UserRole } from '../user-role';

export type UserRoleQuery = QueryPage<UserRole>;

export interface AssignRolesToUserDto {
  userId: string;
  roleIds: string[];
  createdBy?: string;
}
