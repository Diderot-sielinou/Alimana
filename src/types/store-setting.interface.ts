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
