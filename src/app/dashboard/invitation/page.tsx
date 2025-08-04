'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useInvitations } from '@/hooks/useInvitations';
import { useRoles } from '@/hooks/useRoles';
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
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, RefreshCw, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { InvitationFormData, CreateInvitationRequest } from '@/types/invitation.interface';
import {
  getInvitationStatusColor,
  getInvitationStatusLabel,
  formatInvitationDate,
  validateEmail,
} from '@/utils/invitationUtils';

export default function InvitationPage() {
  const { storeContext } = useAuth();
  const storeId = storeContext?.storeId;

  // Custom hooks for data management
  const {
    invitations,
    loading: invitationsLoading,
    createInvitation,
    revokeInvitation,
  } = useInvitations(storeId);
  const { roles, loading: rolesLoading } = useRoles(storeId);

  // Form state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<InvitationFormData>({ email: '', roleId: '' });
  const [formErrors, setFormErrors] = useState<Partial<InvitationFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form validation
  const validateForm = (): boolean => {
    const errors: Partial<InvitationFormData> = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.roleId) {
      errors.roleId = 'Role is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload: CreateInvitationRequest = {
        email: formData.email,
        roleId: parseInt(formData.roleId, 10),
      };

      await createInvitation(payload);

      // Reset form
      setFormData({ email: '', roleId: '' });
      setFormErrors({});
      setDialogOpen(false);
    } catch {
      // Error handling is done in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle revoke invitation
  const handleRevokeInvitation = async (invitationId: number) => {
    if (window.confirm('Are you sure you want to revoke this invitation?')) {
      try {
        await revokeInvitation(invitationId);
      } catch {
        // Error handling is done in the hook
      }
    }
  };

  const handleFieldChange = (field: keyof InvitationFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-6 ml-0 md:ml-64">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">User Invitations</h1>
            <p className="text-gray-600 mt-1">Manage team member invitations for your store</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">Invite User</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Send Invitation</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    placeholder="user@example.com"
                    className={formErrors.email ? 'border-red-500 focus:border-red-500' : ''}
                  />
                  {formErrors.email && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {formErrors.email}
                    </p>
                  )}
                </div>

                {/* Role Field */}
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium text-gray-700">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.roleId}
                    onValueChange={(value) => handleFieldChange('roleId', value)}
                  >
                    <SelectTrigger
                      className={`w-full ${formErrors.roleId ? 'border-red-500' : ''}`}
                    >
                      <SelectValue
                        placeholder={rolesLoading ? 'Loading roles...' : 'Select a role'}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id.toString()}>
                          <div className="flex flex-col">
                            <span className="font-medium">{role.name}</span>
                            {role.description && (
                              <span className="text-xs text-gray-500">{role.description}</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.roleId && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {formErrors.roleId}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50"
                  disabled={isSubmitting || rolesLoading}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Sending Invitation...
                    </>
                  ) : (
                    'Send Invitation'
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Loading State */}
        {invitationsLoading && (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="h-6 w-6 animate-spin text-amber-600 mr-3" />
            <p className="text-gray-600">Loading invitations...</p>
          </div>
        )}

        {/* Error State */}
        {!invitationsLoading && !storeId && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No store context found. Please select a store to manage invitations.
            </AlertDescription>
          </Alert>
        )}

        {/* Invitations Table */}
        {!invitationsLoading && storeId && (
          <div className="bg-white rounded-lg border shadow-sm">
            {invitations.length === 0 ? (
              <div className="text-center py-20">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No invitations yet</h3>
                <p className="text-gray-500 mb-6">
                  Send your first invitation to get started with team collaboration.
                </p>
                <Button
                  onClick={() => setDialogOpen(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Send First Invitation
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-4 font-medium text-gray-900">Email</th>
                      <th className="text-left p-4 font-medium text-gray-900">Role</th>
                      <th className="text-left p-4 font-medium text-gray-900">Status</th>
                      <th className="text-left p-4 font-medium text-gray-900">Sent</th>
                      <th className="text-left p-4 font-medium text-gray-900">Expires</th>
                      <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invitations.map((invitation) => {
                      const statusColor = getInvitationStatusColor(invitation.status);
                      const statusLabel = getInvitationStatusLabel(invitation.status);

                      return (
                        <tr
                          key={invitation.id}
                          className="border-b hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-4">
                            <div className="font-medium text-gray-900">{invitation.email}</div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className="font-normal">
                              {invitation.role?.name || 'Unknown Role'}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge className={`${statusColor} border`}>
                              {statusLabel === 'Pending' && <Clock className="h-3 w-3 mr-1" />}
                              {statusLabel === 'Accepted' && (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              )}
                              {(statusLabel === 'Expired' || statusLabel === 'Rejected') && (
                                <XCircle className="h-3 w-3 mr-1" />
                              )}
                              {statusLabel}
                            </Badge>
                          </td>
                          <td className="p-4 text-gray-600 text-sm">
                            {formatInvitationDate(invitation.createdAt)}
                          </td>
                          <td className="p-4 text-gray-600 text-sm">
                            {formatInvitationDate(invitation.expiresAt)}
                          </td>
                          <td className="p-4">
                            {invitation.status === 'pending' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRevokeInvitation(invitation.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Revoke
                              </Button>
                            )}
                            {invitation.status !== 'pending' && (
                              <span className="text-gray-400 text-sm">No actions</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
