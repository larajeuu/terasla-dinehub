import api from './api';
import { dummyAdminWithdrawals } from '../data/dummy/adminWithdrawals';
import { WITHDRAWAL_STATUS } from '../shared/constants';

const USE_DUMMY = import.meta.env.VITE_USE_DUMMY_DATA === 'true';
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Backend (snake_case) → bentuk yang dipakai konsol admin (camelCase).
const mapWithdrawal = (w) => ({
  id: w.id,
  merchantId: w.merchant_id,
  merchantName: w.merchant_nama ?? `Merchant #${w.merchant_id}`,
  amount: w.amount,
  bank: w.bank,
  accountNumber: w.account_number,
  accountName: w.account_name,
  status: w.status,
  note: w.note ?? '',
  processedBy: w.processed_by ?? null,
  requestedAt: w.requested_at,
  processedAt: w.processed_at,
});

export const extractErrorMessage = (err) =>
  err?.response?.data?.detail ?? err?.message ?? 'Terjadi kesalahan.';

export const getWithdrawals = async (params = {}) => {
  if (USE_DUMMY) {
    await delay(250);
    return [...dummyAdminWithdrawals];
  }
  const response = await api.get('/withdrawals', {
    params: { limit: 200, ...params },
  });
  return response.data.map(mapWithdrawal);
};

export const getWithdrawalSummary = async () => {
  if (USE_DUMMY) {
    await delay(100);
    const all = dummyAdminWithdrawals;
    const tally = (s) => ({
      count: all.filter((w) => w.status === s).length,
      total_amount: all.filter((w) => w.status === s).reduce((sum, w) => sum + w.amount, 0),
    });
    return {
      pending:  tally(WITHDRAWAL_STATUS.PENDING),
      approved: tally(WITHDRAWAL_STATUS.APPROVED),
      rejected: tally(WITHDRAWAL_STATUS.REJECTED),
    };
  }
  const response = await api.get('/withdrawals/summary');
  return response.data;
};

export const approveWithdrawal = async (id) => {
  if (USE_DUMMY) {
    await delay(150);
    return { id, status: WITHDRAWAL_STATUS.APPROVED };
  }
  const response = await api.put(`/withdrawals/${id}/approve`);
  return mapWithdrawal(response.data);
};

export const rejectWithdrawal = async (id, note) => {
  if (USE_DUMMY) {
    await delay(150);
    return { id, status: WITHDRAWAL_STATUS.REJECTED, note };
  }
  const response = await api.put(`/withdrawals/${id}/reject`, null, {
    params: note ? { note } : undefined,
  });
  return mapWithdrawal(response.data);
};
