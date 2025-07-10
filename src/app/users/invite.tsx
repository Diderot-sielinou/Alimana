'use client';

import { useState, ChangeEvent } from 'react';
import RequireStore from '@/components/auth/RequireStore';
import { useStore } from '@/context/store-context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function InviteUserPage() {
  const { store } = useStore();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Admin' | 'Cashier' | 'Viewer'>('Viewer');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInvite = async () => {
    try {
      setError('');
      setSuccess(false);

      // API call here

      setSuccess(true);
      setEmail('');
      setRole('Viewer');
    } catch {
      setError('Failed to send invitation');
    }
  };

  const handleRoleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value as 'Admin' | 'Cashier' | 'Viewer');
  };

  return (
    <RequireStore>
      <div className="min-h-screen bg-slate-50 p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Invite User to Store</h1>
        <p className="text-slate-700 mb-6">
          Store ID: <strong>{store?.id}</strong>
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">User Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Assign Role</Label>
            <select
              id="role"
              className="w-full border rounded px-3 py-2"
              value={role}
              onChange={handleRoleChange}
            >
              <option value="Viewer">Viewer</option>
              <option value="Cashier">Cashier</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <Button onClick={handleInvite} className="w-full bg-amber-600 hover:bg-amber-700">
            Send Invitation
          </Button>

          {success && <p className="text-green-600 text-sm">Invitation sent successfully!</p>}
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
      </div>
    </RequireStore>
  );
}
