import api from './api';

// Metode pembayaran. GET publik (dipakai customer saat checkout);
// create/update/delete butuh token admin (ditangani interceptor api.js).

export const getPaymentMethods = async () => {
  const res = await api.get('/payment-methods');
  return res.data;
};

export const createPaymentMethod = async (payload) => {
  // payload: { nama_metode, fee? }
  const res = await api.post('/payment-methods', payload);
  return res.data;
};

export const updatePaymentMethod = async (id, payload) => {
  // payload: { nama_metode?, fee?, is_active? }
  const res = await api.patch(`/payment-methods/${id}`, payload);
  return res.data;
};

export const deletePaymentMethod = async (id) => {
  const res = await api.delete(`/payment-methods/${id}`);
  return res.data;
};
