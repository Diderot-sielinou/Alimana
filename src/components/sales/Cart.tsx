// "use client";

// import React from "react";
// import { Product } from "./ProductCard";

// type Props = {
//   items: Product[];
//   onClear: () => void;
// };

// export default function Cart({ items, onClear }: Props) {
//   const subtotal = items.reduce((acc, item) => acc + item.price, 0);
//   const tax = subtotal * 0.1;
//   const total = subtotal + tax;

//   return (
//     <div className="border rounded p-4 mt-4">
//       <h2 className="text-lg font-semibold mb-2">Current Sale</h2>
//       {items.length === 0 ? (
//         <p className="text-sm text-gray-500">Your basket is empty.</p>
//       ) : (
//         <ul className="text-sm mb-2">
//           {items.map((item, idx) => (
//             <li key={idx} className="flex justify-between">
//               <span>{item.name}</span>
//               <span>${item.price.toFixed(2)}</span>
//             </li>
//           ))}
//         </ul>
//       )}
//       <div className="text-sm border-t pt-2 flex flex-col gap-1">
//         <div className="flex justify-between">
//           <span>Subtotal:</span>
//           <span>${subtotal.toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between">
//           <span>Tax (10%):</span>
//           <span>${tax.toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between font-semibold">
//           <span>Total:</span>
//           <span>${total.toFixed(2)}</span>
//         </div>
//       </div>
//       <div className="flex gap-2 mt-3">
//         <button
//           onClick={onClear}
//           className="flex-1 bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 text-sm"
//         >
//           Clear
//         </button>
//         <button
//           className="flex-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
//         >
//           Pay Now
//         </button>
//       </div>
//     </div>
//   );
// }
