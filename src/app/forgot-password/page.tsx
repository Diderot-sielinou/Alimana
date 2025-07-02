'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to password reset email API
    console.log('Reset link sent to:', email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-2 text-center">Forgot your password?</h1>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Enter the email address associated with your account and we’ll send you a link to reset
          your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
            Send reset link
          </Button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Remember your password?{' '}
          <Link href="/login" className="text-amber-600 hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
