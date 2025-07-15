'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/store-context';

interface Props {
  children: React.ReactNode;
}

export default function RequireStore({ children }: Props) {
  const router = useRouter();
  const { store } = useStore();

  useEffect(() => {
    if (!store?.id) {
      router.push('/select-store');
    }
  }, [store, router]);

  if (!store?.id) return null;

  return <>{children}</>;
}
