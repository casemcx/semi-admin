import type { Status } from '@packages/share';

export interface Role {
  id: string;
  name: string;
  code: string;
  description?: string;
  sort: number;
  status: Status;
  isSystem: Status;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
