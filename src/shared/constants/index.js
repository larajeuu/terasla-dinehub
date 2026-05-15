export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const ROUTES = {
  customer: {
    home: '/',
    restaurant: (id) => `/restaurant/${id}`,
    cart: '/cart',
    checkout: '/checkout',
  },
  merchant: {
    dashboard: '/merchant',
    menu: '/merchant/menu',
    orders: '/merchant/orders',
    profile: '/merchant/profile',
  },
};
