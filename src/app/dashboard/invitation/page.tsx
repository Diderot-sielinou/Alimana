'use client';

import { useEffect } from 'react'; // make sure this is imported
import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Helpers
const isExpired = (dateSent: string) => {
  const expiryDate = new Date(dateSent);
  expiryDate.setDate(expiryDate.getDate() + 7); // 7-day validity
  return new Date() > expiryDate;
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(
    new Date(date)
  );

export default function InvitationPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [fullName, setFullName] = useState('');
  const { storeContext } = useAuth();
  const storeId = storeContext?.storeId || undefined;

  type Invitation = {
    id: string;
    email: string;
    fullName: string;
    role: string;
    date: string;
    status: 'Pending' | 'Accepted' | 'Expired';
  };

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const res = await api.get('/api/invitations');
        const data = res.data;
        setInvitations(data);
      } catch (error) {
        console.error('Failed to fetch invitations', error);
      }
    };

    fetchInvitations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.post(`/api/stores/${storeId}/invitations`);

      const savedInvite = res.data; // this should include id, date, and status

      setInvitations([savedInvite, ...invitations]); // update list with server response
      setEmail('');
      setRole('');
      setFullName('');
      setDialogOpen(false);
    } catch (error) {
      console.error('Error sending invitation:', error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-6 ml-0 md:ml-64">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">User Invitations</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">Invite User</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl overflow-y-auto max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Send Invitation</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="user@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="e.g. Jane Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium text-gray-700">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Cashier">Cashier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                  Send Invitation
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="overflow-auto rounded-lg border shadow">
          {invitations.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-gray-500 mb-4">No invitations found.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Full Name</th>
                  <th className="text-left p-3">Role</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Date Sent</th>
                  <th className="text-left p-3">Expires</th>
                </tr>
              </thead>
              <tbody>
                {invitations.map((invite) => {
                  const currentStatus =
                    invite.status === 'Accepted'
                      ? 'Accepted'
                      : isExpired(invite.date)
                        ? 'Expired'
                        : 'Pending';

                  const statusColor =
                    currentStatus === 'Pending'
                      ? 'text-yellow-600'
                      : currentStatus === 'Accepted'
                        ? 'text-green-600'
                        : 'text-red-500';

                  const expirationDate = new Date(invite.date);
                  expirationDate.setDate(expirationDate.getDate() + 7);

                  return (
                    <tr key={invite.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{invite.email}</td>
                      <td className="p-3">{invite.fullName}</td>
                      <td className="p-3">{invite.role}</td>
                      <td className={`p-3 font-medium ${statusColor}`}>{currentStatus}</td>
                      <td className="p-3">{formatDate(invite.date)}</td>
                      <td className="p-3">{formatDate(expirationDate.toISOString())}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
