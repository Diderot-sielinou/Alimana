// src/constants/permissions.ts

// Permission keys based on backend documentation
export const PERMISSION_KEYS = {
  // Dashboard & Reports
  ACCESS_STORE_DASHBOARD: 'access_store_dashboard',
  VIEW_FINANCIAL_REPORTS: 'view_financial_reports',
  VIEW_STOCK_REPORTS: 'view_stock_reports',
  VIEW_AUDIT_LOGS: 'view_audit_logs',

  // Sales & Cash Registers
  CREATE_SALE: 'create_sale',
  VIEW_SALES: 'view_sales',
  PROCESS_RETURNS: 'process_returns',
  MANAGE_CASH_REGISTERS: 'manage_cash_registers',
  MANAGE_PAYMENT_METHODS: 'manage_payment_methods',

  // Products & Inventory
  MANAGE_PRODUCTS: 'manage_products',
  MANAGE_CATEGORIES: 'manage_categories',
  VIEW_INVENTORY: 'view_inventory',

  // Users & Roles
  MANAGE_USERS: 'manage_users',
  MANAGE_ROLES: 'manage_roles',
  INVITE_USERS: 'invite_users',

  // Suppliers & Orders
  MANAGE_SUPPLIERS: 'manage_suppliers',
  CREATE_SUPPLIER_ORDER: 'create_supplier_order',

  // Expenses
  MANAGE_EXPENSES: 'manage_expenses',
  VIEW_EXPENSES: 'view_expenses',

  // Store Settings
  MANAGE_STORE_SETTINGS: 'manage_store_settings',
  CUSTOMIZE_RECEIPTS: 'customize_receipts',
} as const;

export const allPermissions = Object.values(PERMISSION_KEYS);

// Permission categories for UI grouping
export const PERMISSION_CATEGORIES = {
  'Dashboard & Reports': [
    PERMISSION_KEYS.ACCESS_STORE_DASHBOARD,
    PERMISSION_KEYS.VIEW_FINANCIAL_REPORTS,
    PERMISSION_KEYS.VIEW_STOCK_REPORTS,
    PERMISSION_KEYS.VIEW_AUDIT_LOGS,
  ],
  'Sales & Cash Registers': [
    PERMISSION_KEYS.CREATE_SALE,
    PERMISSION_KEYS.VIEW_SALES,
    PERMISSION_KEYS.PROCESS_RETURNS,
    PERMISSION_KEYS.MANAGE_CASH_REGISTERS,
    PERMISSION_KEYS.MANAGE_PAYMENT_METHODS,
  ],
  'Products & Inventory': [
    PERMISSION_KEYS.MANAGE_PRODUCTS,
    PERMISSION_KEYS.MANAGE_CATEGORIES,
    PERMISSION_KEYS.VIEW_INVENTORY,
  ],
  'Users & Roles': [
    PERMISSION_KEYS.MANAGE_USERS,
    PERMISSION_KEYS.MANAGE_ROLES,
    PERMISSION_KEYS.INVITE_USERS,
  ],
  'Suppliers & Orders': [PERMISSION_KEYS.MANAGE_SUPPLIERS, PERMISSION_KEYS.CREATE_SUPPLIER_ORDER],
  Expenses: [PERMISSION_KEYS.MANAGE_EXPENSES, PERMISSION_KEYS.VIEW_EXPENSES],
  'Store Settings': [PERMISSION_KEYS.MANAGE_STORE_SETTINGS, PERMISSION_KEYS.CUSTOMIZE_RECEIPTS],
} as const;
