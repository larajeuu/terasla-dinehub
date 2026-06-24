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
  // Kirim alasan lewat body JSON (backend juga menerima query param sebagai fallback).
  const response = await api.put(`/withdrawals/${id}/reject`, {
    note: note || null,
  });
  return mapWithdrawal(response.data);
};

// ── Merchant ─────────────────────────────────────────────────────────────────

const DUMMY_BALANCE = 5_200_000; // Sementara: hapus setelah endpoint /tenant-balance/me live

export const getMerchantBalance = async () => {
  if (USE_DUMMY) {
    await delay(200);
    return DUMMY_BALANCE;
  }
  try {
    const response = await api.get('/tenant-balance/me');
    const d = response.data;
    return d?.balance ?? d?.saldo ?? d?.total_balance ?? 0;
  } catch {
    return DUMMY_BALANCE;
  }
};

export const getMerchantWithdrawals = async () => {
  try {
    const response = await api.get('/withdrawals');
    return response.data.map(mapWithdrawal);
  } catch {
    return [];
  }
};

export const createWithdrawal = async ({ amount, bank, account_number, account_name }) => {
  const response = await api.post('/withdrawals', { amount, bank, account_number, account_name });
  return response.data;
};

// ── Rekening bank tersimpan (persisten di backend, per merchant via token) ─────
// Sebelumnya hanya di localStorage (hilang bila ganti device/clear browser).
// Endpoint memakai token merchant → tidak perlu merchantId.

const mapBankAccount = (a) => ({
  id: a.id,
  bank: a.bank,
  account_number: a.account_number,
  account_name: a.account_name,
});

export const getBankAccounts = async () => {
  try {
    const res = await api.get('/withdrawals/bank-accounts');
    return res.data.map(mapBankAccount);
  } catch {
    return [];
  }
};

export const saveBankAccount = async (account) => {
  const res = await api.post('/withdrawals/bank-accounts', {
    bank: account.bank,
    account_number: account.account_number,
    account_name: account.account_name,
  });
  return mapBankAccount(res.data);
};

export const deleteBankAccount = async (accountId) => {
  await api.delete(`/withdrawals/bank-accounts/${accountId}`);
  return true;
};
