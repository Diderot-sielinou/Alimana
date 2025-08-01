// // src/app/select-store/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Store, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { getMyStores, StoreSummary } from '@/services/utils';
import { LoadingSpinner } from '@/components/dashboard/LoadingSpinner';

export default function SelectStorePage() {
  const { user, selectStore } = useAuth();

  const [stores, setStores] = useState<StoreSummary[]>([]);
  const [loading, setLoading] = useState(true);
  console.log(user);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const data = await getMyStores();
        setStores(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des boutiques :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const handleStoreSelect = (store: StoreSummary) => {
    selectStore(store.storeUserId);
  };

  if (loading) return <LoadingSpinner></LoadingSpinner>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Select a store</h1>
            <p className="text-gray-500">
              <span>Welcome {user?.fullName} </span>
              Select the store you want to proceed with
            </p>
          </div>

          <div className="grid gap-4">
            {stores.map((store) => (
              <div
                key={store.id}
                onClick={() => handleStoreSelect(store)}
                className="p-6 border rounded-lg hover:border-primary hover:bg-primary/5 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      <Store className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{store.name}</h3>
                      <p className="text-gray-500 text-sm">Role: {store.roleName}</p>
                      <p className="text-gray-400 text-xs">
                        Currency: XAF • Fuseau: africa/daouala
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
