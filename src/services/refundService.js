import api from './api';

// Detail refund untuk sebuah order via hash opaque (link dari email).
export const getRefundByOrderHash = async (hash) => {
  const res = await api.get(`/refunds/order/${hash}`);
  return res.data; // { id, nominal, status, metode_refund, nomor_tujuan, ... }
};

// Daftar e-wallet yang didukung untuk refund.
export const getRefundEwallets = async () => {
  const res = await api.get('/refunds/ewallets');
  return res.data; // ["GoPay", "OVO", ...]
};

// Pilih metode + nomor tujuan → finalkan refund (bypass transfer).
export const processRefund = async (hash, payload) => {
  // payload: { metode_refund, nomor_tujuan }
  const res = await api.post(`/refunds/order/${hash}/process`, payload);
  return res.data;
};
