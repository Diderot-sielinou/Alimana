import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { RoleService } from '@/services/roleService';
import { IRole } from '@/types/role.interface';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const useRoles = (storeId: number | undefined) => {
  const [roles, setRoles] = useState<IRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    if (!storeId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await RoleService.getStoreRoles(storeId);
      setRoles(data);
    } catch (err: unknown) {
      const errorMessage = (err as ApiError).response?.data?.message || 'Failed to fetch roles';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return {
    roles,
    loading,
    error,
    fetchRoles,
  };
};
