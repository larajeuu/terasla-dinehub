import api from './api';

// ── Helpers waktu ────────────────────────────────────────────────────────────

const parseTime = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

const parseTimeAgo = (dateStr) => {
  if (!dateStr) return '-';
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Baru saja';
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  if (hours < 48) return 'Kemarin';
  return `${Math.floor(hours / 24)} hari lalu`;
};

// ── Status mapping (backend → UI) ────────────────────────────────────────────

const ORDER_STATUS_MAP = {
  baru: 'Baru',
  terbuka: 'Baru',
  diproses: 'Diterima',
  selesai: 'Selesai',
  dibatalkan: 'Dibatalkan',
};

const parseItems = (preview) => {
  if (Array.isArray(preview)) return preview.join(', ');
  if (typeof preview === 'string') return preview;
  return '-';
};

// Bungkus setiap fetch agar kegagalan satu endpoint tidak membatalkan yang lain
const safeGet = async (fn) => {
  try { return await fn(); }
  catch { return []; }
};

// ── Pesanan — dari /merchant-orders ─────────────────────────────────────────

export const fetchPesananNotifications = (merchantId) =>
  safeGet(async () => {
    const res = await api.get('/merchant-orders', { params: { merchant_id: merchantId } });
    return res.data.map((o) => ({
      id: `pesanan-${o.id}`,
      type: 'Pesanan',
      status: ORDER_STATUS_MAP[o.status?.toLowerCase()] || 'Baru',
      orderNumber: `#${o.order_code || o.id}`,
      customerName: o.pelanggan_nama || 'Pelanggan',
      items: parseItems(o.preview_items),
      table: o.no_meja || '-',
      total: o.total_harga ?? null,
      payment: o.metode_pembayaran || o.payment_method || o.nama_metode ||
      '-',
      time: parseTime(o.created_at),
      timeAgo: parseTimeAgo(o.created_at),
      read: false,
      createdAt: o.created_at,
    }));
  });

// ── Pencairan — notifikasi setiap pergerakan withdrawal ─────────────────────
// Backend membuat satu notifikasi (tipe 'pencairan') pada SETIAP pergerakan:
// pengajuan, disetujui, dan ditolak. Tiap pergerakan ditampilkan di sini.

const parseAmount = (text) => {
  if (!text) return 0;
  const m = String(text).match(/Rp\s*([\d.,]+)/i);
  if (!m) return 0;
  // "10.000" / "1.250.000" → buang pemisah ribuan.
  return Number(m[1].replace(/[.,]/g, '')) || 0;
};

export const fetchPencairanNotifications = (merchantId) =>
  safeGet(async () => {
    const res = await api.get(`/merchant-orders/notifications/${merchantId}`);
    return res.data
      .filter((a) => a.tipe === 'pencairan')
      .map((a) => ({
        id: `pencairan-${a.id}`,
        type: 'Pencairan',
        title: a.judul || 'Pencairan Dana',
        amount: parseAmount(a.pesan || a.judul),
        description: a.pesan || '',
        time: parseTime(a.created_at),
        timeAgo: parseTimeAgo(a.created_at),
        read: false,
        createdAt: a.created_at,
      }));
  });

// ── Ulasan — dari /reviews ───────────────────────────────────────────────────

export const fetchUlasanNotifications = (merchantId) =>
  safeGet(async () => {
    const res = await api.get('/reviews', { params: { merchant_id: merchantId } });
    return res.data.map((r) => ({
      id: `ulasan-${r.id}`,
      type: 'Ulasan',
      customerName: r.pelanggan_nama || r.nama || 'Pelanggan',
      rating: r.rating ?? 0,
      review: r.ulasan || r.review || r.komentar || '',
      time: parseTime(r.created_at),
      timeAgo: parseTimeAgo(r.created_at),
      read: false,
      createdAt: r.created_at,
    }));
  });

// ── Pengumuman — dari /announcements (broadcast admin) ───────────────────────

export const fetchPengumumanNotifications = (merchantId) =>
  safeGet(async () => {
    const res = await api.get(`/merchant-orders/notifications/${merchantId}`);
    return res.data
      // Hanya broadcast 'pengumuman' biasa dari admin. Penting → tab Penting,
      // Pencairan → tab Pencairan, pergerakan order → tab Pesanan.
      .filter((a) => a.tipe === 'pengumuman')
      .map((a) => ({
        id: `pengumuman-${a.id}`,
        type: 'Pengumuman',
        tipe: a.tipe,
        title: a.judul || a.title || 'Pengumuman',
        description: a.pesan || a.isi || a.body || a.message || '',
        time: parseTime(a.created_at),
        timeAgo: parseTimeAgo(a.created_at),
        read: false,
        createdAt: a.created_at,
      }));
  });

// ── Penting — notifikasi admin berprioritas tinggi ────────────────────────────

export const fetchPentingNotifications = (merchantId) =>
  safeGet(async () => {
    const res = await api.get(`/merchant-orders/notifications/${merchantId}`);
    return res.data
      .filter((a) => a.tipe === 'penting' || a.prioritas === 'tinggi')
      .map((a) => ({
        id: `penting-${a.id}`,
        type: 'Penting',
        title: a.judul || a.title || 'Pesan Penting',
        description: a.pesan || a.isi || a.body || a.message || '',
        time: parseTime(a.created_at),
        timeAgo: parseTimeAgo(a.created_at),
        read: false,
        createdAt: a.created_at,
      }));
  });

// ── Pengingat — diturunkan dari stok produk merchant ────────────────────────
// Produk dengan stok ≤ 5 otomatis menghasilkan notif pengingat

export const fetchPengingatNotifications = (merchantId) =>
  safeGet(async () => {
    const res = await api.get('/products/', { params: { merchant_id: merchantId } });
    const now = new Date().toISOString();
    return res.data
      .filter((p) => p.stok <= 5)
      .map((p) => ({
        id: `pengingat-${p.id}`,
        type: 'Pengingat',
        title: p.stok === 0
          ? `${p.nama} — Stok Habis`
          : `Stok ${p.nama} Hampir Habis`,
        description: p.stok === 0
          ? 'Produk tidak tersedia. Perbarui stok atau nonaktifkan produk sementara.'
          : `Sisa stok: ${p.stok} porsi. Segera perbarui agar pesanan tidak tertolak otomatis.`,
        time: '-',
        timeAgo: 'Hari ini',
        read: false,
        createdAt: now,
      }));
  });

// ── Gabungkan semua, urutkan terbaru di atas ─────────────────────────────────

export const fetchAllNotifications = async (merchantId) => {
  const [pesanan, pencairan, ulasan, pengumuman, pengingat, penting] = await Promise.all([
    fetchPesananNotifications(merchantId),
    fetchPencairanNotifications(merchantId),
    fetchUlasanNotifications(merchantId),
    fetchPengumumanNotifications(merchantId),
    fetchPengingatNotifications(merchantId),
    fetchPentingNotifications(merchantId),
  ]);

  return [...pesanan, ...pencairan, ...ulasan, ...pengumuman, ...pengingat, ...penting].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
};