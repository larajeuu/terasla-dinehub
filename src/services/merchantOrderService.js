import api from './api';
import { dummyAdminOrders, getItemAmount } from '../data/dummy/adminOrders';

const USE_DUMMY = import.meta.env.VITE_USE_DUMMY_DATA === 'true';
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Backend status → label UI (Indonesia, kapital)
const ITEM_STATUS = {
  baru: 'Baru',
  terbuka: 'Baru',
  diproses: 'Diproses',
  selesai: 'Selesai',
  dibatalkan: 'Dibatalkan',
};
const mapStatus = (s) => ITEM_STATUS[s?.toLowerCase()] || s;

// Label UI → backend status
const STATUS_TO_BACKEND = {
  Baru: 'baru',
  Diproses: 'diproses',
  Selesai: 'selesai',
  Dibatalkan: 'dibatalkan',
};

const parseItems = (preview) => {
  if (Array.isArray(preview)) return preview;
  if (typeof preview === 'string') return preview.split(', ').filter(Boolean);
  return ['-'];
};

const parseTime = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

const dummyMerchantOrders = (merchantId) => {
  const rows = [];
  dummyAdminOrders.forEach((o) => {
    o.items
      .filter((it) => it.tenantId === merchantId)
      .forEach((it) => {
        rows.push({
          id: o.orderId,
          dbId: `${o.orderId}-${it.tenantId}`,
          orderCode: o.orderId,
          status: mapStatus(it.status),
          total: getItemAmount(it),
          customerName: o.customerId,
          table: o.tableCode,
          time: '12:00',
          type: 'Dine In',
          items: it.products.map((p) => `${p.qty}x ${p.name}`),
          payment: 'QRIS',
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
    id: o.order_code || String(o.id),
    dbId: o.id,
    orderCode: o.order_code,
    status: mapStatus(o.status),
    total: o.total_harga,
    customerName: o.pelanggan_nama,
    table: o.no_meja,
    time: parseTime(o.created_at),
    type: 'Dine In',
    items: parseItems(o.preview_items),
    payment: o.metode_pembayaran || 'QRIS',
    date: o.created_at,
  }));
};

export const updateMerchantOrderStatus = async (dbId, uiStatus) => {
  const backendStatus = STATUS_TO_BACKEND[uiStatus] || uiStatus.toLowerCase();
  const res = await api.put(`/merchant-orders/${dbId}`, { status: backendStatus });
  return res.data;
};
