import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { InvitationService } from '@/services/invitationService';
import { IInvitation, CreateInvitationRequest } from '@/types/invitation.interface';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

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
    } catch (err: unknown) {
      const errorMessage =
        (err as ApiError).response?.data?.message || 'Failed to fetch invitations';
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
      } catch (err: unknown) {
        const errorMessage =
          (err as ApiError).response?.data?.message || 'Failed to send invitation';
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
      } catch (err: unknown) {
        const errorMessage =
          (err as ApiError).response?.data?.message || 'Failed to revoke invitation';
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
