import { api } from '@/lib/api';
import { IRole } from '@/types/role.interface';

export class RoleService {
  // Get all roles for a store
  static async getStoreRoles(storeId: number): Promise<IRole[]> {
    const response = await api.get(`/stores/${storeId}/roles`);
    return response.data;
  }
}
