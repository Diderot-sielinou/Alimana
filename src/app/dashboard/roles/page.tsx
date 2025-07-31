'use client';

import { useState } from 'react';
import { Role } from '@/types/role';
import { rolesMock } from '@/constants/mocks/roles'; // ✅
import RoleCard from '@/components/roles/RoleCard';
import RoleModal from '@/components/roles/RoleModal';
import RoleFilterBar from '@/components/roles/RoleFilterBar';

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(rolesMock);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = (role?: Role) => {
    setSelectedRole(role || null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRole(null);
  };

  const handleSaveRole = (updatedRole: Role) => {
    setRoles((prev) =>
      prev.map((role) => (role.id === updatedRole.id ? { ...role, ...updatedRole } : role))
    );
    handleCloseModal();
  };

  const handleDeleteRole = (id: number) => {
    setRoles((prev) => prev.filter((role) => role.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Roles</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700"
        >
          <i className="fas fa-plus mr-2"></i>Add Role
        </button>
      </div>

      <RoleFilterBar />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {roles.map((role) => (
          <RoleCard
            key={role.id}
            role={role}
            onEdit={() => handleOpenModal(role)}
            onDelete={() => handleDeleteRole(role.id)}
          />
        ))}
      </div>

      {modalOpen && (
        <RoleModal role={selectedRole} onClose={handleCloseModal} onSave={handleSaveRole} />
      )}
    </div>
  );
}
