// src/interfaces/cash-register-session.interface.ts

import { ICashRegister } from './cash-register.interface';
import { IStoreUser } from './store-user.interface';
// import { ISale } from './sale.interface'; // Assuming you have a basic Sale interface
// import { ICashMovement } from './cash-movement.interface'; // Assuming you have a basic CashMovement interface

export enum CashRegisterSessionStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  ARCHIVED = 'archived',
}

export interface ICashRegisterSession {
  id: number;
  storeId: number;
  openedBy?: IStoreUser;
  openedById: number;
  closedBy: IStoreUser | null;
  closedById: number | null;
  openedAt: string; // Dates as strings
  closedAt: string | null; // Dates as strings
  initialCash: number;
  closingCash: number | null;
  expectedCash: number;
  discrepancy: number;
  status: CashRegisterSessionStatus;
  notes: string | null;
  createdAt: string; // Dates as strings
  updatedAt: string; // Dates as strings
  cashRegister: ICashRegister; // Full cash register object
  cashRegisterId: number;
}

export interface IOpenSessionDto {
  cashRegisterId: number;
  initialCash: number;
  notes?: string;
}

export interface ICloseSessionDto {
  finalCash: number;
}
