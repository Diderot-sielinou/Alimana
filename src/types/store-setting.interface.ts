// src/interfaces/store-setting.interface.ts

export interface IStoreSetting {
  id: number;
  key: string;
  value: string; // Settings values might be stringified JSON or simple strings
  storeId: number;
  // store?: IStore;
  createdById: number;
  // createdBy?: IStoreUser;
  createdAt: string;
  updatedAt: string;
}

export interface StoreSetting {
  id: number;
  key: string;
  value: string;
  type: 'STRING' | 'NUMBER' | 'BOOLEAN';
  isEditable: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: { name: string };
  updatedBy?: { name: string };
}
