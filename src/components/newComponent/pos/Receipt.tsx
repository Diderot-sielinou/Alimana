// src/components/pos/Receipt.tsx
'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { ISaleResponse } from '@/types/sale-dto.interface';

interface ReceiptProps {
  isOpen: boolean;
  onClose: () => void;
  sale: ISaleResponse;
}

export const Receipt: React.FC<ReceiptProps> = ({ isOpen, onClose, sale }) => {
  console.log(`sale recus ${sale}`);
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt - ${sale.sale?.id}</title>
            <style>
              body { font-family: monospace; margin: 20px; }
              pre { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <pre>${sale?.receiptContent}</pre>
            <script>window.print(); window.close();</script>
          </body>
        </html>
      `);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Receipt</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-xs whitespace-pre-wrap font-mono">{sale?.receiptContent}</pre>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button onClick={handlePrint} className="flex-1">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// 'use client';

// import React from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Sale } from '@/types/pos';
// import { Printer, Download, X, Store } from 'lucide-react';
// import { useShopData } from '@/contexts/ShopDataContext';

// interface ReceiptProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onPrint: () => void;
//   sale: Sale;
// }

// export const Receipt: React.FC<ReceiptProps> = ({
//   isOpen,
//   onClose,
//   onPrint,
//   sale
// }) => {
//   const { store } = useShopData();

//   const formatDate = (date: string | Date) => {
//     return new Date(date).toLocaleString('fr-FR', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const handlePrint = () => {
//     const printContent = document.getElementById('receipt-content');
//     if (printContent) {
//       const printWindow = window.open('', '_blank');
//       if (printWindow) {
//         printWindow.document.write(`
//           <html>
//             <head>
//               <title>Reçu #${sale.saleNumber}</title>
//               <style>
//                 body { font-family: 'Courier New', monospace; font-size: 12px; margin: 20px; }
//                 .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
//                 .info { margin-bottom: 15px; }
//                 .items { margin-bottom: 15px; }
//                 .item { display: flex; justify-content: space-between; margin-bottom: 3px; }
//                 .totals { border-top: 1px solid #000; padding-top: 10px; }
//                 .total-line { display: flex; justify-content: space-between; margin-bottom: 3px; }
//                 .final-total { font-weight: bold; font-size: 14px; border-top: 1px solid #000; padding-top: 5px; }
//                 .payments { margin-top: 15px; border-top: 1px solid #000; padding-top: 10px; }
//                 .footer { text-align: center; margin-top: 20px; border-top: 1px solid #000; padding-top: 10px; }
//                 @media print { body { margin: 0; } }
//               </style>
//             </head>
//             <body>
//               ${printContent.innerHTML}
//             </body>
//           </html>
//         `);
//         printWindow.document.close();
//         printWindow.print();
//         printWindow.close();
//       }
//     }
//     onPrint();
//   };

//   const handleDownload = () => {
//     const receiptData = {
//       saleNumber: sale.saleNumber,
//       date: sale.createdAt,
//       items: sale.saleItems,
//       payments: sale.payments,
//       total: sale.totalAmount,
//       store: store
//     };

//     const dataStr = JSON.stringify(receiptData, null, 2);
//     const dataBlob = new Blob([dataStr], { type: 'application/json' });
//     const url = URL.createObjectURL(dataBlob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `receipt-${sale.saleNumber}.json`;
//     link.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center justify-between">
//             <span>Reçu de vente</span>
//             <Button variant="ghost" size="sm" onClick={onClose}>
//               <X className="w-4 h-4" />
//             </Button>
//           </DialogTitle>
//         </DialogHeader>

//         <div id="receipt-content" className="space-y-4 font-mono text-sm">
//           {/* En-tête du magasin */}
//           <div className="text-center border-b-2 border-black pb-4">
//             <div className="flex items-center justify-center mb-2">
//               <Store className="w-6 h-6 mr-2" />
//               <h2 className="text-lg font-bold">{store?.name || 'BOUTIQUE'}</h2>
//             </div>
//             {store?.address && (
//               <p className="text-xs">{store.address}</p>
//             )}
//             {store?.phone && (
//               <p className="text-xs">Tél: {store.phone}</p>
//             )}
//             {store?.email && (
//               <p className="text-xs">Email: {store.email}</p>
//             )}
//           </div>

//           {/* Informations de la vente */}
//           <div className="space-y-1">
//             <div className="flex justify-between">
//               <span>N° Vente:</span>
//               <span className="font-bold">{sale.saleNumber}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Date:</span>
//               <span>{formatDate(sale.createdAt)}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Caissier:</span>
//               <span>{sale.createdBy?.name || 'N/A'}</span>
//             </div>
//             {sale.customerName && (
//               <div className="flex justify-between">
//                 <span>Client:</span>
//                 <span>{sale.customerName}</span>
//               </div>
//             )}
//           </div>

//           {/* Articles */}
//           <div className="border-t border-gray-300 pt-2">
//             <h3 className="font-bold mb-2">ARTICLES</h3>
//             {sale.saleItems.map((item, index) => (
//               <div key={index} className="space-y-1 mb-2">
//                 <div className="flex justify-between">
//                   <span className="flex-1 truncate">{item.product.name}</span>
//                 </div>
//                 <div className="flex justify-between text-xs">
//                   <span>{item.quantity} x {item.product.price.toLocaleString()}</span>
//                   <span>{(item.quantity * item.product.price).toLocaleString()} XAF</span>
//                 </div>
//                 {item.itemDiscount > 0 && (
//                   <div className="flex justify-between text-xs text-red-600">
//                     <span>Remise article:</span>
//                     <span>-{item.itemDiscount.toLocaleString()} XAF</span>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* Totaux */}
//           <div className="border-t border-gray-300 pt-2 space-y-1">
//             <div className="flex justify-between">
//               <span>Sous-total:</span>
//               <span>{(sale.totalAmount + (sale.discountAmount || 0)).toLocaleString()} XAF</span>
//             </div>
//             {sale.discountAmount > 0 && (
//               <div className="flex justify-between text-red-600">
//                 <span>Remise totale:</span>
//                 <span>-{sale.discountAmount.toLocaleString()} XAF</span>
//               </div>
//             )}
//             <div className="flex justify-between font-bold text-lg border-t border-black pt-1">
//               <span>TOTAL:</span>
//               <span>{sale.totalAmount.toLocaleString()} XAF</span>
//             </div>
//           </div>

//           {/* Paiements */}
//           <div className="border-t border-gray-300 pt-2">
//             <h3 className="font-bold mb-2">PAIEMENTS</h3>
//             {sale.payments.map((payment, index) => (
//               <div key={index} className="flex justify-between text-xs mb-1">
//                 <span>
//                   {payment.paymentMethod.name}
//                   {payment.transactionReference && (
//                     <span className="text-gray-500"> ({payment.transactionReference})</span>
//                   )}
//                 </span>
//                 <span>{payment.amount.toLocaleString()} XAF</span>
//               </div>
//             ))}
//             <div className="flex justify-between font-bold border-t border-gray-300 pt-1">
//               <span>Total payé:</span>
//               <span>{sale.payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()} XAF</span>
//             </div>
//           </div>

//           {/* Notes */}
//           {sale.notes && (
//             <div className="border-t border-gray-300 pt-2">
//               <h3 className="font-bold mb-1">NOTES</h3>
//               <p className="text-xs">{sale.notes}</p>
//             </div>
//           )}

//           {/* Pied de page */}
//           <div className="text-center border-t-2 border-black pt-4 text-xs">
//             <p>Merci pour votre achat !</p>
//             <p>Conservez ce reçu</p>
//             <p className="mt-2">
//               Imprimé le {formatDate(new Date())}
//             </p>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex space-x-2 mt-6">
//           <Button onClick={handlePrint} className="flex-1">
//             <Printer className="w-4 h-4 mr-2" />
//             Imprimer
//           </Button>
//           <Button variant="outline" onClick={handleDownload} className="flex-1">
//             <Download className="w-4 h-4 mr-2" />
//             Télécharger
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };
