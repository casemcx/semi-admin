import type { QueryPage } from '@packages/share';
import type { Role } from '../role';

export type RoleQuery = QueryPage<Role>;

export type CreateRoleDto = Omit<
  Role,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export type UpdateRoleDto = Partial<CreateRoleDto> & {
  id: string;
};
