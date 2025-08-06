# Alimana Invitation System - Frontend Implementation Plan

## Overview

This document provides a detailed implementation plan to fix the current invitation system frontend to work properly with the backend API. The current implementation has several critical issues that need to be addressed.

## Current Issues Analysis

### 1. API Endpoint Issues

- **Current**: Uses `/api/invitations`
- **Required**: `/stores/:storeId/invitations`
- **Impact**: API calls fail because endpoints don't exist

### 2. Data Structure Mismatch

- **Current**: Frontend expects `fullName`, `role` as string, custom `Invitation` type
- **Required**: Backend uses `email`, `roleId` as number, `IInvitation` interface
- **Impact**: Data doesn't map correctly between frontend and backend

### 3. Role Management Issues

- **Current**: Hardcoded role strings (`"Admin"`, `"Manager"`, `"Cashier"`)
- **Required**: Dynamic role fetching from `/stores/:storeId/roles` endpoint
- **Impact**: Roles may not exist or have wrong IDs

### 4. Status Handling Issues

- **Current**: Uses `'Pending' | 'Accepted' | 'Expired'`
- **Required**: Uses `'pending' | 'accepted' | 'rejected' | 'expired'`
- **Impact**: Status display and logic incorrect

## Implementation Plan

### Phase 1: Type Definitions and Interfaces

#### 1.1 Update Invitation Types (`src/types/invitation.interface.ts`)

```typescript
// Update existing file to match backend exactly
export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export interface IInvitation {
  id: number;
  email: string;
  storeId: number;
  store?: Store;
  roleId: number;
  role?: IRole;
  invitedById: number;
  invitedBy?: IStoreUser;
  token: string;
  status: InvitationStatus;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

// Frontend-specific types for forms
export interface CreateInvitationRequest {
  email: string;
  roleId: number;
}

export interface InvitationFormData {
  email: string;
  roleId: string; // String for form handling, converted to number
}
```

#### 1.2 Create Role Service Types

```typescript
// Add to src/types/role.interface.ts or create new file
export interface IRoleOption {
  id: number;
  name: string;
  description?: string;
}
```

### Phase 2: Service Layer Implementation

#### 2.1 Create Invitation Service (`src/services/invitationService.ts`)

```typescript
import { api } from '@/lib/api';
import {
  IInvitation,
  CreateInvitationRequest,
  InvitationStatus,
} from '@/types/invitation.interface';

export class InvitationService {
  // Get all invitations for a store
  static async getStoreInvitations(storeId: number): Promise<IInvitation[]> {
    const response = await api.get(`/stores/${storeId}/invitations`);
    return response.data;
  }

  // Send new invitation
  static async createInvitation(
    storeId: number,
    data: CreateInvitationRequest
  ): Promise<IInvitation> {
    const response = await api.post(`/stores/${storeId}/invitations`, data);
    return response.data;
  }

  // Revoke invitation
  static async revokeInvitation(storeId: number, invitationId: number): Promise<void> {
    await api.delete(`/stores/${storeId}/invitations/${invitationId}`);
  }

  // Accept invitation (public endpoint)
  static async acceptInvitation(token: string, password: string): Promise<void> {
    await api.post('/invitations/accept', { token, password });
  }

  // Validate invitation token (public endpoint)
  static async validateInvitation(token: string): Promise<IInvitation> {
    const response = await api.get(`/invitations/validate/${token}`);
    return response.data;
  }
}
```

#### 2.2 Create Role Service (`src/services/roleService.ts`)

```typescript
import { api } from '@/lib/api';
import { IRole } from '@/types/role.interface';

export class RoleService {
  // Get all roles for a store
  static async getStoreRoles(storeId: number): Promise<IRole[]> {
    const response = await api.get(`/stores/${storeId}/roles`);
    return response.data;
  }
}
```

### Phase 3: Custom Hooks Implementation

#### 3.1 Create Invitation Hook (`src/hooks/useInvitations.ts`)

```typescript
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { InvitationService } from '@/services/invitationService';
import { IInvitation, CreateInvitationRequest } from '@/types/invitation.interface';

export const useInvitations = (storeId: number | undefined) => {
  const [invitations, setInvitations] = useState<IInvitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInvitations = useCallback(async () => {
    if (!storeId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await InvitationService.getStoreInvitations(storeId);
      setInvitations(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch invitations';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  const createInvitation = useCallback(
    async (data: CreateInvitationRequest) => {
      if (!storeId) return;

      try {
        const newInvitation = await InvitationService.createInvitation(storeId, data);
        setInvitations((prev) => [newInvitation, ...prev]);
        toast.success('Invitation sent successfully');
        return newInvitation;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to send invitation';
        toast.error(errorMessage);
        throw err;
      }
    },
    [storeId]
  );

  const revokeInvitation = useCallback(
    async (invitationId: number) => {
      if (!storeId) return;

      try {
        await InvitationService.revokeInvitation(storeId, invitationId);
        setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
        toast.success('Invitation revoked successfully');
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to revoke invitation';
        toast.error(errorMessage);
        throw err;
      }
    },
    [storeId]
  );

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  return {
    invitations,
    loading,
    error,
    fetchInvitations,
    createInvitation,
    revokeInvitation,
  };
};
```

#### 3.2 Create Roles Hook (`src/hooks/useRoles.ts`)

```typescript
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { RoleService } from '@/services/roleService';
import { IRole } from '@/types/role.interface';

export const useRoles = (storeId: number | undefined) => {
  const [roles, setRoles] = useState<IRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    if (!storeId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await RoleService.getStoreRoles(storeId);
      setRoles(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch roles';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return {
    roles,
    loading,
    error,
    fetchRoles,
  };
};
```

### Phase 4: Utility Functions

#### 4.1 Create Invitation Utilities (`src/utils/invitationUtils.ts`)

```typescript
import { InvitationStatus } from '@/types/invitation.interface';

export const getInvitationStatusColor = (status: InvitationStatus): string => {
  switch (status) {
    case InvitationStatus.PENDING:
      return 'text-yellow-600 bg-yellow-50';
    case InvitationStatus.ACCEPTED:
      return 'text-green-600 bg-green-50';
    case InvitationStatus.EXPIRED:
      return 'text-red-600 bg-red-50';
    case InvitationStatus.REJECTED:
      return 'text-gray-600 bg-gray-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export const getInvitationStatusLabel = (status: InvitationStatus): string => {
  switch (status) {
    case InvitationStatus.PENDING:
      return 'Pending';
    case InvitationStatus.ACCEPTED:
      return 'Accepted';
    case InvitationStatus.EXPIRED:
      return 'Expired';
    case InvitationStatus.REJECTED:
      return 'Rejected';
    default:
      return 'Unknown';
  }
};

export const isInvitationExpired = (expiresAt: string): boolean => {
  return new Date(expiresAt) < new Date();
};

export const formatInvitationDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
};
```

### Phase 5: Updated Invitation Page Implementation

#### 5.1 Main Invitation Page (`src/app/dashboard/invitation/page.tsx`)

**Key Changes:**

1. Replace hardcoded types with proper interfaces
2. Use custom hooks for data fetching
3. Implement proper form validation
4. Add loading states and error handling
5. Use correct API endpoints
6. Add invitation revocation functionality

**Implementation Structure:**

````typescript
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useInvitations } from '@/hooks/useInvitations';
import { useRoles } from '@/hooks/useRoles';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Trash2, RefreshCw, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { InvitationFormData, CreateInvitationRequest } from '@/types/invitation.interface';
import { getInvitationStatusColor, getInvitationStatusLabel, formatInvitationDate } from '@/utils/invitationUtils';

export default function InvitationPage() {
  const { storeContext } = useAuth();
  const storeId = storeContext?.storeId;

  // Custom hooks for data management
  const { invitations, loading
### Phase 5: Updated Invitation Page Implementation

#### 5.1 Main Invitation Page (`src/app/dashboard/invitation/page.tsx`)

**Key Changes:**
1. Replace hardcoded types with proper interfaces
2. Use custom hooks for data fetching
3. Implement proper form validation
4. Add loading states and error handling
5. Use correct API endpoints
6. Add invitation revocation functionality

**Implementation Structure:**
```typescript
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useInvitations } from '@/hooks/useInvitations';
import { useRoles } from '@/hooks/useRoles';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, RefreshCw, Clock, CheckCircle, XCircle } from 'lucide-react';
import { InvitationFormData, CreateInvitationRequest } from '@/types/invitation.interface';
import { getInvitationStatusColor, getInvitationStatusLabel, formatInvitationDate } from '@/utils/invitationUtils';

export default function InvitationPage() {
  const { storeContext } = useAuth();
  const storeId = storeContext?.storeId;

  // Custom hooks for data management
  const { invitations, loading: invitationsLoading, createInvitation, revokeInvitation } = useInvitations(storeId);
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
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
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
    } catch (error) {
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
      } catch (error) {
        // Error handling is done in the hook
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-6 ml-0 md:ml-64">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">User Invitations</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                Invite User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Send Invitation</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, email: e.target.value }));
                      if (formErrors.email) {
                        setFormErrors(prev => ({ ...prev, email: undefined }));
                      }
                    }}
                    placeholder="user@example.com"
                    className={formErrors.email ? 'border-red-500' : ''}
                  />
                  {formErrors.email && (
                    <p className="text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>

                {/* Role Field */}
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium text-gray-700">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.roleId}
                    onValueChange={(value) => {
                      setFormData(prev => ({ ...prev, roleId: value }));
                      if (formErrors.roleId) {
                        setFormErrors(prev => ({ ...prev, roleId: undefined }));
                      }
                    }}
                  >
                    <SelectTrigger className={`w-full ${formErrors.roleId ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder={rolesLoading ? "Loading roles..." : "Select role"} />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id.toString()}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.roleId && (
                    <p className="text-sm text-red-600">{formErrors.roleId}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full text-white bg-amber-600 hover:bg-amber-700"
                  disabled={isSubmitting || rolesLoading}
                >
                  {isSubmitting ? 'Sending...' : 'Send Invitation'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Loading State */}
        {invitationsLoading && (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="h-6 w-6 animate-spin text-amber-600 mr-2" />
            <p className="text-gray-600">Loading invitations...</p>
          </div>
        )}

        {/* Invitations Table */}
        {!invitationsLoading && (
          <div className="overflow-auto rounded-lg border shadow">
            {invitations.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg text-gray-500 mb-4">No invitations found.</p>
                <p className="text-sm text-gray-400">Send your first invitation to get started.</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-3">Email</th>
                    <th className="text-left p-3">Role</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Sent</th>
                    <th className="text-left p-3">Expires</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invitations.map((invitation) => {
                    const statusColor = getInvitationStatusColor(invitation.status);
                    const statusLabel = getInvitationStatusLabel(invitation.status);

                    return (
                      <tr key={invitation.id} className="border-t hover:bg-gray-50">
                        <td className="p-3 font-medium">{invitation.email}</td>
                        <td className="p-3">
                          <Badge variant="outline">
                            {invitation.role?.name || 'Unknown Role'}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Badge className={statusColor}>
                            {statusLabel === 'Pending' && <Clock className="h-3 w-3 mr-1" />}
                            {statusLabel === 'Accepted' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {statusLabel === 'Expired' && <XCircle className="h-3 w-3 mr-1" />}
                            {statusLabel === 'Rejected' && <XCircle className="h-3 w-3 mr-1" />}
                            {statusLabel}
                          </Badge>
                        </td>
                        <td className="p-3 text-gray-600">
                          {formatInvitationDate(invitation.createdAt)}
                        </td>
                        <td className="p-3 text-gray-600">
                          {formatInvitationDate(invitation.expiresAt)}
                        </td>
                        <td className="p-3">
                          {invitation.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRevokeInvitation(invitation.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Revoke
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
````

### Phase 6: Invitation Acceptance Flow Updates

#### 6.1 Update Invitation Acceptance Page (`src/app/invite/[token]/page.tsx`)

**Key Changes:**

1. Use proper backend API endpoints
2. Update data structure to match backend
3. Improve error handling and validation
4. Add proper loading states

**Updated Implementation:**

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Lock, Eye, EyeOff, Store, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InvitationService } from '@/services/invitationService';
import { IInvitation } from '@/types/invitation.interface';
import { formatInvitationDate } from '@/utils/invitationUtils';

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [invitation, setInvitation] = useState<IInvitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState<{ password?: string; confirmPassword?: string }>({});

  useEffect(() => {
    const fetchInvitation = async () => {
      if (!token) {
        setError('Invalid invitation link');
        setLoading(false);
        return;
      }

      try {
        const invitationData = await InvitationService.validateInvitation(token);
        setInvitation(invitationData);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Invalid or expired invitation';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [token]);

  const validateForm = (): boolean => {
    const newErrors: { password?: string; confirmPassword?: string } = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setError('');

    try {
      await InvitationService.acceptInvitation(token, formData.password);
      setIsSuccess(true);

      // Redirect to signin after 2 seconds
      setTimeout(() => {
        router.push('/signin');
      }, 2000);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Failed to create account. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rest of the component remains similar but uses the updated invitation data structure
  // ...
}
```

### Phase 7: Testing and Validation Plan

#### 7.1 Unit Testing

- Test invitation service methods
- Test custom hooks with mock data
- Test form validation logic
- Test utility functions

#### 7.2 Integration Testing

- Test complete invitation creation flow
- Test invitation acceptance flow
- Test error handling scenarios
- Test API integration

#### 7.3 User Acceptance Testing

- Test invitation sending from admin perspective
- Test invitation acceptance from user perspective
- Test edge cases (expired invitations, invalid tokens)
- Test responsive design on different devices

### Phase 8: Error Handling and Edge Cases

#### 8.1 Common Error Scenarios

1. **Network Errors**: API unavailable, timeout
2. **Authentication Errors**: Invalid tokens, expired sessions
3. **Validation Errors**: Invalid email, missing fields
4. **Business Logic Errors**: Duplicate invitations, expired tokens
5. **Permission Errors**: Insufficient permissions to send invitations

#### 8.2 Error Handling Strategy

```typescript
// Global error handling in services
export const handleApiError = (error: any): string => {
  if (error.response?.status === 401) {
    return 'Authentication required. Please log in again.';
  }
  if (error.response?.status === 403) {
    return 'You do not have permission to perform this action.';
  }
  if (error.response?.status === 404) {
    return 'The requested resource was not found.';
  }
  if (error.response?.status >= 500) {
    return 'Server error. Please try again later.';
  }
  return error.response?.data?.message || 'An unexpected error occurred.';
};
```

### Phase 9: Performance Optimizations

#### 9.1 Data Fetching Optimizations

- Implement proper caching for roles data
- Add debouncing for search functionality
- Use React Query or SWR for better data management

#### 9.2 Component Optimizations

- Memoize expensive calculations
- Use React.memo for pure components
- Implement virtual scrolling for large invitation lists

### Phase 10: Security Considerations

#### 10.1 Frontend Security

- Validate all user inputs
- Sanitize data before display
- Implement proper CSRF protection
- Use secure token storage

#### 10.2 API Security

- Validate invitation tokens server-side
- Implement rate limiting for invitation creation
- Add proper authentication checks
- Log security events

## Implementation Priority

1. **High Priority**: Fix core API integration and data structures
2. **Medium Priority**: Add proper error handling and loading states
3. **Low Priority**: Performance optimizations and advanced features

## Success Criteria

- [ ] Invitations can be created successfully with proper role selection
- [ ] Invitations are displayed correctly with proper status
- [ ] Invitation acceptance flow works end-to-end
- [ ] Error handling provides clear feedback to users
- [ ] All API endpoints work correctly with backend
- [ ] Form validation prevents invalid submissions
- [ ] Loading states provide good user experience

## Next Steps

After completing this implementation plan:

1. Switch to Code mode to implement the changes
2. Test each component individually
3. Test the complete workflow end-to-end
4. Address any issues found during testing
5. Deploy and monitor for any production issues

## Files to Create/Modify

### New Files to Create:

1. `src/services/invitationService.ts` - Invitation API service
2. `src/services/roleService.ts` - Role API service
3. `src/hooks/useInvitations.ts` - Invitation management hook
4. `src/hooks/useRoles.ts` - Role fetching hook
5. `src/utils/invitationUtils.ts` - Invitation utility functions

### Files to Modify:

1. `src/types/invitation.interface.ts` - Update invitation types
2. `src/app/dashboard/invitation/page.tsx` - Main invitation page
3. `src/app/invite/[token]/page.tsx` - Invitation acceptance page
4. `src/app/acepte-invitation/page.tsx` - Alternative acceptance page (if needed)

This comprehensive plan addresses all the issues identified in the current invitation system and provides a clear roadmap for implementation that aligns with the backend API structure and requirements.
