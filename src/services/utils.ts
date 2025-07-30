import { api } from '@/lib/api';

export type StoreSummary = {
  id: number;
  name: string;
  storeUserId: number;
  roleName: string;
  logoUrl: string;
  profileImageUrl: string;
};

export const getMyStores = async (): Promise<StoreSummary[]> => {
  const res = await api.get('/auth/my-stores');
  return res.data.stores;
};
