// app/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Handles authentication callback logic by fetching the authenticated user's profile and redirecting them to the appropriate page based on their account status.
 *
 * This page is rendered on the client and uses Next.js app router for navigation. It performs a client-side fetch to the `/auth/profile` API endpoint, determines the user's store and role status, and redirects accordingly:
 * - Redirects to `/create-store` if the user has no stores.
 * - Redirects to `/sales/create` if the user's role is "cashier".
 * - Redirects to `/dashboard` if the user has exactly one store.
 * - Redirects to `/select-store` if the user has multiple stores.
 * If an error occurs during the fetch or processing, the user is redirected to the `/signin` page.
 *
 * While processing, a centered message is displayed to inform the user that the sign-in process is underway.
 */
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const checkUserProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Failed to fetch user profile');

        const user = await res.json();

        if (!user.stores || user.stores.length === 0) {
          // No store yet
          router.replace('/create-store');
        } else if (user.role === 'cashier') {
          router.replace('/sales/create');
        } else if (user.stores.length === 1) {
          // Store already linked, go to dashboard
          router.replace('/dashboard');
        } else {
          // User has multiple stores
          router.replace('/select-store');
        }
      } catch (error) {
        console.error('Error during Google Sign-In callback:', error);
        router.replace('/signin'); // fallback
      }
    };

    checkUserProfile();
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-lg text-gray-600">Signing you in, please wait...</p>
    </div>
  );
}
