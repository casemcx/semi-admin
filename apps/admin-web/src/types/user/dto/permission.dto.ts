import type { QueryPage } from '@packages/share';
import type { Permission } from '../permission';

export type PermissionQuery = QueryPage<Permission>;

export type CreatePermissionDto = Omit<
  Permission,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export type UpdatePermissionDto = Partial<CreatePermissionDto> & {
  id: string;
};
