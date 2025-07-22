// src/app/products/[id]/page.tsx

import { notFound } from 'next/navigation';

type Props = {
  params: {
    id: string;
  };
};

export default async function ProductPage({ params }: Props) {
  const { id } = params;

  // 🔁 À remplacer par un vrai fetch de produit
  const product = {
    id,
    name: 'Bread',
    description: 'Ceci est une description factice.',
    price: '19.99 €',
  };

  if (!product) {
    return notFound();
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Produit : {product.name}</h1>
      <p className="text-gray-700 mb-2">ID : {product.id}</p>
      <p className="text-gray-600 mb-4">{product.description}</p>
      <p className="text-lg font-semibold text-green-600">{product.price}</p>
    </div>
  );
}
