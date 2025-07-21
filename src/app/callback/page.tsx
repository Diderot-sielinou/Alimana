// app/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const checkUserProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
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
        router.replace('/signin');
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
