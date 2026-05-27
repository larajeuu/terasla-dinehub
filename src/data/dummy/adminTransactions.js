import { dummyAdminOrders, flattenOrdersToTransactions } from './adminOrders';

// Per-tenant view: setiap row = 1 item dari 1 tenant dalam 1 order.
// Inilah yang dilihat oleh tenant masing-masing (filtered by their tenantId).
// Admin bisa lihat semuanya.
export const dummyAdminTransactions = flattenOrdersToTransactions(dummyAdminOrders);
