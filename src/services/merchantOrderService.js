import api from './api';
import { dummyAdminOrders, getItemAmount } from '../data/dummy/adminOrders';

const USE_DUMMY = import.meta.env.VITE_USE_DUMMY_DATA === 'true';
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const paymentLabel = (m) => (m ? String(m) : '');

// Backend status → label UI (Indonesia, kapital).
// `baru` (belum dibayar) sengaja tidak dipetakan: pesanan tsb difilter keluar
// di getMerchantOrders, jadi merchant hanya melihat pesanan yang sudah dibayar.
const ITEM_STATUS = {
  terbuka: 'Perlu Diproses',   // sudah dibayar, menunggu merchant terima
  diproses: 'Diproses',
  selesai: 'Selesai',
  dibatalkan: 'Dibatalkan',
};
// `selesai` di sisi merchant = selesai DISIAPKAN, belum tentu tuntas: selama
// struk induk belum 'done' (customer belum konfirmasi), tampilkan sebagai
// 'Menunggu Konfirmasi' agar merchant tahu pesanan belum benar-benar selesai.
const mapStatus = (s, coStatus) => {
  const base = ITEM_STATUS[s?.toLowerCase()] || s;
  if (base === 'Selesai' && coStatus && coStatus !== 'done') {
    return 'Menunggu Konfirmasi';
  }
  return base;
};

// Label UI → backend status
const STATUS_TO_BACKEND = {
  'Perlu Diproses': 'terbuka',
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
  return res.data
    // Pesanan 'baru' = belum dibayar (customer order masih verifying) → sembunyikan.
    .filter((o) => (o.status || '').toLowerCase() !== 'baru')
    .map((o) => ({
    id: o.order_code || String(o.id),
    dbId: o.id,
    orderCode: o.order_code,
    status: mapStatus(o.status, o.customer_order_status),
    total: o.total_harga,
    customerName: o.pelanggan_nama,
    table: o.no_meja,
    time: parseTime(o.created_at),
    type: 'Dine In',
    items: parseItems(o.preview_items),
    payment: paymentLabel(o.metode_pembayaran || o.payment_method || o.nama_metode),
    date: o.created_at,
    autoCancelAt: o.auto_cancel_at,       // batas merchant terima (status terbuka)
    prepDeadlineAt: o.prep_deadline_at,   // batas penyelesaian (status diproses)
    isPrepOverdue: o.is_prep_overdue,
  }));
};

export const updateMerchantOrderStatus = async (dbId, uiStatus) => {
  const backendStatus = STATUS_TO_BACKEND[uiStatus] || uiStatus.toLowerCase();
  const res = await api.put(`/merchant-orders/${dbId}/status`, { status: backendStatus });
  return res.data;
};

// ── Dashboard Keuangan (Kontrol) ────────────────────────────────────────────────

const MONTHS_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];

// ISO datetime → label tanggal relatif untuk pengelompokan TransactionList.
const dateLabel = (iso) => {
  if (!iso) return '-';
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  if (sameDay(d, today)) return 'Hari ini';
  if (sameDay(d, yesterday)) return 'Kemarin';
  return `${d.getDate()} ${MONTHS_ID[d.getMonth()]}`;
};

export const getMerchantDashboard = async () => {
  const res = await api.get('/merchant-orders/summary');
  const d = res.data;
  return {
    saldo: d.saldo ?? 0,
    isOpen: d.is_open ?? true,
    tokoName: d.toko_nama || '-',
    lokasi: d.lokasi || '',
    totalOrder: d.total_order ?? 0,
    totalPendapatan: d.total_pendapatan ?? 0,
    produkTerlaris: d.produk_terlaris || '-',
    weeklyData: (d.weekly_chart || []).map((p) => ({ day: p.day, value: p.value })),
    transactions: (d.transactions || []).map((t) => ({
      id: t.id,
      name: t.name,
      amount: t.amount,
      type: t.type,
      time: parseTime(t.created_at),
      date: dateLabel(t.created_at),
    })),
  };
};
