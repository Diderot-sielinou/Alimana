// src/lib/api/roles.ts
import { api } from '@/lib/api';
import {
  Role,
  Permission,
  CreateRoleDto,
  UpdateRoleDto,
  UpdateRolePermissionsDto,
} from '@/types/role';

// Roles API
export async function getRoles(storeId: number): Promise<Role[]> {
  const response = await api.get(`/store/${storeId}/roles`);
  return response.data;
}

export async function createRole(storeId: number, roleData: CreateRoleDto): Promise<Role> {
  const response = await api.post(`/store/${storeId}/roles`, roleData);
  return response.data;
}

export async function updateRole(
  storeId: number,
  roleId: number,
  roleData: UpdateRoleDto
): Promise<Role> {
  const response = await api.patch(`/store/${storeId}/roles/${roleId}`, roleData);
  return response.data;
}

export async function updateRolePermissions(
  storeId: number,
  roleId: number,
  permissionsData: UpdateRolePermissionsDto
): Promise<Role> {
  const response = await api.patch(
    `/store/${storeId}/roles/${roleId}/permissions`,
    permissionsData
  );
  return response.data;
}

export async function deleteRole(storeId: number, roleId: number): Promise<void> {
  await api.delete(`/store/${storeId}/roles/${roleId}`);
}

// Permissions API
export async function getPermissions(): Promise<Permission[]> {
  const response = await api.get('/permissions');
  return response.data;
}

// Utility functions
export function transformRoleForDisplay(role: Role): import('@/types/role').RoleDisplay {
  return {
    id: role.id,
    name: role.name,
    description: role.description || '',
    permissions: role.permissions?.map((p) => p.key) || [],
    active: role.active ?? true,
  };
}

export function groupPermissionsByCategory(
  permissions: Permission[]
): Record<string, Permission[]> {
  return permissions.reduce(
    (acc, permission) => {
      const category = permission.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(permission);
      return acc;
    },
    {} as Record<string, Permission[]>
  );
}
