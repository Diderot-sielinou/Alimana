// src/components/layout/DashboardLayout.tsx
'use client';

import React from 'react';
// import { useRouter } from 'next/navigation';

// import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAuth } from '@/context/auth-context';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { isAuthenticated, storeContext, isLoading } = useAuth();
  // const router = useRouter();

  // React.useEffect(() => {
  //   if (!isLoading) {
  //     if (!isAuthenticated) {
  //       router.push('/signin');
  //     } else if (!storeContext) {
  //       router.push('/select-store');
  //     }
  //   }
  // }, [isAuthenticated, storeContext, isLoading, router]);

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       ijoooooooooooooo
  //       {/* <LoadingSpinner size="lg" /> */}
  //     </div>
  //   );
  // }

  if (!isAuthenticated || !storeContext) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};