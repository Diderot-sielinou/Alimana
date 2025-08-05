'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Loader2 } from 'lucide-react';

export default function DashboardRedirector() {
  const { hasPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirection immédiate vers overview (peut être personnalisée plus tard avec des permissions)
    // if (hasPermission('dashboard.view')) {
    //   router.replace('/dashboard/overview');
    // } else if (hasPermission('products.read')) {
    //   router.replace('/dashboard/products');
    // } else if (hasPermission('sales.view')) {
    //   router.replace('/dashboard/sales');
    // } else {
    //   router.replace('/unauthorized'); // Page d'erreur custom
    // }
    router.replace('/dashboard/overview');
  }, [hasPermission, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin text-blue-600">
          <Loader2 size={48} />
        </div>
        <p className="text-lg font-medium text-gray-700">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
