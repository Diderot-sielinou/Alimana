import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/auth-context';

interface StoreData {
  name: string;
  websiteUrl?: string;
  description: string;
  logoUrl?: string;
  email: string;
  phone: string;
  address: string;
}

export function StoreInfoForm() {
  const { storeContext } = useAuth();
  const storeId = storeContext?.storeId;
  const [storeData, setStoreData] = useState<StoreData>({
    name: '',
    websiteUrl: '',
    description: '',
    email: '',
    phone: '',
    address: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch store data on component mount
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await api.get(`/store/${storeId}`);
        console.log(response.data);
        setStoreData({
          name: response.data.name || '',
          websiteUrl: response.data.websiteUrl || '',
          description: response.data.description || '',
          logoUrl: response.data.logoUrl,
          email: response.data.email || '',
          phone: response.data.phone || '',
          address: response.data.address || '',
        });
      } catch (error) {
        toast.error('Failed to load store data');
        console.error('Error fetching store data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreData();
  }, [storeId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setStoreData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveBasicInfo = async () => {
    try {
      setIsSaving(true);
      await api.patch(`/store/${storeId}`, {
        name: storeData.name,
        websiteUrl: storeData.websiteUrl,
        description: storeData.description,
        logoUrl: storeData.logoUrl,
      });
      toast.success('Store information updated successfully');
    } catch (error) {
      toast.error('Failed to update store information');
      console.error('Error updating store:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveContactInfo = async () => {
    try {
      setIsSaving(true);
      await api.patch(`/store/${storeId}`, {
        email: storeData.email,
        phone: storeData.phone,
        address: storeData.address,
      });
      toast.success('Contact information updated successfully');
    } catch (error) {
      toast.error('Failed to update contact information');
      console.error('Error updating store:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading store data...</div>;
  }

  return (
    <div className="space-y-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
          <CardDescription>Update your store&apos;s basic information and branding</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Store Name</Label>
              <Input
                id="name"
                placeholder="My Awesome Store"
                value={storeData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">Store URL</Label>
              <Input
                id="websiteUrl"
                placeholder="mystore.com"
                value={storeData.websiteUrl || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Store Description</Label>
            <Textarea
              id="description"
              placeholder="Tell customers about your store..."
              rows={3}
              value={storeData.description}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Store Logo</Label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                <Image
                  src={storeData.logoUrl || ''}
                  alt="Store logo"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
                : (
                <Upload className="h-6 w-6 text-gray-400" />)
              </div>
              <Button variant="outline">Upload Logo</Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveBasicInfo} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Your store&apos;s contact details for customers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@mystore.com"
                value={storeData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+1 (555) 123-4567"
                value={storeData.phone}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Store Address</Label>
            <Textarea
              id="address"
              placeholder="123 Main St, City, State 12345"
              rows={3}
              value={storeData.address}
              onChange={handleInputChange}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveContactInfo} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Contact Info'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
