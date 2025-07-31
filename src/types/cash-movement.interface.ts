// src/interfaces/cash-movement.interface.ts

export enum CashMovementType {
  IN = 'in',
  OUT = 'out',
}

export interface ICashMovement {
  id: number;
  amount: number;
  type: CashMovementType;
  reason: string | null;
  createdAt: string;
}
