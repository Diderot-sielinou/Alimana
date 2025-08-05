/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/accept-invite/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import Joi from 'joi';
import { api } from '@/lib/api';

// Joi validation schema for the invitation acceptance form
const acceptInviteSchema = Joi.object({
  password: Joi.string().min(6).required().messages({
    'string.min': 'Le mot de passe doit contenir au moins {#limit} caractères.',
    'string.empty': 'Le mot de passe est requis.',
    'any.required': 'Le mot de passe est requis.',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Les mots de passe ne correspondent pas.',
    'string.empty': 'La confirmation du mot de passe est requise.',
    'any.required': 'La confirmation du mot de passe est requise.',
  }),
});

/**
 * Invitation acceptance page.
 * Allows an invited user to set their password and join a store.
 */
export default function AcceptInvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [invitationValid, setInvitationValid] = useState(true);
  const [invitationDetails, setInvitationDetails] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();

  // Check invitation token validity on page load
  useEffect(() => {
    const token = searchParams.get('token');
    // if (!token) {
    //   toast.error('Token d\'invitation manquant.');
    //   router.replace('/signin');
    //   return;
    // }

    const verifyInvitation = async () => {
      try {
        const response = await api.get(`/auth/invitations/verify?token=${token}`);
        setInvitationDetails(response.data);
        setInvitationValid(true);
      } catch (error: any) {
        console.error("Erreur de vérification d'invitation:", error);
        toast.error(error.response?.data?.message || "Token d'invitation invalide ou expiré.");
        router.replace('/signin');
      } finally {
        setLoading(false);
      }
    };

    verifyInvitation();
  }, [searchParams, router]);

  // Handles form submission for accepting the invitation
  const onSubmit = async (data: any) => {
    // --- Manual validation with Joi ---
    const { error } = acceptInviteSchema.validate(data, { abortEarly: false });

    if (error) {
      // Map Joi errors to React Hook Form
      error.details.forEach((detail) => {
        setError(detail.path[0] as string, {
          type: 'manual',
          message: detail.message,
        });
      });
      return; // Arrêter la soumission si la validation échoue
    }
    // --- Fin de la validation manuelle ---

    const token = searchParams.get('token');
    if (!token) {
      toast.error("Token d'invitation manquant.");
      return;
    }

    try {
      await api.post('/auth/invitations/accept', {
        token: token,
        password: data.password,
      });
      toast.success('Invitation acceptée ! Vous pouvez maintenant vous connecter.');
      router.replace('/login'); // Redirige vers la page de connexion
    } catch (error: any) {
      console.error("Erreur lors de l'acceptation de l'invitation:", error);
      toast.error(error.response?.data?.message || "Échec de l'acceptation de l'invitation.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Verifying invitation...</p>
      </div>
    );
  }

  if (!invitationValid) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50 p-4">
        <div className="text-center p-8 bg-white rounded-xl shadow-2xl border border-red-200">
          <h1 className="text-3xl font-bold text-red-700 mb-4">Invitation Invalid</h1>
          <p className="text-gray-600">The invitation link is invalid or has expired.</p>
          <Button onClick={() => router.replace('/')} className="mt-6">
            Return to landing page{' '}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-6">
          Accept Invitation
        </h1>
        {invitationDetails && (
          <p className="text-center text-gray-700 mb-6">
            You have been invited to join the store{' '}
            <span className="font-semibold text-blue-600">{invitationDetails.storeName}</span> as a{' '}
            <span className="font-semibold text-blue-600">{invitationDetails.roleName}</span>.
            <br />
            Your email: <span className="font-semibold">{invitationDetails.email}</span>
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className="w-full"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message as string}</p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword')}
              className="w-full"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message as string}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full py-3 text-lg" disabled={isSubmitting}>
            {isSubmitting ? 'Acceptation en cours...' : "Accepter l'Invitation"}
          </Button>
        </form>
      </div>
    </div>
  );
}
