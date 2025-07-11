'use client';

import RequireStore from '@/components/auth/RequireStore';
import { useStore } from '@/context/store-context';

const defaultPermissions = [
  'View Sales',
  'Manage Products',
  'Manage Users',
  'View Reports',
  'Invite Users',
  'Block Accounts',
];

const mockRoles = [
  {
    name: 'Admin',
    permissions: [...defaultPermissions],
  },
  {
    name: 'Cashier',
    permissions: ['View Sales', 'View Reports', 'Manage Products'],
  },
  {
    name: 'Manager',
    permissions: ['View Sales', 'Manager Products '],
  },
];

export default function RolesPage() {
  const { store } = useStore();

  return (
    <RequireStore>
      <div className="min-h-screen bg-slate-50 p-6">
        <h1 className="text-2xl font-bold mb-4">Role Management</h1>
        <p className="text-slate-700 mb-6">
          Store ID: <strong>{store?.id}</strong>
        </p>

        <div className="space-y-6">
          {mockRoles.map((role) => (
            <div key={role.name} className="bg-white border rounded p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">{role.name}</h2>
              <ul className="list-disc list-inside text-sm text-slate-700">
                {role.permissions.map((perm) => (
                  <li key={perm}>{perm}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </RequireStore>
  );
}
