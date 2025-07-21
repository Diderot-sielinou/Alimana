// app/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getRedirectPath } from '@/lib/auth-redirect';

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

        const redirectPath = getRedirectPath(user);
        router.replace(redirectPath);
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
