// src/app/dashboard/pos/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CartItem } from '@/types/pos';
import { Button } from '@/components/ui/button';
import { Calculator, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

// Importez vos composants POS
import { ProductSearch } from '@/components/newComponent/pos/ProductSearch';
import { Cart } from '@/components/newComponent/pos/Cart';
import { PaymentModal } from '@/components/newComponent/pos/PaymentModal';
import { Receipt } from '@/components/newComponent/pos/Receipt';
import { useShopData } from '@/context/store-context';
import { IProduct } from '@/types/product.interface';
import { ISaleResponse } from '@/types/sale-dto.interface';

export default function PosPage() {
  // recupere la session de caisse ouverte par l'utilisateur actuellement connecte
  const { loadInitialData, openSession } = useShopData(); // Ajout de fetchShopData pour rafraîchir les données
  const router = useRouter();

  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [showPayment, setShowPayment] = React.useState(false);
  const [showReceipt, setShowReceipt] = React.useState(false);
  const [currentSale, setCurrentSale] = React.useState<ISaleResponse | null>(null);

  // const openSession: CashRegisterSession | undefined = React.useMemo(() => {
  //   return cashRegisters.find(cr =>
  //     // cr.storeId === currentStore?.id &&
  //     cr.currentSession?.status === 'open'
  //   )?.currentSession;
  // }, [cashRegisters, currentStore]);

  // Fonction pour ajouter un produit au panier
  const addToCart = (product: IProduct) => {
    const existingItem = cart.find((item) => item.product.id === product.id);
    if (existingItem) {
      // Vérifier le stock avant d'ajouter
      if (existingItem.quantity + 1 > product.quantityInStock) {
        toast.error(
          `Insufficient stock for ${product.name}. Available: ${product.quantityInStock}`
        );
        return;
      }
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * item.product.sellingPrice - item.discount,
              }
            : item
        )
      );
    } else {
      setCart((prevCart) => [
        ...prevCart,
        {
          product,
          quantity: 1,
          discount: 0,
          subtotal: product.sellingPrice, // Initial subtotal without discount
        },
      ]);
    }
    toast.success(`${product.name} added to cart.`);
  };

  // Fonction pour mettre à jour un article du panier
  const updateCartItem = (productId: number, updates: Partial<CartItem>) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.product.id === productId) {
          const updatedItem = { ...item, ...updates };
          // Assurez-vous que la quantité ne dépasse pas le stock
          if (updatedItem.quantity && updatedItem.quantity > item.product.quantityInStock) {
            toast.error(
              `Insufficient stock for ${item.product.name}. Max: ${item.product.quantityInStock}`
            );
            updatedItem.quantity = item.product.quantityInStock;
          }
          // Recalculer le sous-total après mise à jour (quantité ou remise)
          updatedItem.subtotal =
            (updatedItem.quantity || 0) * updatedItem.product.sellingPrice -
            (updatedItem.discount || 0);
          return updatedItem;
        }
        return item;
      })
    );
  };

  // Fonction pour retirer un article du panier
  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
    toast.success('Product removed from cart.');
  };

  // Fonction pour vider le panier
  const clearCart = () => {
    setCart([]);
    toast.error('Cart emptied.');
  };

  // Calcul du montant total du panier
  const getTotalAmount = (): number => {
    return cart.reduce((total, item) => total + item.subtotal, 0);
  };

  // Gère la complétion du paiement
  const handlePaymentComplete = (sale: ISaleResponse) => {
    setCurrentSale(sale);
    setShowPayment(false);
    setShowReceipt(true); // Ouvre le reçu
    clearCart(); // Vide le panier
    loadInitialData(); // Rafraîchit les données de la boutique pour mettre à jour les stocks, etc.
  };

  // Afficher un message si aucune session de caisse n'est ouverte
  if (!openSession) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No cash register is open</h2>
        <p className="text-gray-500 mb-6">Open a cash register session to make a sale</p>
        <Button onClick={() => router.push('/dashboard/cash-registers')}>
          Manage Cash Registers
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col  md:ml-64 min-h-screen bg-gray-50 dark:bg-gray-950 px-6 py-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
          <p className="text-gray-500">
            Session: {openSession?.id} • Initial cash: {openSession?.initialCash?.toLocaleString()}{' '}
            XAF
            {openSession?.id !== undefined && ( // Afficher le solde actuel si disponible
              <span className="ml-4">cashier: {openSession.openedBy?.user?.fullName}</span>
            )}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <ShoppingCart className="w-5 h-5 text-gray-400" />
          <span className="font-medium">{cart.length} article(s)</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recherche de produits */}
        <div className="lg:col-span-2">
          <ProductSearch onProductSelect={addToCart} />
        </div>

        {/* Panier */}
        <div>
          <Cart
            items={cart}
            onUpdateItem={updateCartItem}
            onRemoveItem={removeFromCart}
            onClear={clearCart}
            onCheckout={() => setShowPayment(true)}
            total={getTotalAmount()}
          />
        </div>
      </div>

      {/* Modal de paiement */}
      {showPayment && (
        <PaymentModal
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          cartItems={cart}
          total={getTotalAmount()}
          onPaymentComplete={handlePaymentComplete}
          sessionId={openSession.id} // Utiliser l'id de la session ouverte
        />
      )}

      {/* Reçu */}
      {showReceipt && currentSale && (
        <Receipt isOpen={showReceipt} onClose={() => setShowReceipt(false)} sale={currentSale} />
      )}
    </div>
  );
}
