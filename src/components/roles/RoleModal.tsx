'use client';

import { Role } from '@/types/role';
import RoleForm from '@/components/roles/RoleForm';

interface RoleModalProps {
  role: Role | null;
  onClose: () => void;
  onSave: (role: Role) => void;
}

export default function RoleModal({ role, onClose, onSave }: RoleModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 animate-slide-in">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {role ? 'Modifier le rôle' : 'Nouveau rôle'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <i className="fas fa-times" />
            </button>
          </div>
          <RoleForm initialRole={role} onCancel={onClose} onSubmit={onSave} />
        </div>
      </div>
    </div>
  );
}
