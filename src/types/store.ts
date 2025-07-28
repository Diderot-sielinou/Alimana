export interface StoreData {
  name: string;
  description: string;
  address: string;
  currency: string;
  city: string;
  state: string;
  zipCode: string;
  password: string;
  confirmPassword: string;
}

export type StoreField = keyof StoreData;

export type UpdateFormData = (field: StoreField, value: string) => void;

export type StoreErrors = Partial<Record<StoreField, string>>;
export enum Permission {
  // User Management
  MANAGE_USERS = 'manage_users',
  INVITE_USERS = 'invite_users',
  VIEW_USERS = 'view_users',

  // Product Management
  MANAGE_PRODUCTS = 'manage_products',
  ADD_PRODUCTS = 'add_products',
  EDIT_PRODUCTS = 'edit_products',
  DELETE_PRODUCTS = 'delete_products',
  VIEW_PRODUCTS = 'view_products',

  // Inventory Management
  MANAGE_INVENTORY = 'manage_inventory',
  VIEW_INVENTORY = 'view_inventory',
  UPDATE_STOCK = 'update_stock',

  // Sales & Orders
  MANAGE_ORDERS = 'manage_orders',
  VIEW_ORDERS = 'view_orders',
  PROCESS_ORDERS = 'process_orders',
  CANCEL_ORDERS = 'cancel_orders',

  // Sales Management
  MAKE_SALES = 'make_sales',
  VIEW_SALES = 'view_sales',
  MANAGE_SALES = 'manage_sales',

  // Analytics & Reports
  VIEW_ANALYTICS = 'view_analytics',
  VIEW_REPORTS = 'view_reports',
  EXPORT_DATA = 'export_data',

  // Store Settings
  MANAGE_STORE_SETTINGS = 'manage_store_settings',
  VIEW_STORE_SETTINGS = 'view_store_settings',
}