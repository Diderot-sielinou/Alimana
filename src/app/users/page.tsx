'use client';

import RequireStore from '@/components/auth/RequireStore';
import { useStore } from '@/context/store-context';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Cashier' | 'Viewer';
}

export default function UsersPage() {
  const { store } = useStore();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const mockUsers: User[] = [
      { id: '1', name: 'Alice N.', email: 'alice@example.com', role: 'Admin' },
      { id: '2', name: 'Bob T.', email: 'bob@example.com', role: 'Cashier' },
      { id: '3', name: 'Cynthia M.', email: 'cynthia@example.com', role: 'Viewer' },
    ];
    setUsers(mockUsers);
  }, []);

  return (
    <RequireStore>
      <div className="min-h-screen bg-slate-50 p-6">
        <h1 className="text-2xl font-bold mb-4">Store Users</h1>
        <p className="text-slate-700 mb-6">
          Active Store: <strong>{store?.id}</strong>
        </p>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full table-auto text-left">
            <thead className="bg-slate-100 text-sm uppercase text-slate-600">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t text-sm">
                  <td className="px-6 py-4 font-medium">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-amber-600 hover:underline text-sm">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RequireStore>
  );
}
