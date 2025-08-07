import { api } from '@/lib/api';
import { ICategory } from '@/types/category.interface';
import { IProduct } from '@/types/product.interface';

export type StoreSummary = {
  id: number;
  name: string;
  storeUserId: number;
  roleName: string;
  logoUrl: string;
  profileImageUrl: string;
};

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const getMyStores = async (): Promise<StoreSummary[]> => {
  const res = await api.get('/auth/my-stores');
  return res.data.stores;
};

export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id: number, storId: number) => api.get(`/store/${storId}/category/${id}`),
  create: (data: Partial<ICategory>, storId: number) => api.post(`/store/${storId}/category`, data),
  update: (id: number, data: Partial<ICategory>, storId: number) =>
    api.put(`/store/${storId}/category/${id}`, data),
  delete: (id: number, storId: number) => api.delete(`/store/${storId}/category/${id}`),
};

export const productAPI = {
  getAll: (
    params?: { page?: number; limit?: number; search?: string; categoryId?: number },
    storId?: number
  ) => api.get<PaginatedResponse<IProduct>>(`/store/${storId}/product`, { params }),
  getById: (id: number, storId: number) => api.get(`/store/${storId}/product/${id}`),
  create: (data: Partial<IProduct>, storId: number) => api.post(`/store/${storId}/product?`, data),
  update: (id: number, data: Partial<IProduct>, storId: number) =>
    api.patch(`/store/${storId}/product/${id}`, data),
  delete: (id: number, storId: number) => api.delete(`/store/${storId}/product/${id}`),
  toggleActive: (id: number, storId: number) =>
    api.patch<ApiResponse<IProduct>>(`/store/${storId}/product/${id}/toggle-active`),
};
