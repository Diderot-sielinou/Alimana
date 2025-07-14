'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useStore } from '@/context/store-context';

interface Store {
  storeId: string;
  storeUserId: number;
  name: string;
  logo?: string;
  role: 'Admin' | 'Cashier' | 'Manager';
}

export default function SelectStorePage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { setStore } = useStore();

  useEffect(() => {
    async function fetchStores() {
      try {
        const res = await fetch('/api/stores/linked-to-user', {
          method: 'GET',
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch stores');
        const data = await res.json();
        setStores(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStores();
  }, []);

  const handleSelect = async (store: Store) => {
    try {
      const res = await fetch('/api/auth/select-store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeUserId: store.storeUserId }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to select store');
      setStore({ id: store.storeId, role: store.role });
      router.push(store.role === 'Cashier' ? '/sales/create' : '/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to select store');
    }
  };

  if (loading) return <p className="p-6 text-center">Loading stores...</p>;

  if (stores.length === 0) {
    return <p className="p-6 text-center text-slate-500">No stores found for this account.</p>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <h1 className="text-center text-2xl font-bold mb-6">Select a Store</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {stores.map((store) => (
          <Card key={store.storeUserId} className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                {store.name}
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                  {store.role}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              {store.logo ? (
                <Image
                  src={store.logo}
                  alt={store.name}
                  width={80}
                  height={80}
                  className="rounded-full border object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-gray-500">
                  No Logo
                </div>
              )}
              <Button
                onClick={() => handleSelect(store)}
                className="w-full bg-amber-600 hover:bg-amber-700"
              >
                Access Store
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
