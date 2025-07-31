// src/interfaces/role.interface.ts

import { Permission } from './auth';
import { IStoreUser } from './store-user.interface';

export interface IRole {
  id: number;
  name: string;
  description: string | null;
  permissions?: Permission[]; // If you have a Permission entity
  createdAt: string;
  updatedAt: string;
  createdBy?: IStoreUser; // If you want to include who created the role
}
