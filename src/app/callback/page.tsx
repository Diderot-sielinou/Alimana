'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get('token');

    if (token) {
      localStorage.setItem('accessToken', token); // or use cookies or context
      router.replace('/dashboard'); // Redirect to dashboard after login
    } else {
      // fallback or error
      router.replace('/signin');
    }
  }, [router]);

  return <p>Redirecting...</p>;
}
