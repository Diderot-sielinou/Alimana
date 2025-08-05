'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import { StoreInfoForm } from '@/components/dashboard/StoreInfoForm';
import { PaymentMethodsForm } from '@/components/dashboard/PaymentMethod';

export default function StoreSettingsPage() {
  const { storeContext } = useAuth();
  const storeId: number = storeContext?.storeId || 1;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSettings = async () => {
    try {
      const res = await api.get(`/store/${storeId}/settings`);
      console.log(res);
    } catch (err) {
      console.error(err);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading) return <div className="p-4">Loading settings...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your store configuration and preferences</p>
      </div>
      <StoreInfoForm />
      <PaymentMethodsForm storeId={storeId} />
    </div>
  );
}
