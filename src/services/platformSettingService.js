import api from './api';

// Pengaturan biaya layanan platform (pendapatan platform). Rate diatur admin di
// halaman Pengaturan Sistem → Biaya Layanan; disimpan di DB (bisa diubah runtime).

// [Admin] Ambil pengaturan lengkap.
export const getPlatformSettings = async () => {
  const res = await api.get('/platform-settings');
  return res.data;
};

// [Admin] Ubah biaya layanan. payload: { fee_rate?, fee_fixed?, is_active? }
export const updatePlatformSettings = async (payload) => {
  const res = await api.put('/platform-settings', payload);
  return res.data;
};

// [Publik] Parameter biaya layanan untuk estimasi di cart (tanpa auth).
// Gagal → fallback fee nonaktif agar checkout tetap jalan.
export const getPublicFee = async () => {
  try {
    const res = await api.get('/platform-settings/public');
    return res.data; // { fee_rate, fee_fixed, is_active }
  } catch {
    return { fee_rate: 0, fee_fixed: 0, is_active: false };
  }
};

// Hitung biaya layanan dari subtotal — HARUS sama dengan rumus backend
// (round(rate% × subtotal + fixed)). Hanya untuk pratinjau di FE.
export const calcServiceFee = (subtotal, fee) => {
  if (!fee || !fee.is_active) return 0;
  const raw = (Number(subtotal) || 0) * (fee.fee_rate / 100) + fee.fee_fixed;
  return Math.round(Math.max(raw, 0));
};
