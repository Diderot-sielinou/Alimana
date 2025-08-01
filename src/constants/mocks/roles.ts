import { Role } from '@/types/role';

export const rolesMock: Role[] = [
  {
    id: 1,
    name: 'Administrator',
    description: 'Full access to all features',
    permissions: ['create_user', 'edit_user', 'delete_user', 'view_sales', 'manage_roles'],
    active: true,
  },
  {
    id: 1,
    name: 'Cashier',
    description: 'Handles transactions at the counter.',
    permissions: ['Record sales', 'Manage returns', 'Access cash register'],
    active: true,
  },
  {
    id: 2,
    name: 'Stock Clerk',
    description: 'Responsible for inventory and deliveries.',
    permissions: ['Manage inventory', 'Receive products', 'Prepare orders'],
    active: true,
  },
  {
    id: 3,
    name: 'Manager',
    description: 'Oversees store operations.',
    permissions: ['Manage staff', 'View reports', 'Edit prices'],
    active: true,
  },
  {
    id: 2,
    name: 'Salesperson',
    description: 'Manages sales and products',
    permissions: ['view_sales', 'create_product', 'edit_product'],
    active: true,
  },
  {
    id: 3,
    name: 'Guest',
    description: 'Limited access to view only',
    permissions: ['view_product'],
    active: false,
  },
];
