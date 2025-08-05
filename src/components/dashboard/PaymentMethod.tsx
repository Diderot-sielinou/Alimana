'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { CreditCard, Smartphone, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '@/lib/api'; // Adjust the import path as needed

interface PaymentMethod {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

interface PaymentMethodWithIcon extends PaymentMethod {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
}

export function PaymentMethodsForm({ storeId }: { storeId: number }) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodWithIcon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  // Icon mapping for payment methods
  const getIconForPaymentMethod = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('credit') || lowerName.includes('card')) return CreditCard;
    if (lowerName.includes('mobile') || lowerName.includes('phone')) return Smartphone;
    if (lowerName.includes('cash')) return DollarSign;
    return CreditCard; // default
  };

  // Fetch payment methods on component mount
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/store/${storeId}/payment-methods`);

        // Add icons to the payment methods
        const methodsWithIcons = response.data.map((method: PaymentMethod) => ({
          ...method,
          icon: getIconForPaymentMethod(method.name),
          // Add default description if not provided by backend
          description: method.description || `Accept ${method.name} payments`,
        }));

        setPaymentMethods(methodsWithIcons);
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        toast.error('Failed to load payment methods');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [storeId]);

  const updatePaymentMethod = async (id: number, isActive: boolean) => {
    setIsUpdating(id);

    try {
      const response = await api.put(`/store/${storeId}/payment-methods/${id}`, {
        isActive,
      });

      // Update local state with the response data
      setPaymentMethods((prev) =>
        prev.map((method) =>
          method.id === id ? { ...method, isActive: response.data.isActive } : method
        )
      );

      toast.success(`Payment method ${isActive ? 'enabled' : 'disabled'} successfully`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error updating payment method:', error);

      // Revert the switch state on error
      setPaymentMethods((prev) =>
        prev.map((method) => (method.id === id ? { ...method, isActive: !isActive } : method))
      );

      // Handle different error types
      let errorMessage = 'Failed to update payment method';

      if (error.response?.status === 404) {
        errorMessage = 'Payment method not found';
      } else if (error.response?.status === 409) {
        errorMessage = error.response.data.message || 'Conflict updating payment method';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleToggle = (id: number, currentState: boolean) => {
    const newState = !currentState;

    // Optimistically update the UI
    setPaymentMethods((prev) =>
      prev.map((method) => (method.id === id ? { ...method, isActive: newState } : method))
    );

    // Make API call
    updatePaymentMethod(id, newState);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Configure which payment methods your store accepts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Configure which payment methods your store accepts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No payment methods found for this store.
            </div>
          ) : (
            paymentMethods.map((method) => {
              const Icon = method.icon;
              const isCurrentlyUpdating = isUpdating === method.id;

              return (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <Icon className="h-8 w-8 text-gray-600" />
                    <div>
                      <h3 className="font-medium">{method.name}</h3>
                      <p className="text-sm text-gray-500">{method.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isCurrentlyUpdating && (
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    )}
                    <Switch
                      checked={method.isActive}
                      onCheckedChange={() => handleToggle(method.id, method.isActive)}
                      disabled={isCurrentlyUpdating}
                    />
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
        <CardFooter>
          <div className="text-sm text-gray-500">
            {isUpdating !== null
              ? 'Updating payment method...'
              : 'Toggle switches to enable/disable payment methods'}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
