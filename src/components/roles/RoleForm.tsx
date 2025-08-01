'use client';

import { useState } from 'react';
import { Role } from '@/types/role';
import { allPermissions } from '@/constants/permissions';

interface RoleFormProps {
  initialRole: Role | null;
  onCancel: () => void;
  onSubmit: (role: Role) => void;
}

export default function RoleForm({ initialRole, onCancel, onSubmit }: RoleFormProps) {
  const [name, setName] = useState(initialRole?.name || '');
  const [description, setDescription] = useState(initialRole?.description || '');
  const [permissions, setPermissions] = useState<string[]>(initialRole?.permissions || []);

  const togglePermission = (perm: string) => {
    setPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: initialRole?.id ?? 0,
      name,
      description,
      permissions,
      active: true,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Role name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Permissions</label>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
          {allPermissions.map((perm, idx) => (
            <label key={idx} className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={permissions.includes(perm)}
                onChange={() => togglePermission(perm)}
                className="accent-blue-600"
              />
              <span>{perm}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700"
        >
          Enregistrer
        </button>
      </div>
    </form>
  );
}
