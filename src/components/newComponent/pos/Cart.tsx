// src/components/pos/Cart.tsx
'use client';

import React from 'react';
import { CartItem } from '@/types/pos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Minus, Plus, ShoppingCart } from 'lucide-react';

interface CartProps {
  items: CartItem[]; // Le tableau des articles dans le panier.
  onUpdateItem: (productId: number, updates: Partial<CartItem>) => void; //Pour modifier la quantité ou la remise d'un article.
  onRemoveItem: (productId: number) => void; // Pour supprimer un article.
  onClear: () => void;
  onCheckout: () => void; // Pour déclencher le processus de paiement.
  total: number; // e montant total calculé du panier
}

export const Cart: React.FC<CartProps> = ({
  items,
  onUpdateItem,
  onRemoveItem,
  onClear,
  onCheckout,
  total,
}) => {
  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity > 0) {
      onUpdateItem(productId, { quantity: newQuantity });
    }
  };

  const updateDiscount = (productId: number, discount: number) => {
    if (discount >= 0) {
      onUpdateItem(productId, { discount });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Cart</h2>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Cart Empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">
                      {item.product.sellingPrice.toLocaleString()} XAF
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveItem(item.product.id)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Quantité */}
                <div className="flex items-center space-x-2 mb-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="p-1 h-8 w-8"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                    className="w-16 text-center h-8"
                    min="1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="p-1 h-8 w-8"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>

                {/* Remise */}
                <div className="mb-3">
                  <label className="block text-xs text-gray-500 mb-1">Balance (XAF)</label>
                  <Input
                    type="number"
                    value={item.discount}
                    onChange={(e) => updateDiscount(item.product.id, parseInt(e.target.value) || 0)}
                    className="h-8"
                    min="0"
                    max={item.quantity * item.product.sellingPrice}
                  />
                </div>

                {/* Sous-total */}
                <div className="text-right">
                  <p className="font-semibold text-primary">{item.subtotal.toLocaleString()} XAF</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Total et checkout */}
      {items.length > 0 && (
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-900">Total:</span>
            <span className="text-2xl font-bold text-primary">{total.toLocaleString()} XAF</span>
          </div>
          <Button onClick={onCheckout} className="w-full" size="lg">
            Proceed to payment
          </Button>
        </div>
      )}
    </div>
  );
};

// 'use client';

// import React from 'react';
// import { CartItem } from '@/types/pos';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import {
//   ShoppingCart,
//   Trash2,
//   Plus,
//   Minus,
//   CreditCard,
//   Percent,
//   X
// } from 'lucide-react';
// import toast from 'react-hot-toast';

// interface CartProps {
//   items: CartItem[];
//   onUpdateItem: (productId: number, updates: Partial<CartItem>) => void;
//   onRemoveItem: (productId: number) => void;
//   onClear: () => void;
//   total: number;
//   onCheckout: () => void;
// }

// export const Cart: React.FC<CartProps> = ({
//   items,
//   onUpdateItem,
//   onRemoveItem,
//   onClear,
//   total,
//   onCheckout
// }) => {
//   const [customerName, setCustomerName] = React.useState('Client de passage');
//   const [showDiscounts, setShowDiscounts] = React.useState(false);

//   const updateQuantity = (productId: number, newQuantity: number) => {
//     if (newQuantity < 1) {
//       onRemoveItem(productId);
//       return;
//     }
//     onUpdateItem(productId, { quantity: newQuantity });
//   };

//   const updateDiscount = (productId: number, discount: number) => {
//     const item = items.find(i => i.product.id === productId);
//     if (!item) return;

//     const maxDiscount = item.quantity * item.product.price;
//     const validDiscount = Math.max(0, Math.min(discount, maxDiscount));

//     onUpdateItem(productId, { discount: validDiscount });
//   };

//   const getTotalItems = () => {
//     return items.reduce((sum, item) => sum + item.quantity, 0);
//   };

//   const getTotalDiscount = () => {
//     return items.reduce((sum, item) => sum + item.discount, 0);
//   };

//   const handleClearConfirm = () => {
//     if (items.length > 0) {
//       if (window.confirm('Êtes-vous sûr de vouloir vider le panier ?')) {
//         onClear();
//       }
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-sm border h-fit">
//       {/* Header */}
//       <div className="p-4 border-b">
//         <div className="flex items-center justify-between mb-2">
//           <h2 className="text-lg font-semibold text-gray-900 flex items-center">
//             <ShoppingCart className="w-5 h-5 mr-2" />
//             Panier
//           </h2>
//           <Badge variant="secondary" className="bg-primary/10 text-primary">
//             {getTotalItems()} articles
//           </Badge>
//         </div>

//         {/* Client */}
//         <div className="mt-3">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Client
//           </label>
//           <Input
//             value={customerName}
//             onChange={(e) => setCustomerName(e.target.value)}
//             placeholder="Nom du client"
//             className="text-sm"
//           />
//         </div>
//       </div>

//       {/* Items */}
//       <div className="max-h-96 overflow-y-auto">
//         {items.length === 0 ? (
//           <div className="p-8 text-center">
//             <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//             <p className="text-gray-500 text-sm">Votre panier est vide</p>
//             <p className="text-gray-400 text-xs mt-1">
//               Ajoutez des produits pour commencer
//             </p>
//           </div>
//         ) : (
//           <div className="p-4 space-y-3">
//             {items.map((item) => (
//               <div key={item.product.id} className="border rounded-lg p-3">
//                 <div className="flex items-start justify-between mb-2">
//                   <div className="flex-1">
//                     <h3 className="font-medium text-gray-900 text-sm">
//                       {item.product.name}
//                     </h3>
//                     <p className="text-xs text-gray-500">
//                       {item.product.price.toLocaleString()} XAF / unité
//                     </p>
//                   </div>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => onRemoveItem(item.product.id)}
//                     className="text-red-600 hover:text-red-700 p-1"
//                   >
//                     <X className="w-4 h-4" />
//                   </Button>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   {/* Contrôles de quantité */}
//                   <div className="flex items-center space-x-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
//                       className="w-8 h-8 p-0"
//                     >
//                       <Minus className="w-3 h-3" />
//                     </Button>
//                     <span className="w-8 text-center font-medium">
//                       {item.quantity}
//                     </span>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
//                       className="w-8 h-8 p-0"
//                     >
//                       <Plus className="w-3 h-3" />
//                     </Button>
//                   </div>

//                   {/* Prix */}
//                   <div className="text-right">
//                     <p className="font-semibold text-gray-900">
//                       {item.subtotal.toLocaleString()} XAF
//                     </p>
//                     {item.discount > 0 && (
//                       <p className="text-xs text-red-600">
//                         -{item.discount.toLocaleString()} XAF
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Remise */}
//                 {showDiscounts && (
//                   <div className="mt-2 pt-2 border-t">
//                     <label className="block text-xs text-gray-600 mb-1">
//                       Remise (XAF)
//                     </label>
//                     <Input
//                       type="number"
//                       value={item.discount}
//                       onChange={(e) => updateDiscount(item.product.id, parseInt(e.target.value) || 0)}
//                       className="h-8 text-xs"
//                       min="0"
//                       max={item.quantity * item.product.price}
//                     />
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Footer avec totaux et actions */}
//       {items.length > 0 && (
//         <div className="border-t p-4">
//           {/* Bouton remises */}
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => setShowDiscounts(!showDiscounts)}
//             className="w-full mb-3 text-xs"
//           >
//             <Percent className="w-3 h-3 mr-1" />
//             {showDiscounts ? 'Masquer' : 'Afficher'} les remises
//           </Button>

//           {/* Totaux */}
//           <div className="space-y-2 mb-4">
//             <div className="flex justify-between text-sm">
//               <span className="text-gray-600">Sous-total:</span>
//               <span>{(total + getTotalDiscount()).toLocaleString()} XAF</span>
//             </div>
//             {getTotalDiscount() > 0 && (
//               <div className="flex justify-between text-sm text-red-600">
//                 <span>Remise totale:</span>
//                 <span>-{getTotalDiscount().toLocaleString()} XAF</span>
//               </div>
//             )}
//             <div className="flex justify-between text-lg font-bold border-t pt-2">
//               <span>Total:</span>
//               <span className="text-primary">{total.toLocaleString()} XAF</span>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="space-y-2">
//             <Button
//               onClick={onCheckout}
//               className="w-full"
//               disabled={items.length === 0}
//             >
//               <CreditCard className="w-4 h-4 mr-2" />
//               Procéder au paiement
//             </Button>
//             <Button
//               variant="outline"
//               onClick={handleClearConfirm}
//               className="w-full text-red-600 hover:text-red-700"
//             >
//               <Trash2 className="w-4 h-4 mr-2" />
//               Vider le panier
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
