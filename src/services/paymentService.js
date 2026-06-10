import api from './api';

// Transaksi pembayaran (dummy gateway sekarang, siap di-swap ke Midtrans/Flip).
// Bentuk respons = ChargeResponse: { payment_id, transaction_id, status, method,
// type, nominal, qr_string?, va_number?, bank?, payment_url?, expires_at?,
// instructions[], order_id, order_code, no_meja, created_at }

export const chargePayment = async ({ id_pesanan, metode_pembayaran_id }) => {
  const res = await api.post('/payments/charge', { id_pesanan, metode_pembayaran_id });
  return res.data;
};

export const getPaymentStatus = async (paymentId) => {
  const res = await api.get(`/payments/${paymentId}/status`);
  return res.data;
};

// Pengganti webhook untuk fase dummy — tandai pembayaran LUNAS.
export const simulatePaid = async (paymentId) => {
  const res = await api.post(`/payments/${paymentId}/simulate-paid`);
  return res.data;
};
