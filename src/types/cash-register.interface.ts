// src/interfaces/cash-register.interface.ts

import { Store } from './auth';
import { ICashRegisterSession } from './cash-register-session.interface';

export interface ICashRegister {
  id: number;
  storeId: number;
  store?: Store; // Optional, might be deeply nested or just basic info
  name: string;
  description: string | null;
  active: boolean;
  createdAt: string; // Use string for Date objects from API
  updatedAt: string; // Use string for Date objects from API
  currentOpenSession?: ICashRegisterSession | null; // The currently open session, or null if none
}

export interface ICreateCashRegisterDto {
  name: string;
  description?: string;
}

export interface IUpdateCashRegisterDto {
  name?: string;
  description?: string;
  active?: boolean;
}
