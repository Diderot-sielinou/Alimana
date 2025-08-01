// src/types/role.ts

export interface Role {
  id: number;
  name: string;
  description: string | null;
  permissions?: Permission[];
  permissionIds?: number[];
  active?: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    id: number;
    fullName: string;
  };
}

export interface Permission {
  id: number;
  key: string;
  label: string;
  category: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleDto {
  name: string;
  description?: string;
  permissionIds: number[];
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
}

export interface UpdateRolePermissionsDto {
  permissionIds: number[];
}

// For backward compatibility with existing UI components
export interface RoleDisplay {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  active: boolean;
}
