export const mockData = {
  products: [
    { id: 'p1', name: 'T-shirt Coton', price: 2500, stock: 45, status: 'actif' },
    { id: 'p2', name: 'Jean Slim', price: 5000, stock: 12, status: 'inactif' },
  ],

  categories: [
    { id: 'c1', name: 'Vêtements' },
    { id: 'c2', name: 'Chaussures' },
  ],

  paymentMethods: [
    { id: 'pm1', name: 'Espèces', type: 'cash' },
    { id: 'pm2', name: 'Carte bancaire', type: 'card' },
  ],

  cashRegisters: [
    { id: 'cr1', label: 'Caisse principale', isOpen: true },
    { id: 'cr2', label: 'Caisse secondaire', isOpen: false },
  ],

  employees: [
    { id: 'e1', name: 'Alice Dupont', roleId: 'r1' },
    { id: 'e2', name: 'Bob Martin', roleId: 'r2' },
  ],

  roles: [
    { id: 'r1', name: 'Caissier' },
    { id: 'r2', name: 'Manager' },
  ],

  suppliers: [
    { id: 's1', name: 'Textile Pro', contact: 'contact@textilepro.com' },
    { id: 's2', name: 'Chaussures Plus', contact: 'vente@chaussuresplus.fr' },
  ],

  recentSales: [
    {
      id: 'sale1',
      date: '2025-07-20',
      items: 'T-shirt, Jean',
      total: 7500,
      employee: 'Alice Dupont',
    },
    {
      id: 'sale2',
      date: '2025-07-19',
      items: 'Chaussures',
      total: 3200,
      employee: 'Bob Martin',
    },
  ],

  auditLog: [
    {
      id: 'a1',
      timestamp: '2025-07-21T10:00:00Z',
      action: 'Ajout Produit',
      description: 'Produit "T-shirt Coton" ajouté.',
      user: 'Admin',
      role: 'Manager',
    },
    {
      id: 'a2',
      timestamp: '2025-07-22T14:30:00Z',
      action: 'Vente enregistrée',
      description: 'Vente ID sale1 effectuée.',
      user: 'Alice Dupont',
      role: 'Caissier',
    },
  ],
};
