// "use client";

// import React from "react";

// export type Product = {
//   id: string;
//   name: string;
//   price: number;
//   image?: string;
// };

// type Props = {
//   product: Product;
//   onAdd: (product: Product) => void;
// };

// export default function ProductCard({ product, onAdd }: Props) {
//   return (
//     <div className="border rounded-lg p-4 flex flex-col items-center shadow hover:shadow-md transition">
//       <div className="w-24 h-24 bg-gray-100 flex items-center justify-center mb-2">
//         {product.image ? (
//           <img src={product.image} alt={product.name} className="object-cover" />
//         ) : (
//           <span className="text-gray-400">No Image</span>
//         )}
//       </div>
//       <h3 className="text-sm font-medium text-center">{product.name}</h3>
//       <p className="text-xs text-gray-500">${product.price.toFixed(2)}</p>
//       <button
//         onClick={() => onAdd(product)}
//         className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
//       >
//         + Add
//       </button>
//     </div>
//   );
// }
