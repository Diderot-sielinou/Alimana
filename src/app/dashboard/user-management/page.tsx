'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

import { Mail, MoreHorizontal, Shield, ShieldOff } from 'lucide-react';
import { useState } from 'react';
import { UserRole } from '@/lib/auth';
import { User } from '@/lib/auth';

type Props = {
  teamMembers: User[];
  getRoleBadge: (role: string) => React.ReactNode;
  getStatusBadge: (status: boolean) => React.ReactNode;
  toggleUserStatus: (id: string) => void;
};

function TeamTable({ teamMembers, getRoleBadge, getStatusBadge, toggleUserStatus }: Props) {
  return (
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
                      <DropdownMenuItem className="text-red-600">Remove from Team</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Original Component Logic
export default function TeamManagement() {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);

  const getRoleBadge = (role: string) => role;
  const getStatusBadge = (active: boolean) => (active ? 'Active' : 'Inactive');

  const toggleUserStatus = (id: string) => {
    setTeamMembers((prev) => prev.map((m) => (m.id === id ? { ...m, isActive: !m.isActive } : m)));
  };

  const handleInvite = () => {
    // TODO: actual invite logic
    setIsInviteOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Invite Dialog */}
      <div className="flex justify-end">
        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsInviteOpen(true)}>Invite User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Email address" />
              <Select defaultValue={UserRole.CASHIER}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.CASHIER}>Cashier</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleInvite} className="bg-amber-600 hover:bg-amber-700">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Invitation
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Team Table */}
      <TeamTable
        teamMembers={teamMembers}
        getRoleBadge={getRoleBadge}
        getStatusBadge={getStatusBadge}
        toggleUserStatus={toggleUserStatus}
      />
    </div>
  );
}
