export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Products</h1>
      <p className="text-gray-600">This page will show all your products, prices, and inventory.</p>

      <div className="border p-6 rounded-lg shadow-sm bg-white">
        <p className="text-sm text-gray-500">No products yet. Add some!</p>
      </div>
    </div>
  );
}
