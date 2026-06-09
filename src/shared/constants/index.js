export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/';

export const WITHDRAWAL_STATUS = {
  PENDING:  'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const ROUTES = {
  customer: {
    home: '/',
    restaurant: (id) => `/restaurant/${id}`,
    cart: '/cart',
    payment: '/payment',
    checkout: '/checkout',
  },
  merchant: {
    dashboard: '/merchant',
    menu: '/merchant/menu',
    orders: '/merchant/orders',
    profile: '/merchant/profile',
  },
  admin: {
    login: '/admin',
    dashboard: '/admin/dashboard',
    transactions: '/admin/transactions',
    merchants: '/admin/merchants',
    withdrawals: '/admin/withdrawals',
    customers: '/admin/customers',
    reports: '/admin/reports',
    system: '/admin/system',
    logs: '/admin/logs',
  },
};
