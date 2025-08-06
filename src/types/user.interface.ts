// src/types/user.interface.ts

export interface IUser {
  id: number;
  email: string;
  fullName: string;
  canCreateStore: boolean;
  createdAt: string;
  updatedAt: string;
}

// DTO for creating a user
export interface ICreateUserDto {
  email: string;
  fullName: string;
  password: string;
  canCreateStore?: boolean;
}

// DTO for updating a user
export interface IUpdateUserDto {
  fullName?: string;
  canCreateStore?: boolean;
}
