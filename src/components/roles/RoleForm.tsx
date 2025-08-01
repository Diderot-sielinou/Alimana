'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Role, Permission, CreateRoleDto, UpdateRoleDto } from '@/types/role';
import { useAuth } from '@/context/auth-context';
import {
  createRole,
  updateRole,
  updateRolePermissions,
  groupPermissionsByCategory,
} from '@/lib/api/roles';

interface RoleFormProps {
  initialRole?: Role | null;
  permissions: Permission[];
  onCancel: () => void;
  onSuccess: () => void;
}

export default function RoleForm({ initialRole, permissions, onCancel, onSuccess }: RoleFormProps) {
  const { storeContext } = useAuth();
  const [formData, setFormData] = useState({
    name: initialRole?.name || '',
    description: initialRole?.description || '',
    permissionIds: initialRole?.permissionIds || [],
  });
  const [loading, setLoading] = useState(false);

  const storeId = storeContext?.storeId;
  const groupedPermissions = groupPermissionsByCategory(permissions);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!storeId) {
      toast.error('Store not found');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Role name is required');
      return;
    }

    if (formData.permissionIds.length === 0) {
      toast.error('At least one permission is required');
      return;
    }

    setLoading(true);
    try {
      if (initialRole) {
        // Update existing role
        const updateData: UpdateRoleDto = {
          name: formData.name,
          description: formData.description || undefined,
        };
        await updateRole(storeId, initialRole.id, updateData);

        // Update permissions separately
        await updateRolePermissions(storeId, initialRole.id, {
          permissionIds: formData.permissionIds,
        });

        toast.success('Role updated successfully');
      } else {
        // Create new role
        const createData: CreateRoleDto = {
          name: formData.name,
          description: formData.description,
          permissionIds: formData.permissionIds,
        };
        await createRole(storeId, createData);
        toast.success('Role created successfully');
      }

      onSuccess();
    } catch (err) {
      console.error('Error saving role:', err);
      toast.error('Failed to save role');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = (permissionId: number) => {
    setFormData((prev) => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(permissionId)
        ? prev.permissionIds.filter((id) => id !== permissionId)
        : [...prev.permissionIds, permissionId],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Role Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Role Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          placeholder="Enter role name"
          required
          disabled={loading}
        />
      </div>

      {/* Role Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          placeholder="Enter role description"
          rows={3}
          disabled={loading}
        />
      </div>

      {/* Permissions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">Permissions *</label>
        <div className="space-y-4 max-h-60 overflow-y-auto">
          {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
            <div key={category} className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-3">{category}</h4>
              <div className="grid grid-cols-1 gap-2">
                {categoryPermissions.map((permission) => (
                  <label key={permission.id} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.permissionIds.includes(permission.id)}
                      onChange={() => handlePermissionToggle(permission.id)}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      disabled={loading}
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-700">{permission.label}</div>
                      <div className="text-xs text-gray-500">{permission.key}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Saving...' : initialRole ? 'Update Role' : 'Create Role'}
        </button>
      </div>
    </form>
  );
}
