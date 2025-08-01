import { api } from '@/lib/api';
import {
  IInvitation,
  CreateInvitationRequest,
  AcceptInvitationRequest,
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
    const payload: AcceptInvitationRequest = { token, password };
    await api.post('/invitations/accept', payload);
  }

  // Validate invitation token (public endpoint)
  static async validateInvitation(token: string): Promise<IInvitation> {
    const response = await api.get(`/invitations/validate/${token}`);
    return response.data;
  }
}
