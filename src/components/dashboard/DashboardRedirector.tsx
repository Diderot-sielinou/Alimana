'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

export default function DashboardRedirector() {
  const { hasPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/overview');
     // if (hasPermission('dashboard.view')) {
    //   router.replace('/dashboard/overview');
    // } else if (hasPermission('products.read')) {
    //   router.replace('/dashboard/products');
    // } else if (hasPermission('sales.view')) {
    //   router.replace('/dashboard/sales');
    // } else {
    //   router.replace('/unauthorized'); // Page d'erreur custom
    // }
  }, [hasPermission, router]);

  return <p>Redirection en cours...</p>;
}
