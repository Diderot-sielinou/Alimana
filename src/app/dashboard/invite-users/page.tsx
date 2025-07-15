'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser'; // assume you have this
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useState } from 'react';

export default function InviteUsersPage() {
  const router = useRouter();
  const { user, isLoading } = useUser(); // custom hook from your auth logic

  const [email, setEmail] = useState('');
  const [role, setRole] = useState('cashier');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isLoading && user?.role !== 'admin') {
      router.replace('/dashboard'); // redirect non-admins
    }
  }, [user, isLoading, router]);

  const handleInvite = async () => {
    try {
      const res = await fetch('/api/invite-user', {
        method: 'POST',
        body: JSON.stringify({ email, role }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Invite failed');
      setMessage('User invited successfully!');
      setEmail('');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('Something went wrong');
      }
    }
  };

  if (isLoading || !user) {
    return <p className="p-4">Loading...</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Invite User</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">User Email</Label>
            <Input
              id="email"
              placeholder="example@email.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              className="w-full border border-gray-300 rounded-md p-2"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="cashier">Cashier</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <Button onClick={handleInvite}>Send Invite</Button>

          {message && <p className="text-sm text-center text-green-600 font-medium">{message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
