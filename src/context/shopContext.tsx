'use client'; // Indique que ce fichier est un Composant Client

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

// Définition du type des données de boutique
type ShopData = {
  id: string;
  name: string;
  currency: string;
  timezone: string;
};

// Valeur initiale du contexte
type ShopContextType = {
  shopData: ShopData | null;
  loadingShop: boolean;
  updateShopInfo: (newInfo: Partial<ShopData>) => void;
};

// Création du contexte avec type explicite ou null par défaut
const ShopContext = createContext<ShopContextType | undefined>(undefined);

// Props attendues pour le provider
type ShopProviderProps = {
  children: ReactNode;
};

export function ShopProvider({ children }: ShopProviderProps) {
  const [shopData, setShopData] = useState<ShopData | null>(null);
  const [loadingShop, setLoadingShop] = useState<boolean>(false);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const mockData: ShopData = {
          id: 'shop1',
          name: 'Ma Boutique Next.js',
          currency: 'FCFA',
          timezone: 'Africa/Douala',
        };
        setShopData(mockData);
      } catch (error) {
        console.error("Erreur lors du chargement des données de la boutique:", error);
      } finally {
        setLoadingShop(false);
      }
    };

    fetchShopData();
  }, []);

  const updateShopInfo = (newInfo: Partial<ShopData>) => {
    setShopData((prev) => prev ? { ...prev, ...newInfo } : null);
    // Optionnel : appel API pour persister les modifications
  };

  const shopContextValue: ShopContextType = {
    shopData,
    loadingShop,
    updateShopInfo,
  };

  if (loadingShop) {
    return <div>Chargement des données de la boutique...</div>;
  }

  return (
    <ShopContext.Provider value={shopContextValue}>
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = (): ShopContextType => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop doit être utilisé à l\'intérieur d\'un ShopProvider');
  }
  return context;
};
