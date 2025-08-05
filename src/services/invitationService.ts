import { api } from '@/lib/api';
import {
  IInvitation,
  CreateInvitationRequest,
  AcceptInvitationRequest,
} from '@/types/invitation.interface';

// Type for enhanced error objects with status and type properties
interface EnhancedError extends Error {
  status?: number;
  type?: string;
}

// Type for axios error response structure
interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
}

export class InvitationService {
  // Get all invitations for a store
  static async getStoreInvitations(storeId: number): Promise<IInvitation[]> {
    const response = await api.get(`/store/${storeId}/invitations`);
    return response.data;
  }

  // Send new invitation
  static async createInvitation(
    storeId: number,
    data: CreateInvitationRequest
  ): Promise<IInvitation> {
    console.log('🔄 Creating invitation:', {
      storeId,
      data,
      endpoint: `/store/${storeId}/invitations`,
    });

    try {
      const response = await api.post(`/store/${storeId}/invitations`, data);
      console.log('✅ Invitation created successfully:', response.data);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosErrorResponse;
      const status = axiosError.response?.status;
      const message = axiosError.response?.data?.message;

      console.error('❌ Failed to create invitation:', {
        storeId,
        data,
        error: axiosError.response?.data || (error as Error).message,
        status,
        details: axiosError.response,
      });

      // Handle specific error cases with better user messages
      if (status === 409) {
        console.log('⚠️ Invitation already exists for this email');
        const duplicateError: EnhancedError = new Error(
          message ||
            `An invitation has already been sent to ${data.email}. Please check the invitations list or use a different email address.`
        );
        duplicateError.status = 409;
        throw duplicateError;
      }

      if (status === 400) {
        console.log('⚠️ Invalid request data');
        const validationError: EnhancedError = new Error(
          message || 'Invalid invitation data. Please check the email address and selected role.'
        );
        validationError.status = 400;
        throw validationError;
      }

      if (status === 403) {
        console.log('⚠️ Permission denied');
        const permissionError: EnhancedError = new Error(
          message ||
            'You do not have permission to send invitations. Please contact your administrator.'
        );
        permissionError.status = 403;
        throw permissionError;
      }

      if (status === 500) {
        console.log('⚠️ Server error - likely email service configuration issue');

        // Check if the error message indicates email service failure
        const isEmailServiceError =
          message &&
          (message.includes('email') ||
            message.includes('API key') ||
            message.includes('Resend') ||
            message.includes("Échec de l'envoi"));

        if (isEmailServiceError) {
          const emailError: EnhancedError = new Error(
            'The invitation was created but the email could not be sent due to email service configuration. Please contact your administrator to configure the email service (Resend API key).'
          );
          emailError.status = 500;
          emailError.type = 'EMAIL_SERVICE_ERROR';
          throw emailError;
        }

        // For other 500 errors
        const serverError: EnhancedError = new Error(
          message ||
            'Server error occurred while creating the invitation. Please try again later or contact support.'
        );
        serverError.status = 500;
        throw serverError;
      }

      // For any other errors, provide a generic but helpful message
      const genericError: EnhancedError = new Error(
        message || 'Failed to send invitation. Please check your connection and try again.'
      );
      genericError.status = status || 0;
      throw genericError;
    }
  }

  // Revoke invitation
  static async revokeInvitation(storeId: number, invitationId: number): Promise<void> {
    await api.delete(`/store/${storeId}/invitations/${invitationId}`);
  }

  // Accept invitation (public endpoint)
  static async acceptInvitation(token: string, password: string): Promise<void> {
    const payload: AcceptInvitationRequest = { token, password };
    await api.post('/auth/invitations/accept', payload);
  }

  // Validate invitation token (public endpoint)
  static async validateInvitation(token: string): Promise<IInvitation> {
    const response = await api.get(`/auth/invitations/verify?token=${token}`);
    return response.data;
  }
}
