'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { Role, RoleDisplay, Permission } from '@/types/role';
import { useAuth } from '@/context/auth-context';
import RoleCard from '@/components/roles/RoleCard';
import RoleModal from '@/components/roles/RoleModal';
import RoleFilterBar from '@/components/roles/RoleFilterBar';
import { LoadingSpinner } from '@/components/dashboard/LoadingSpinner';
import { getRoles, deleteRole, getPermissions, transformRoleForDisplay } from '@/lib/api/roles';

export default function RolesPage() {
  const { storeContext, hasPermission } = useAuth();
  const [roles, setRoles] = useState<RoleDisplay[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<RoleDisplay[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const storeId = storeContext?.storeId;

  const fetchRoles = useCallback(async () => {
    if (!storeId) return;

    try {
      setLoading(true);
      setError(null);
      const rolesData = await getRoles(storeId);
      const displayRoles = rolesData.map(transformRoleForDisplay);
      setRoles(displayRoles);
      setFilteredRoles(displayRoles); // Initialize filtered roles
    } catch (err) {
      console.error('Error fetching roles:', err);
      setError('Failed to load roles. Please try again.');
      toast.error('Failed to load roles');
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  const fetchPermissions = useCallback(async () => {
    try {
      const permissionsData = await getPermissions();
      setPermissions(permissionsData);
    } catch (err) {
      console.error('Error fetching permissions:', err);
      toast.error('Failed to load permissions');
    }
  }, []);

  useEffect(() => {
    if (storeId) {
      fetchRoles();
      fetchPermissions();
    }
  }, [storeId, fetchRoles, fetchPermissions]);

  const handleOpenModal = (role?: RoleDisplay) => {
    if (role) {
      const fullRole: Role = {
        id: role.id,
        name: role.name,
        description: role.description,
        permissionIds: permissions.filter((p) => role.permissions.includes(p.key)).map((p) => p.id),
        active: role.active,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setSelectedRole(fullRole);
    } else {
      setSelectedRole(null);
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRole(null);
  };

  const handleRoleUpdated = () => {
    fetchRoles();
    handleCloseModal();
  };

  const handleDeleteRole = async (id: number) => {
    if (!storeId) return;

    if (!confirm('Are you sure you want to delete this role?')) {
      return;
    }

    try {
      await deleteRole(storeId, id);
      setRoles((prev) => prev.filter((role) => role.id !== id));
      setFilteredRoles((prev) => prev.filter((role) => role.id !== id));
      toast.success('Role deleted successfully');
    } catch (err) {
      console.error('Error deleting role:', err);
      toast.error('Failed to delete role');
    }
  };

  const handleSearch = (query: string, status: 'all' | 'active' | 'inactive') => {
    let result = roles.filter((role) => role.name.toLowerCase().includes(query.toLowerCase()));

    if (status === 'active') {
      result = result.filter((role) => role.active);
    } else if (status === 'inactive') {
      result = result.filter((role) => !role.active);
    }

    setFilteredRoles(result);
  };

  if (!storeContext || loading) {
    return (
      <main className="pl-[260px] pr-6 pt-6">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="pl-[260px] pr-6 pt-6">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={fetchRoles}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (!hasPermission('manage_roles')) {
    return (
      <main className="pl-[260px] pr-6 pt-6">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-gray-600 mb-4">You don&apos;t have permission to manage roles.</div>
        </div>
      </main>
    );
  }

  return (
    <main className="pl-[260px] pr-6 pt-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Roles</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700"
        >
          <i className="fas fa-plus mr-2"></i>Add Role
        </button>
      </div>

      <RoleFilterBar
        // roles={roles}
        filteredRoles={filteredRoles}
        onSearch={handleSearch}
        // onCreateRole={() => handleOpenModal()}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredRoles.map((role) => (
          <RoleCard
            key={role.id}
            role={role}
            onEdit={() => handleOpenModal(role)}
            onDelete={() => handleDeleteRole(role.id)}
          />
        ))}
      </div>

      {filteredRoles.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No roles found</div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700"
          >
            Create roles
          </button>
        </div>
      )}

      {modalOpen && (
        <RoleModal
          role={selectedRole}
          permissions={permissions}
          onClose={handleCloseModal}
          onSave={handleRoleUpdated}
        />
      )}
    </main>
  );
}
