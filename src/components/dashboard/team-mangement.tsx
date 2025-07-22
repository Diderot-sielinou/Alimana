'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { hasPermission } from '@/lib/auth';
import { Permission, UserRole, getRoleDisplayName } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserPlus, Mail, MoreHorizontal, Shield, ShieldOff } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TeamMember {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  joinedAt: string;
  lastActive: string;
}

export function TeamManagement() {
  const { user } = useAuth();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    fullName: '',
    role: UserRole.CASHIER,
  });

  // Mock team members data
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      email: 'admin@store.com',
      fullName: 'John Admin',
      role: UserRole.ADMIN,
      isActive: true,
      joinedAt: '2024-01-01',
      lastActive: '2024-01-15',
    },
    {
      id: '2',
      email: 'manager@store.com',
      fullName: 'Jane Manager',
      role: UserRole.STORE_MANAGER,
      isActive: true,
      joinedAt: '2024-01-05',
      lastActive: '2024-01-15',
    },
    {
      id: '3',
      email: 'sales@store.com',
      fullName: 'Bob Salesperson',
      role: UserRole.SALESPERSON,
      isActive: true,
      joinedAt: '2024-01-10',
      lastActive: '2024-01-14',
    },
    {
      id: '4',
      email: 'cashier@store.com',
      fullName: 'Alice Cashier',
      role: UserRole.CASHIER,
      isActive: false,
      joinedAt: '2024-01-12',
      lastActive: '2024-01-13',
    },
  ]);

  if (!user || !hasPermission(user, Permission.MANAGE_USERS)) {
    return (
      <div className="text-center py-12">
        <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
        <p className="text-gray-600">You do not have permission to manage team members.</p>
      </div>
    );
  }

  const handleInvite = async () => {
    if (!inviteForm.email || !inviteForm.fullName || !inviteForm.role) {
      return;
    }

    try {
      const response = await fetch('/api/invitations/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: inviteForm.email,
          fullName: inviteForm.fullName,
          role: inviteForm.role,
          storeId: user?.storeId,
          name: user?.name,
          invitedBy: user?.id,
          inviterName: user?.fullName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Failed to send invitation:', data.error);
        return;
      }

      console.log('Invitation sent successfully:', data);
      setIsInviteOpen(false);
      setInviteForm({ email: '', fullName: '', role: UserRole.CASHIER });

      // You could show a success toast here
      alert('Invitation sent successfully!');
    } catch (error) {
      console.error('Error sending invitation:', error);
      alert('Failed to send invitation. Please try again.');
    }
  };

  const toggleUserStatus = (userId: string) => {
    console.log('Toggling user status:', userId);
    // Here you would update user status
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? 'default' : 'secondary'}>{isActive ? 'Active' : 'Inactive'}</Badge>
    );
  };

  const getRoleBadge = (role: UserRole) => {
    const variants = {
      [UserRole.ADMIN]: 'default' as const,
      [UserRole.STORE_MANAGER]: 'secondary' as const,
      [UserRole.SALESPERSON]: 'outline' as const,
      [UserRole.CASHIER]: 'outline' as const,
    };

    return <Badge variant={variants[role]}>{getRoleDisplayName(role)}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
          <p className="text-gray-600">Manage your store team members and their permissions</p>
        </div>

        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Team Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your store team. They will receive an email with setup
                instructions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={inviteForm.fullName}
                  onChange={(e) => setInviteForm((prev) => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={inviteForm.role}
                  onValueChange={(value) =>
                    setInviteForm((prev) => ({ ...prev, role: value as UserRole }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.STORE_MANAGER}>Store Manager</SelectItem>
                    <SelectItem value={UserRole.SALESPERSON}>Salesperson</SelectItem>
                    <SelectItem value={UserRole.CASHIER}>Cashier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleInvite} className="bg-blue-600 hover:bg-blue-700">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Invitation
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Manage your team members, their roles, and access permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/placeholder-user.jpg`} alt={member.fullName} />
                        <AvatarFallback>
                          {member.fullName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{member.fullName}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(member.role)}</TableCell>
                  <TableCell>{getStatusBadge(member.isActive)}</TableCell>
                  <TableCell>{member.joinedAt}</TableCell>
                  <TableCell>{member.lastActive}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit Role</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleUserStatus(member.id)}>
                          {member.isActive ? (
                            <>
                              <ShieldOff className="mr-2 h-4 w-4" />
                              Disable Account
                            </>
                          ) : (
                            <>
                              <Shield className="mr-2 h-4 w-4" />
                              Enable Account
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          Remove from Team
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
