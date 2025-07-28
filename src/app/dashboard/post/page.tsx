// src/app/dashboard/pos/page.tsx
'use client';

import React from 'react';
import { use2Auth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { CartItem, Sale, CashRegisterSession } from '@/types/pos';
import { Button } from '@/components/ui/button';
import { Calculator, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

// Importez vos composants POS
import { ProductSearch } from '@/components/newComponent/pos/ProductSearch';
import { Cart } from '@/components/newComponent/pos/Cart';
import { PaymentModal } from '@/components/newComponent/pos/PaymentModal';
import { Receipt } from '@/components/newComponent/pos/Receipt';
import { useShopData } from '@/context/store-context';

export default function PosPage() {
  const { cashRegisters, loadInitialData } = useShopData(); // Ajout de fetchShopData pour rafraîchir les données
  const { currentStore } = use2Auth();
  const router = useRouter();

  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [showPayment, setShowPayment] = React.useState(false);
  const [showReceipt, setShowReceipt] = React.useState(false);
  const [currentSale, setCurrentSale] = React.useState<Sale | null>(null);

  // Trouver la session de caisse ouverte pour la boutique actuelle
    const openSession = cashRegisters.find(r => r.currentSession?.status === 'open');

  // const openSession: CashRegisterSession | undefined = React.useMemo(() => {
  //   return cashRegisters.find(cr =>
  //     // cr.storeId === currentStore?.id &&
  //     cr.currentSession?.status === 'open'
  //   )?.currentSession;
  // }, [cashRegisters, currentStore]);

  // Fonction pour ajouter un produit au panier
  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      // Vérifier le stock avant d'ajouter
      if (existingItem.quantity + 1 > product.stock) {
        toast.error(`Stock insuffisant pour ${product.name}. Disponible: ${product.stock}`);
        return;
      }
      setCart(prevCart =>
        prevCart.map(item =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * item.product.price - item.discount,
              }
            : item
        )
      );
    } else {
      setCart(prevCart => [
        ...prevCart,
        {
          product,
          quantity: 1,
          discount: 0,
          subtotal: product.price, // Initial subtotal without discount
        },
      ]);
    }
    toast.success(`${product.name} ajouté au panier.`);
  };

  // Fonction pour mettre à jour un article du panier
  const updateCartItem = (productId: number, updates: Partial<CartItem>) => {
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.product.id === productId) {
          const updatedItem = { ...item, ...updates };
          // Assurez-vous que la quantité ne dépasse pas le stock
          if (updatedItem.quantity && updatedItem.quantity > item.product.stock) {
            toast.error(`Stock insuffisant pour ${item.product.name}. Max: ${item.product.stock}`);
            updatedItem.quantity = item.product.stock;
          }
          // Recalculer le sous-total après mise à jour (quantité ou remise)
          updatedItem.subtotal = (updatedItem.quantity || 0) * updatedItem.product.price - (updatedItem.discount || 0);
          return updatedItem;
        }
        return item;
      })
    );
  };

  // Fonction pour retirer un article du panier
  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    toast.success('Article retiré du panier.');
  };

  // Fonction pour vider le panier
  const clearCart = () => {
    setCart([]);
    toast.error('Panier vidé.');
  };

  // Calcul du montant total du panier
  const getTotalAmount = (): number => {
    return cart.reduce((total, item) => total + item.subtotal, 0);
  };

  // Gère la complétion du paiement
  const handlePaymentComplete = (sale: Sale) => {
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
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Aucune session de caisse ouverte
        </h2>
        <p className="text-gray-500 mb-6">
          Vous devez ouvrir une session de caisse pour commencer les ventes.
        </p>
        <Button onClick={() => router.push('/dashboard/cash-registers')}>
          Gérer les caisses
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col  md:ml-64 min-h-screen bg-gray-50 dark:bg-gray-950 px-6 py-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Point de Vente</h1>
          <p className="text-gray-500">
            Session: {openSession?.name?'name':'noname'} • Solde Initial: {openSession?.currentSession?.initialCash.toLocaleString()} XAF
            {openSession?.currentSession?.id !== undefined && ( // Afficher le solde actuel si disponible
              <span className="ml-4">Solde Actuel: {openSession.isActive.toLocaleString()} XAF</span>
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
        <Receipt
          isOpen={showReceipt}
          onClose={() => setShowReceipt(false)}
          sale={currentSale}
        />
      )}
    </div>
  );
}