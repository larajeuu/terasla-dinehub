// Estimasi biaya channel gateway (Tripay) yang ditanggung customer.
// fee = flat + percent% × nominal. Ini ESTIMASI untuk tampilan sebelum charge —
// angka final selalu dari respons create transaction backend (ChargeResponse.fee),
// jadi selisih pembulatan kecil mungkin terjadi.
export const estimateChannelFee = (amount, method) => {
  if (!method?.tripay_code) return 0;
  const flat = method.fee_flat || 0;
  const pct = method.fee_percent || 0;
  if (!flat && !pct) return 0;
  return Math.round(flat + (amount * pct) / 100);
};
