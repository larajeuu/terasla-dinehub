import api from './api';

// Transaksi pembayaran (dummy gateway sekarang, siap di-swap ke Midtrans/Flip).
// Bentuk respons = ChargeResponse: { payment_id, transaction_id, status, method,
// type, nominal, qr_string?, va_number?, bank?, payment_url?, expires_at?,
// instructions[], order_id, order_code, no_meja, created_at }

export const chargePayment = async ({ id_pesanan, metode_pembayaran_id }) => {
  const res = await api.post('/payments/charge', { id_pesanan, metode_pembayaran_id });
  return res.data;
};

// `token` = public_token dari ChargeResponse (bukan id, agar link tak ditebak).
export const getPaymentStatus = async (token) => {
  const res = await api.get(`/payments/status/${token}`);
  return res.data;
};

// Pengganti webhook untuk fase dummy — tandai pembayaran LUNAS.
export const simulatePaid = async (token) => {
  const res = await api.post(`/payments/status/${token}/simulate-paid`);
  return res.data;
};

// Ringkasan order (struk multi-tenant) terkait pembayaran — via token publik.
export const getOrderByPaymentToken = async (token) => {
  const res = await api.get(`/payments/status/${token}/order`);
  return res.data;
};

// Batalkan SATU tenant yang telat diproses (refund parsial) via token publik.
// Hanya tenant tsb yang dibatalkan; tenant lain tetap berjalan. Return struk terbaru.
export const cancelMerchantOrderByToken = async (token, merchantOrderId) => {
  const res = await api.post(`/payments/status/${token}/merchant-orders/${merchantOrderId}/cancel`);
  return res.data;
};
