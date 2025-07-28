'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {

  // Store settings state
  const [storeData, setStoreData] = useState({
    storeName: '',
    storeEmail: '',
    phone: '',
    address: '',
    emailNotif: false,
    smsNotif: false,
    lowStock: '',
    acceptCash: true,
    acceptMobile: true,
  });

  // Simulate fetching data from backend
  useEffect(() => {
    const fetchData = async () => {
      // Replace with actual API call later
      const mockData = {
        storeName: 'My Super Store',
        storeEmail: 'store@example.com',
        phone: '+123 456 7890',
        address: '123 Market Street, City',
        emailNotif: true,
        smsNotif: false,
        lowStock: '5',
        acceptCash: true,
        acceptMobile: true,
      };
      setStoreData(mockData);
    };

    fetchData();
  }, []);

  // Handle save
  const handleSave = async () => {
    try {
      // Replace this with actual PUT/POST request
      console.log('Saving data:', storeData);
      // await fetch('/api/settings', { method: 'PUT', body: JSON.stringify(storeData) });
      alert('Settings saved (mock)');
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <div className="flex min-h-screen">

      <main className="flex-1 p-6 ml-0 md:ml-64 space-y-8">

        {/* General Info */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">General Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                value={storeData.storeName}
                onChange={(e) => setStoreData({ ...storeData, storeName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="storeEmail">Store Email</Label>
              <Input
                id="storeEmail"
                value={storeData.storeEmail}
                onChange={(e) => setStoreData({ ...storeData, storeEmail: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={storeData.phone}
                onChange={(e) => setStoreData({ ...storeData, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={storeData.address}
                onChange={(e) => setStoreData({ ...storeData, address: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <div className="flex items-center gap-4">
            <Label htmlFor="emailNotif">Email Alerts</Label>
            <Switch
              id="emailNotif"
              checked={storeData.emailNotif}
              onCheckedChange={(val) => setStoreData({ ...storeData, emailNotif: val })}
            />
          </div>
          <div className="flex items-center gap-4">
            <Label htmlFor="smsNotif">SMS Alerts</Label>
            <Switch
              id="smsNotif"
              checked={storeData.smsNotif}
              onCheckedChange={(val) => setStoreData({ ...storeData, smsNotif: val })}
            />
          </div>
        </section>

        {/* Inventory */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Inventory Preferences</h2>
          <div>
            <Label htmlFor="lowStock">Low Stock Threshold</Label>
            <Input
              id="lowStock"
              type="number"
              value={storeData.lowStock}
              onChange={(e) => setStoreData({ ...storeData, lowStock: e.target.value })}
            />
          </div>
        </section>

        {/* Payments */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Payment Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="acceptCash">Accept Cash</Label>
              <Switch
                id="acceptCash"
                checked={storeData.acceptCash}
                onCheckedChange={(val) => setStoreData({ ...storeData, acceptCash: val })}
              />
            </div>
            <div className="flex items-center gap-4">
              <Label htmlFor="acceptMobile">Accept Mobile Money</Label>
              <Switch
                id="acceptMobile"
                checked={storeData.acceptMobile}
                onCheckedChange={(val) => setStoreData({ ...storeData, acceptMobile: val })}
              />
            </div>
          </div>
        </section>

        {/* Save Button */}
        <Button onClick={handleSave} className="bg-orange-600 text-white hover:bg-orange-700">
          Save Settings
        </Button>
      </main>
    </div>
  );
}
