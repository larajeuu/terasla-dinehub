import api from './api';
import { dummyAdminOrders, getItemAmount } from '../data/dummy/adminOrders';

const USE_DUMMY = import.meta.env.VITE_USE_DUMMY_DATA === 'true';
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Status merchant order (backend) → kosakata badge admin.
const ITEM_STATUS = {
  baru: 'new',
  terbuka: 'open',
  diproses: 'process',
  selesai: 'done',
  dibatalkan: 'cancelled',
};
const mapStatus = (s) => ITEM_STATUS[s] || s;

// Turunkan riwayat order per merchant dari dummy customer orders.
const dummyMerchantOrders = (merchantId) => {
  const rows = [];
  dummyAdminOrders.forEach((o) => {
    o.items
      .filter((it) => it.tenantId === merchantId)
      .forEach((it) => {
        rows.push({
          id: `${o.orderId}-${it.tenantId}`,
          orderCode: o.orderId,
          status: it.status,
          total: getItemAmount(it),
          customer: o.customerId,
          table: o.tableCode,
          preview: it.products.map((p) => `${p.qty}x ${p.name}`).join(', '),
          date: o.date,
        });
      });
  });
  return rows;
};

export const getMerchantOrders = async (merchantId) => {
  if (USE_DUMMY) {
    await delay(200);
    return dummyMerchantOrders(merchantId);
  }
  const res = await api.get('/merchant-orders', { params: { merchant_id: merchantId } });
  return res.data.map((o) => ({
    id: o.id,
    orderCode: o.order_code,
    status: mapStatus(o.status),
    total: o.total_harga,
    customer: o.pelanggan_nama,
    table: o.no_meja,
    preview: o.preview_items,
    date: o.created_at,
  }));
};
