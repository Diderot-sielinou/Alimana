'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GoogleAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const checkUserStore = async () => {
      try {
        const res = await fetch('/api/me'); // get logged-in user & their store
        if (!res.ok) throw new Error('Failed to fetch user');
        const data = await res.json();

        if (data.store) {
          router.replace('/dashboard'); // ✅ already has store
        } else {
          router.replace('/create-store'); // 🚫 no store yet
        }
      } catch (error) {
        console.error('Error checking user store:', error);
        router.replace('/signin'); // fallback if something breaks
      }
    };

    checkUserStore();
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-gray-600 text-sm">Redirecting...</p>
    </div>
  );
}
