// "use client";

// import React from "react";

// type Props = {
//   categories: string[];
//   active: string;
//   onSelect: (category: string) => void;
// };

// export default function CategoryFilter({ categories, active, onSelect }: Props) {
//   return (
//     <div className="flex gap-2 flex-wrap">
//       {categories.map((category) => (
//         <button
//           key={category}
//           onClick={() => onSelect(category)}
//           className={`px-3 py-1 rounded text-sm ${
//             active === category
//               ? "bg-blue-600 text-white"
//               : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//           }`}
//         >
//           {category}
//         </button>
//       ))}
//     </div>
//   );
// }
