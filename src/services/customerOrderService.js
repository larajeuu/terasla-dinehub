import api from './api';
import {
  dummyAdminOrders,
  dummyAdminOrdersSummary,
  getOrderSummary,
} from '../data/dummy/adminOrders';
import { dummyAdminCustomers } from '../data/dummy/adminCustomers';

const USE_DUMMY = import.meta.env.VITE_USE_DUMMY_DATA === 'true';
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const notFound = () => {
  const err = new Error('Not found');
  err.response = { status: 404 };
  return err;
};

const PAYMENT_LABELS = { qris: 'QRIS', tunai: 'Tunai' };
const paymentLabel = (m) => PAYMENT_LABELS[m] || (m ? String(m).toUpperCase() : '-');

// Status merchant order (backend) → kosakata status item di konsol admin.
const ITEM_STATUS = {
  baru: 'new',
  terbuka: 'open',
  diproses: 'process',
  selesai: 'done',
  dibatalkan: 'cancelled',
};
const mapItemStatus = (s) => ITEM_STATUS[s] || s;
const isRefundedItem = (status) => status === 'cancelled' || status === 'refunded';

export const isItemRefunded = (item) => isRefundedItem(item.status);

// ── Mapper API ──────────────────────────────────────────────────────────────
const mapSummary = (o) => ({
  id: o.id,
  orderId: o.order_code,
  date: o.created_at,
  customerId: o.customer_nama || '-',
  tableCode: o.no_meja || '-',
  paymentMethod: paymentLabel(o.metode_pembayaran),
  status: o.status,
  totalAmount: o.total_harga,
  tenantCount: o.tenant_count,
});

const mapDetail = (o) => {
  const items = (o.merchant_orders || []).map((mo) => ({
    tenantId: mo.merchant_id,
    tenant: mo.merchant_nama,
    status: mapItemStatus(mo.status),
    amount: mo.total_harga,
    products: (mo.items || []).map((it) => ({
      name: it.product?.nama,
      qty: it.jumlah,
      price: it.harga_satuan,
    })),
  }));
  const grossTotal = items.reduce((s, it) => s + it.amount, 0);
  const refundedTotal = items
    .filter((it) => isRefundedItem(it.status))
    .reduce((s, it) => s + it.amount, 0);

  return {
    id: o.id,
    orderId: o.order_code,
    date: o.created_at,
    status: o.status,
    paymentMethod: paymentLabel(o.metode_pembayaran),
    tableCode: o.no_meja || '-',
    tenantCount: o.tenant_count,
    customer: o.customer
      ? { name: o.customer.nama, email: o.customer.email, phone: o.customer.phone }
      : null,
    items,
    grossTotal,
    refundedTotal,
    totalAmount: grossTotal - refundedTotal,
    hasRefund: refundedTotal > 0,
  };
};

// ── Mapper dummy ──────────────────────────────────────────────────────────────
const dummySummary = (o) => ({
  id: o.orderId,
  orderId: o.orderId,
  date: o.date,
  customerId: o.customerId,
  tableCode: o.tableCode,
  paymentMethod: o.paymentMethod,
  status: o.status,
  totalAmount: o.totalAmount,
  tenantCount: o.tenantCount,
});

const dummyDetail = (o) => {
  const cust = dummyAdminCustomers.find((c) => c.id === o.customerId);
  return {
    id: o.orderId,
    orderId: o.orderId,
    date: o.date,
    status: o.status,
    paymentMethod: o.paymentMethod,
    tableCode: o.tableCode,
    tenantCount: o.tenantCount,
    customer: { name: o.customerId, email: cust?.email, phone: cust?.phone },
    items: o.items.map((it) => ({
      tenantId: it.tenantId,
      tenant: it.tenant,
      status: it.status,
      amount: it.amount,
      products: it.products,
    })),
    grossTotal: o.grossTotal,
    refundedTotal: o.refundedTotal,
    totalAmount: o.totalAmount,
    hasRefund: o.hasRefund,
  };
};

export const getCustomerOrders = async (params = {}) => {
  if (USE_DUMMY) {
    await delay(250);
    return dummyAdminOrdersSummary.map(dummySummary);
  }
  const res = await api.get('/customer-orders', { params });
  return res.data.map(mapSummary);
};

export const getCustomerOrderById = async (id) => {
  if (USE_DUMMY) {
    await delay(200);
    const found = dummyAdminOrders.find((o) => o.orderId === id);
    if (!found) throw notFound();
    return dummyDetail(getOrderSummary(found));
  }
  const res = await api.get(`/customer-orders/${id}`);
  return mapDetail(res.data);
};

// Buat order baru. `payload.metode_pembayaran_id` = id dari /payment-methods
// (mis. selectedMethod.id pada paymentStore).
//
// payload: {
//   customer: { nama, email?, phone? },
//   dining_table_code?, tipe_order?, metode_pembayaran_id,
//   catatan?, items: [{ product_id, jumlah, varian? }]
// }
export const createCustomerOrder = async (payload) => {
  const res = await api.post('/customer-orders', payload);
  return mapDetail(res.data);
};
