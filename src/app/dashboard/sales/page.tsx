// "use client";

// import React, { useState } from "react";
// import Sidebar from "@/components/sidebar";
// import { LayoutDashboard, ShoppingCart, Settings } from "lucide-react";

// import ProductList from "@/components/sales/ProductList";
// import ProductCard from "@/components/sales/ProductCard";
// import SearchBar from "@/components/sales/SearchBar";
// import CategoryFilter from "@/components/sales/CategoryFilter";
// import Cart from "@/components/sales/Cart";

// export default function SalesPage() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const sidebarLinks = [
//     {
//       href: "/dashboard",
//       label: "Dashboard",
//       icon: LayoutDashboard,
//     },
//     {
//       href: "/dashboard/sales",
//       label: "Sales",
//       icon: ShoppingCart,
//     },
//     {
//       href: "/dashboard/settings",
//       label: "Settings",
//       icon: Settings,
//     },
//   ];

//   return (
//     <div className="flex min-h-screen">
//       {/* Sidebar */}
//       <Sidebar
//         sidebarOpen={sidebarOpen}
//         setSidebarOpen={setSidebarOpen}
//         links={sidebarLinks}
//       />

//       {/* Main Content */}
//       <main className="flex-1 p-6 ml-0 md:ml-64">
//         <div className="mb-4">
//           <button
//             onClick={() => setSidebarOpen(true)}
//             className="md:hidden px-3 py-2 bg-orange-600 text-white rounded"
//           >
//             ☰ Menu
//           </button>
//         </div>

//         <div className="mb-4">
//           <h1 className="text-2xl font-bold">Sales Terminal</h1>
//           <p className="text-gray-500 text-sm">
//             Cashier: John Doe · Shift: Morning
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="md:col-span-2 flex flex-col gap-4">
//             {/* SearchBar */}
//             <SearchBar value="" onChange={() => {}} />

//             {/* CategoryFilter */}
//             <CategoryFilter
//               categories={["All", "Electronics", "Groceries", "Clothing"]}
//               active="All"
//               onSelect={() => {}}
//             />

//             {/* ProductCard Example */}
//             <ProductCard
//               product={{ id: "sample", name: "Sample Product", price: 0 }}
//               onAdd={() => {}}
//             />

//             {/* ProductList */}
//             <ProductList />
//           </div>

//           <div>
//             {/* Cart */}
//             <Cart items={[]} onClear={() => {}} />
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
