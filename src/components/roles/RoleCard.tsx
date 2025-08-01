'use client';

import { RoleDisplay } from '@/types/role';
import { Edit3, Trash2 } from 'lucide-react'; // Icônes remplacées

interface RoleCardProps {
  role: RoleDisplay;
  onEdit: () => void;
  onDelete: () => void;
}

export default function RoleCard({ role, onEdit, onDelete }: RoleCardProps) {
  return (
    <div className="role-card bg-white rounded-lg shadow p-5 border-l-4 border-amber-700 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold">{role.name}</h3>
          <span className={`text-sm ${role.active ? 'text-green-600' : 'text-gray-500'}`}>
            {role.active ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div className="flex space-x-2">
          <button onClick={onEdit} className="text-blue-500 hover:text-blue-700">
            <Edit3 className="w-5 h-5" />
          </button>
          <button onClick={onDelete} className="text-red-500 hover:text-red-700">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-3">{role.description}</p>
      <div className="flex flex-wrap gap-2 text-xs">
        {role.permissions.map((perm, idx) => (
          <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            {perm}
          </span>
        ))}
      </div>
    </div>
  );
}
