// src/components/pos/PaymentModal.tsx
'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CartItem } from '@/types/pos';

import { api } from '@/lib/api';
import { CreditCard, Smartphone, Banknote, Building } from 'lucide-react';
import toast from 'react-hot-toast';
import { useShopData } from '@/context/store-context';
import { useAuth } from '@/context/auth-context';
import { ICreatePaymentDto } from '@/types/payment.interface';
import { IPaymentMethod } from '@/types/payment-method.interface';
import { ISaleResponse } from '@/types/sale-dto.interface';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  total: number;
  onPaymentComplete: (sale: ISaleResponse) => void;
  sessionId: number;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  total,
  onPaymentComplete,
  sessionId,
}) => {
  const { paymentMethods } = useShopData();
  const { storeContext } = useAuth();
  const [payments, setPayments] = React.useState<ICreatePaymentDto[]>([]);
  const [selectedMethod, setSelectedMethod] = React.useState<IPaymentMethod | null>(null);
  const [amount, setAmount] = React.useState('');
  const [reference, setReference] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [discount, setDiscount] = React.useState(0);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'cash':
        return Banknote;
      case 'card':
        return CreditCard;
      case 'mobile':
        return Smartphone;
      case 'bank_transfer':
        return Building;
      default:
        return CreditCard;
    }
  };

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const finalTotal = total - discount;
  const remaining = finalTotal - totalPaid;

  const addPayment = () => {
    if (!selectedMethod || !amount || parseFloat(amount) <= 0) {
      toast.error('Choose a method of payment and enter an amount');
      return;
    }

    if (selectedMethod.requiresReference && !reference.trim()) {
      toast.error('This payment method needs a reference');
      return;
    }

    const paymentAmount = parseFloat(amount);
    if (paymentAmount > remaining) {
      toast.error('The amount exceeds the remaining total');
      return;
    }

    const newPayment: ICreatePaymentDto = {
      paymentMethodId: selectedMethod.id,
      amount: paymentAmount,
      transactionReference: reference.trim(),
    };

    setPayments((prev) => [...prev, newPayment]);
    setAmount('');
    setReference('');
    setSelectedMethod(null);
  };

  const removePayment = (index: number) => {
    setPayments((prev) => prev.filter((_, i) => i !== index));
  };

  const processSale = async () => {
    if (remaining > 0) {
      toast.error('Payment incomplete');
      return;
    }

    setIsProcessing(true);
    try {
      const saleData = {
        cashRegisterSessionId: sessionId,
        saleItems: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          itemDiscount: item.discount,
        })),
        payments,
        notes: notes.trim() || undefined,
        discountAmount: discount,
      };

      const response = await api.post(`store/${storeContext?.storeId}/sales`, saleData);
      onPaymentComplete(response.data);
    } catch (error) {
      const err = error as Error;
      toast.error(`Error saving the sale ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Résumé */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span>Sub-total:</span>
              <span>{total.toLocaleString()} XAF</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span>Balance:</span>
              <Input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
                className="w-24 h-8 text-right"
                min="0"
                max={total}
              />
            </div>
            <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span className="text-primary">{finalTotal.toLocaleString()} XAF</span>
            </div>
          </div>

          {/* Méthodes de paiement */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Add a payment method</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {paymentMethods
                .filter((m) => m.isActive)
                .map((method) => {
                  const Icon = getMethodIcon(method.type);
                  return (
                    <Button
                      key={method.id}
                      variant={selectedMethod?.id === method.id ? 'default' : 'outline'}
                      onClick={() => setSelectedMethod(method)}
                      className="h-12 flex items-center justify-start space-x-2"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{method.name}</span>
                    </Button>
                  );
                })}
            </div>

            {selectedMethod && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount (XAF)
                    </label>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0"
                      min="0"
                      max={remaining}
                    />
                  </div>
                  {selectedMethod.requiresReference && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reference
                      </label>
                      <Input
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        placeholder="Numéro de transaction"
                      />
                    </div>
                  )}
                </div>
                <Button onClick={addPayment} className="w-full">
                  Add Payment
                </Button>
              </div>
            )}
          </div>

          {/* Paiements ajoutés */}
          {payments.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Payment</h3>
              <div className="space-y-2">
                {payments.map((payment, index) => {
                  const method = paymentMethods.find((m) => m.id === payment.paymentMethodId);
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <span className="font-medium">{method?.name}</span>
                        {payment.transactionReference && (
                          <span className="text-sm text-gray-500 ml-2">
                            ({payment.transactionReference})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{payment.amount.toLocaleString()} XAF</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePayment(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span>Amount to be paid:</span>
                  <span
                    className={`font-bold ${remaining === 0 ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {remaining.toLocaleString()} XAF
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes sur la vente..."
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={processSale}
              disabled={remaining > 0 || isProcessing}
              className="flex-1"
            >
              {isProcessing ? 'Traitement...' : 'Finaliser la vente'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
