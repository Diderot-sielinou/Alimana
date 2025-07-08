'use client';

import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-slate-50">
      <ShieldAlert className="w-16 h-16 text-yellow-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">403 - Forbidden</h1>
      <p className="text-gray-600 mb-6">You don’t have permission to access this page.</p>
      <Link href="/">
        <Button className="bg-amber-600 hover:bg-amber-700">Go Home</Button>
      </Link>
    </div>
  );
}
