// 'use client';

// import React, { useState, useEffect } from 'react';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Switch } from '@/components/ui/switch';
// import { Button } from '@/components/ui/button';

// export default function SettingsPage() {

//   // Store settings state
//   const [storeData, setStoreData] = useState({
//     storeName: '',
//     storeEmail: '',
//     phone: '',
//     address: '',
//     emailNotif: false,
//     smsNotif: false,
//     lowStock: '',
//     acceptCash: true,
//     acceptMobile: true,
//   });

//   // Simulate fetching data from backend
//   useEffect(() => {
//     const fetchData = async () => {
//       // Replace with actual API call later
//       const mockData = {
//         storeName: 'My Super Store',
//         storeEmail: 'store@example.com',
//         phone: '+123 456 7890',
//         address: '123 Market Street, City',
//         emailNotif: true,
//         smsNotif: false,
//         lowStock: '5',
//         acceptCash: true,
//         acceptMobile: true,
//       };
//       setStoreData(mockData);
//     };

//     fetchData();
//   }, []);

//   // Handle save
//   const handleSave = async () => {
//     try {
//       // Replace this with actual PUT/POST request
//       console.log('Saving data:', storeData);
//       // await fetch('/api/settings', { method: 'PUT', body: JSON.stringify(storeData) });
//       alert('Settings saved (mock)');
//     } catch (error) {
//       console.error('Error saving settings:', error);
//     }
//   };

//   return (
//     <div className="flex min-h-screen">

//       <main className="flex-1 p-6 ml-0 md:ml-64 space-y-8">

//         {/* General Info */}
//         <section className="space-y-4">
//           <h2 className="text-xl font-semibold">General Information</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Label htmlFor="storeName">Store Name</Label>
//               <Input
//                 id="storeName"
//                 value={storeData.storeName}
//                 onChange={(e) => setStoreData({ ...storeData, storeName: e.target.value })}
//               />
//             </div>
//             <div>
//               <Label htmlFor="storeEmail">Store Email</Label>
//               <Input
//                 id="storeEmail"
//                 value={storeData.storeEmail}
//                 onChange={(e) => setStoreData({ ...storeData, storeEmail: e.target.value })}
//               />
//             </div>
//             <div>
//               <Label htmlFor="phone">Phone Number</Label>
//               <Input
//                 id="phone"
//                 value={storeData.phone}
//                 onChange={(e) => setStoreData({ ...storeData, phone: e.target.value })}
//               />
//             </div>
//             <div>
//               <Label htmlFor="address">Address</Label>
//               <Input
//                 id="address"
//                 value={storeData.address}
//                 onChange={(e) => setStoreData({ ...storeData, address: e.target.value })}
//               />
//             </div>
//           </div>
//         </section>

//         {/* Notifications */}
//         <section className="space-y-4">
//           <h2 className="text-xl font-semibold">Notifications</h2>
//           <div className="flex items-center gap-4">
//             <Label htmlFor="emailNotif">Email Alerts</Label>
//             <Switch
//               id="emailNotif"
//               checked={storeData.emailNotif}
//               onCheckedChange={(val) => setStoreData({ ...storeData, emailNotif: val })}
//             />
//           </div>
//           <div className="flex items-center gap-4">
//             <Label htmlFor="smsNotif">SMS Alerts</Label>
//             <Switch
//               id="smsNotif"
//               checked={storeData.smsNotif}
//               onCheckedChange={(val) => setStoreData({ ...storeData, smsNotif: val })}
//             />
//           </div>
//         </section>

//         {/* Inventory */}
//         <section className="space-y-4">
//           <h2 className="text-xl font-semibold">Inventory Preferences</h2>
//           <div>
//             <Label htmlFor="lowStock">Low Stock Threshold</Label>
//             <Input
//               id="lowStock"
//               type="number"
//               value={storeData.lowStock}
//               onChange={(e) => setStoreData({ ...storeData, lowStock: e.target.value })}
//             />
//           </div>
//         </section>

//         {/* Payments */}
//         <section className="space-y-4">
//           <h2 className="text-xl font-semibold">Payment Preferences</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="flex items-center gap-4">
//               <Label htmlFor="acceptCash">Accept Cash</Label>
//               <Switch
//                 id="acceptCash"
//                 checked={storeData.acceptCash}
//                 onCheckedChange={(val) => setStoreData({ ...storeData, acceptCash: val })}
//               />
//             </div>
//             <div className="flex items-center gap-4">
//               <Label htmlFor="acceptMobile">Accept Mobile Money</Label>
//               <Switch
//                 id="acceptMobile"
//                 checked={storeData.acceptMobile}
//                 onCheckedChange={(val) => setStoreData({ ...storeData, acceptMobile: val })}
//               />
//             </div>
//           </div>
//         </section>

//         {/* Save Button */}
//         <Button onClick={handleSave} className="bg-orange-600 text-white hover:bg-orange-700">
//           Save Settings
//         </Button>
//       </main>
//     </div>
//   );
// }
'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
// import axios from 'axios';
import { toast } from 'sonner';
import { api } from '@/lib/api';
// import { fetchStoreSettings, updateStoreSetting } from '@/services/storeSettings';

type StoreSettingType = 'string' | 'number' | 'boolean' | 'json';

interface StoreSetting {
  key: string;
  value: string;
  type: StoreSettingType;
  isEditable: boolean;
  description?: string;
}

interface StoreSettingsData {
  store_name: string;
  store_email: string;
  phone_number: string;
  store_address: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  low_stock_threshold: string;
  accept_cash_payments: boolean;
  accept_mobile_payments: boolean;
  store_currency: string;
  store_timezone: string;
  profile_image_url?: string;
  logo_url?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface StoreSettingResponse {
  id: number;
  key: string;
  value: string;
  type: StoreSettingType;
  isEditable: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

const fetchStoreSettings = async (storeId: number): Promise<StoreSettingResponse[]> => {
  const response = await api.get(`${API_BASE_URL}/store/${storeId}/settings`);
  return response.data;
};

const updateStoreSetting = async (
  storeId: number,
  key: string,
  value: string
): Promise<StoreSettingResponse> => {
  const response = await api.patch(`${API_BASE_URL}/store/${storeId}/settings/${key}`, { value });
  return response.data;
};

export default function SettingsPage() {
  const { storeContext } = useAuth();
  const storeId: number = storeContext?.storeId || 1;
  const [settings, setSettings] = useState<StoreSetting[]>([]);
  const [formData, setFormData] = useState<Partial<StoreSettingsData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch data from backend
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await fetchStoreSettings(storeId);
        console.log(data);
        setSettings(data);

        // Transform settings to form data
        const initialFormData = data.reduce((acc, setting) => {
          let value: string | boolean | number | object | null = setting.value;

          // Convert based on type
          switch (setting.type) {
            case 'boolean':
              value = value === 'true';
              break;
            case 'number':
              value = String(value); // Keep as string for input fields
              break;
            case 'json':
              try {
                value = JSON.parse(value);
              } catch {
                value = null;
              }
              break;
          }

          return { ...acc, [setting.key]: value };
        }, {} as Partial<StoreSettingsData>);

        setFormData(initialFormData);
      } catch (error) {
        toast('Failed to load store settings');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [storeId]);

  const handleChange = (key: string, value: string | boolean | number | object | null) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Find changed settings
      const changedSettings = settings.filter((setting) => {
        const currentValue = formData[setting.key as keyof StoreSettingsData];
        let formattedValue = currentValue;

        // Format value for backend
        if (setting.type === 'boolean') {
          formattedValue = currentValue ? 'true' : 'false';
        } else if (setting.type === 'json') {
          formattedValue = JSON.stringify(currentValue);
        }

        return formattedValue !== setting.value;
      });

      // Update changed settings
      await Promise.all(
        changedSettings.map(async (setting) => {
          const currentValue = formData[setting.key as keyof StoreSettingsData];
          let valueToSend = currentValue;

          if (setting.type === 'boolean') {
            valueToSend = currentValue ? 'true' : 'false';
          } else if (setting.type === 'json') {
            valueToSend = JSON.stringify(currentValue);
          }

          await updateStoreSetting(storeId, setting.key, String(valueToSend));
        })
      );

      toast('Settings saved successfully');

      // Refresh settings after update
      const updatedSettings = await fetchStoreSettings(storeId);
      setSettings(updatedSettings);
    } catch (error) {
      toast('Failed to save settings');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading settings...</div>;
  }

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-6 ml-0 md:ml-64 space-y-8">
        {/* General Info */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">General Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="store_name">Store Name</Label>
              <Input
                id="store_name"
                value={formData.store_name || ''}
                onChange={(e) => handleChange('store_name', e.target.value)}
                disabled={!settings.find((s) => s.key === 'store_name')?.isEditable}
              />
            </div>
            <div>
              <Label htmlFor="store_email">Store Email</Label>
              <Input
                id="store_email"
                type="email"
                value={formData.store_email || ''}
                onChange={(e) => handleChange('store_email', e.target.value)}
                disabled={!settings.find((s) => s.key === 'store_email')?.isEditable}
              />
            </div>
            <div>
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                type="tel"
                value={formData.phone_number || ''}
                onChange={(e) => handleChange('phone_number', e.target.value)}
                disabled={!settings.find((s) => s.key === 'phone_number')?.isEditable}
              />
            </div>
            <div>
              <Label htmlFor="store_address">Address</Label>
              <Input
                id="store_address"
                value={formData.store_address || ''}
                onChange={(e) => handleChange('store_address', e.target.value)}
                disabled={!settings.find((s) => s.key === 'store_address')?.isEditable}
              />
            </div>
            <div>
              <Label htmlFor="store_currency">Currency</Label>
              <select
                id="store_currency"
                value={formData.store_currency || 'USD'}
                onChange={(e) => handleChange('store_currency', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!settings.find((s) => s.key === 'store_currency')?.isEditable}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="XOF">FCFA (XOF)</option>
              </select>
            </div>
            <div>
              <Label htmlFor="store_timezone">Timezone</Label>
              <select
                id="store_timezone"
                value={formData.store_timezone || 'UTC'}
                onChange={(e) => handleChange('store_timezone', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!settings.find((s) => s.key === 'store_timezone')?.isEditable}
              >
                <option value="UTC">UTC</option>
                <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                <option value="Africa/Abidjan">Africa/Abidjan (GMT)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <div className="flex items-center gap-4">
            <Label htmlFor="email_notifications">Email Alerts</Label>
            <Switch
              id="email_notifications"
              checked={formData.email_notifications || false}
              onCheckedChange={(val) => handleChange('email_notifications', val)}
              disabled={!settings.find((s) => s.key === 'email_notifications')?.isEditable}
            />
          </div>
          <div className="flex items-center gap-4">
            <Label htmlFor="sms_notifications">SMS Alerts</Label>
            <Switch
              id="sms_notifications"
              checked={formData.sms_notifications || false}
              onCheckedChange={(val) => handleChange('sms_notifications', val)}
              disabled={!settings.find((s) => s.key === 'sms_notifications')?.isEditable}
            />
          </div>
        </section>

        {/* Inventory */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Inventory Preferences</h2>
          <div>
            <Label htmlFor="low_stock_threshold">Low Stock Threshold</Label>
            <Input
              id="low_stock_threshold"
              type="number"
              min="1"
              value={formData.low_stock_threshold || '5'}
              onChange={(e) => handleChange('low_stock_threshold', e.target.value)}
              disabled={!settings.find((s) => s.key === 'low_stock_threshold')?.isEditable}
            />
          </div>
        </section>

        {/* Payments */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Payment Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="accept_cash_payments">Accept Cash</Label>
              <Switch
                id="accept_cash_payments"
                checked={formData.accept_cash_payments || false}
                onCheckedChange={(val) => handleChange('accept_cash_payments', val)}
                disabled={!settings.find((s) => s.key === 'accept_cash_payments')?.isEditable}
              />
            </div>
            <div className="flex items-center gap-4">
              <Label htmlFor="accept_mobile_payments">Accept Mobile Money</Label>
              <Switch
                id="accept_mobile_payments"
                checked={formData.accept_mobile_payments || false}
                onCheckedChange={(val) => handleChange('accept_mobile_payments', val)}
                disabled={!settings.find((s) => s.key === 'accept_mobile_payments')?.isEditable}
              />
            </div>
          </div>
        </section>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          className="bg-orange-600 text-white hover:bg-orange-700"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </main>
    </div>
  );
}
