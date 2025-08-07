'use client';

import { ShieldOff } from 'lucide-react';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white dark:bg-gray-900 text-center">
      <ShieldOff className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
        You do not have the necessary permissions to access this page. If you believe this is an
        error, please contact an administrator.
      </p>

      <Link
        href="/dashboard"
        className="px-5 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
