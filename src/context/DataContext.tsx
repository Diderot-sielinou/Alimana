'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '@/lib/api'; // Your API call utility
import { mockData } from '@/constants/mocks/mockData';
import { useAuth } from './auth-context';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

// Types
type Product = { id: string; name: string; price: number; stock: number; status: string };
type Category = { id: string; name: string };
type PaymentMethod = { id: string; name: string; type: string };
type CashRegister = { id: string; label: string; isOpen: boolean };
type Role = { id: string; name: string };

type Employee = { id: string; name: string; role?: string; isActive?: boolean };
type Supplier = { id: string; name: string; contact: string };
type Sale = { id: string; date: string; items: string; total: number; employee: string };
type AuditLogEntry = {
  id: string;
  timestamp: string;
  action: string;
  description: string;
  user: string;
  role: string;
};

type DataContextType = {
  loading: boolean;
  products: Product[];
  categories: Category[];
  paymentMethods: PaymentMethod[];
  cashRegisters: CashRegister[];
  employees: Employee[];
  suppliers: Supplier[];
  roles: Role[];
  recentSales: Sale[];
  auditLog: AuditLogEntry[];
  updateEmployeeFields: (id: string, updates: Partial<Employee>) => Promise<void>;
  updateEmployeePermissions: (id: string, permissions: string[]) => Promise<void>;
  updateEmployeeProfilePicture: (id: string, file: File) => Promise<void>;
  disableEmployee: (id: string) => Promise<void>;

  refreshAll: () => Promise<void>;

  // Generic methods for each entity

  addProduct: (p: Product) => Promise<void>;
  updateProductStatus: (id: string, status: string) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  addCategory: (c: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  addPaymentMethod: (p: PaymentMethod) => Promise<void>;
  deletePaymentMethod: (id: string) => Promise<void>;

  addCashRegister: (r: CashRegister) => Promise<void>;
  toggleCashRegister: (id: string) => Promise<void>;

  addRole: (r: Role) => Promise<void>;
  deleteRole: (id: string) => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentMethods, setPaymentMethod] = useState<PaymentMethod[]>([]);
  const [cashRegisters, setCashRegister] = useState<CashRegister[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { storeContext } = useAuth();

  useEffect(() => {
    if (USE_MOCK) {
      setProducts(mockData.products);
      setEmployees(mockData.employees);
      setSuppliers(mockData.suppliers);
      setRecentSales(mockData.recentSales);
      setCategories(mockData.categories);
      setPaymentMethod(mockData.paymentMethods);
      setCashRegister(mockData.cashRegisters);
    }
    if (storeContext) {
      // refreshAll();
    }
  }, [storeContext]);

  // Initial data loading
  const refreshAll = async () => {
    setLoading(true);
    try {
      const [prodRes, empRes, supRes, salesRes, auditRes, catRes, paymRes, cashRes, roleRes] =
        await Promise.all([
          api.get('/products'),
          api.get('/employees'),
          api.get('/suppliers'),
          api.get('/sales'),
          api.get('/audit-log'),
          api.get('/categories'),
          api.get('/payment-methods'),
          api.get('/cash-registers'),
          api.get('/roles'),
        ]);

      setProducts(prodRes.data);
      setEmployees(empRes.data);
      setSuppliers(supRes.data);
      setRecentSales(salesRes.data);
      setAuditLog(auditRes.data);
      setCategories(catRes.data);
      setPaymentMethod(paymRes.data);
      setCashRegister(cashRes.data);
      setRoles(roleRes.data);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add product
  const addProduct = async (product: Product) => {
    try {
      if (USE_MOCK) {
        setProducts((prev) => [...prev, product]);
      } else {
        await api.post('/products', product);
        await refreshAll();
        logAudit('Add Product', `Product "${product.name}" added.`);
      }
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  // Update product status
  const updateProductStatus = async (productId: string, newStatus: string) => {
    try {
      if (USE_MOCK) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, status: newStatus } : p))
        );
      } else {
        await api.patch(`/products/${productId}/status`, { status: newStatus });
        await refreshAll();
        logAudit('Update Status', `Product status ${productId} → ${newStatus}`);
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      if (USE_MOCK) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      } else {
        await api.delete(`/products/${productId}`);
        await refreshAll();
        logAudit('Delete Product', `Product ID ${productId} deleted.`);
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  // Categories
  const addCategory = async (c: Category) => {
    if (USE_MOCK) {
      setCategories((prev) => [...prev, c]);
    } else {
      await api.post('/categories', c);
      await refreshAll();
    }
    logAudit('Add Category', c.name);
  };

  const deleteCategory = async (id: string) => {
    if (USE_MOCK) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } else {
      await api.delete(`/categories/${id}`);
      await refreshAll();
    }
    logAudit('Delete Category', id);
  };

  // Payment Methods
  const addPaymentMethod = async (p: PaymentMethod) => {
    if (USE_MOCK) {
      setPaymentMethod((prev) => [...prev, p]);
    } else {
      await api.post('/payment-methods', p);
      await refreshAll();
    }
    logAudit('Add Payment Method', p.name);
  };

  const deletePaymentMethod = async (id: string) => {
    if (USE_MOCK) {
      setPaymentMethod((prev) => prev.filter((p) => p.id !== id));
    } else {
      await api.delete(`/payment-methods/${id}`);
      await refreshAll();
    }
    logAudit('Delete Payment Method', id);
  };

  // Cash Register
  const addCashRegister = async (r: CashRegister) => {
    if (USE_MOCK) {
      setCashRegister((prev) => [...prev, r]);
    } else {
      await api.post('/cash-registers', r);
      await refreshAll();
    }
    logAudit('Add Cash Register', r.label);
  };

  const toggleCashRegister = async (id: string) => {
    if (USE_MOCK) {
      setCashRegister((prev) => prev.map((r) => (r.id === id ? { ...r, isOpen: !r.isOpen } : r)));
    } else {
      await api.patch(`/cash-registers/${id}/toggle`);
      await refreshAll();
    }
    logAudit('Toggle Cash Register', id);
  };

  // Roles
  const addRole = async (r: Role) => {
    if (USE_MOCK) {
      setRoles((prev) => [...prev, r]);
    } else {
      await api.post('/roles', r);
      await refreshAll();
    }
    logAudit('Add Role', r.name);
  };

  const deleteRole = async (id: string) => {
    if (USE_MOCK) {
      setRoles((prev) => prev.filter((r) => r.id !== id));
    } else {
      await api.delete(`/roles/${id}`);
      await refreshAll();
    }
    logAudit('Delete Role', id);
  };

  const logAudit = (action: string, description: string) => {
    setAuditLog((prev) => [
      ...prev,
      {
        id: `a`,
        timestamp: new Date().toISOString(),
        action,
        description,
        user: 'API User', // customize based on auth
        role: 'Admin',
      },
    ]);
  };

  const updateEmployeeFields = async (id: string, updates: Partial<Employee>) => {
    try {
      if (USE_MOCK) {
        setEmployees((prev) => prev.map((emp) => (emp.id === id ? { ...emp, ...updates } : emp)));
      } else {
        await api.patch(`/employees/${id}`, updates);
        await refreshAll();
      }
      logAudit('Edit Employee', `Fields updated for employee ID ${id}`);
    } catch (err) {
      console.error('Error updating employee fields:', err);
    }
  };

  const updateEmployeePermissions = async (id: string, permissions: string[]) => {
    try {
      if (USE_MOCK) {
        setEmployees((prev) => prev.map((emp) => (emp.id === id ? { ...emp, permissions } : emp)));
      } else {
        await api.patch(`/employees/${id}/permissions`, { permissions });
        await refreshAll();
      }
      logAudit('Edit Permissions', `Permissions updated for employee ID ${id}`);
    } catch (err) {
      console.error('Error updating permissions:', err);
    }
  };

  const updateEmployeeProfilePicture = async (id: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      if (!USE_MOCK) {
        await api.post(`/employees/${id}/profile-picture`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        await refreshAll();
      } else {
        console.log(`[MOCK] Upload profile picture for employee ID ${id}`);
      }

      logAudit('Profile Picture Updated', `Employee ID ${id}`);
    } catch (err) {
      console.error('Error updating profile picture:', err);
    }
  };

  const disableEmployee = async (id: string) => {
    try {
      if (USE_MOCK) {
        setEmployees((prev) =>
          prev.map((emp) => (emp.id === id ? { ...emp, isActive: false } : emp))
        );
      } else {
        await api.patch(`/employees/${id}/disable`);
        await refreshAll();
      }
      logAudit('Disable Employee', `Employee ID "${id}" disabled`);
    } catch (err) {
      console.error('Error disabling employee:', err);
    }
  };

  const value: DataContextType = {
    products,
    employees,
    suppliers,
    recentSales,
    auditLog,
    categories,
    paymentMethods,
    cashRegisters,
    roles,
    loading,
    refreshAll,
    addProduct,
    updateProductStatus,
    deleteProduct,
    addCategory,
    deleteCategory,
    addPaymentMethod,
    deletePaymentMethod,
    addCashRegister,
    toggleCashRegister,
    addRole,
    deleteRole,
    updateEmployeePermissions,
    updateEmployeeProfilePicture,
    updateEmployeeFields,
    disableEmployee,
  };

  return (
    <DataContext.Provider value={value}>
      {loading ? <div>Loading data...</div> : children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
