'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type StoreSession = {
  id: string;
  role: 'Admin' | 'Cashier' | 'Manager';
};

interface StoreContextType {
  store: StoreSession | null;
  setStore: (store: StoreSession) => void;
}

const StoreContext = createContext<StoreContextType>({
  store: null,
  setStore: () => {},
});

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [store, setStore] = useState<StoreSession | null>(null);

  return <StoreContext.Provider value={{ store, setStore }}>{children}</StoreContext.Provider>;
};

export const useStore = () => useContext(StoreContext);
