'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

import { Loader2 } from 'lucide-react';

export default function Page() {
  const { hasPermission, hasFetchedMe, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      // router.replace('/signin');
    }
    // if (!hasFetchedMe || isLoading) return;
    if (pathname === '/dashboard') {
      router.replace('/dashboard/overview');
    }

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
  }, [hasFetchedMe, isLoading, pathname, router, hasPermission, isAuthenticated]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin text-blue-600">
          <Loader2 size={48} />
        </div>
        <p className="text-lg font-medium text-gray-700">
          Redirection vers votre tableau de bord...
        </p>
      </div>
    </div>
  );
}
