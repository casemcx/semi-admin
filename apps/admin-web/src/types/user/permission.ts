import type { Status } from '@packages/share';

export enum PermissionType {
  MENU = 'menu',
  BUTTON = 'button',
  API = 'api',
}

export interface Permission {
  id: string;
  parentId: string;
  name: string;
  code: string;
  type: string;
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
