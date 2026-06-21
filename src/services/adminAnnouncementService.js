import api from './api';

// Kirim pengumuman dari admin ke merchant. Masuk ke inbox merchant sebagai
// kategori 'Penting' (tipe = 'penting') atau 'Pengumuman' (tipe = 'pengumuman').
//
// payload: { judul, pesan, tipe?: 'penting' | 'pengumuman', merchant_ids?: number[] }
// merchant_ids kosong/null = broadcast ke SEMUA merchant.
export const sendAnnouncement = async ({ judul, pesan, tipe = 'penting', merchantIds = null }) => {
  const body = { judul, pesan, tipe };
  if (Array.isArray(merchantIds) && merchantIds.length > 0) {
    body.merchant_ids = merchantIds;
  }
  const res = await api.post('/admin/announcements', body);
  return res.data; // { message, tipe, terkirim }
};

// Riwayat pengumuman yang pernah dikirim (dikelompokkan per judul+pesan).
export const getAnnouncements = async () => {
  const res = await api.get('/admin/announcements');
  return res.data;
};
