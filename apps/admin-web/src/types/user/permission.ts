import type { Status } from '@packages/share';

export enum PermissionType {
  MENU = 1,
  BUTTON = 2,
  API = 3,
}

export interface Permission {
  id: string;
  parentId: string;
  name: string;
  code: string;
  type: PermissionType;
  path?: string;
  component?: string;
  icon?: string;
  method?: string;
  apiPath?: string;
  sort: number;
  status: Status;
  isSystem: Status;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  // Relations
  parent?: Permission | null;
  children?: Permission[];
}
