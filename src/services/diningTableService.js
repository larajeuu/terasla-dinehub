import api from './api';
import { API_URL } from '../shared/constants';

// CRUD meja (admin). Semua endpoint butuh token admin.

export const getDiningTables = async () => {
  const res = await api.get('/dining-tables');
  return res.data;
};

export const createDiningTable = async (payload) => {
  // payload: { label, is_active? }
  const res = await api.post('/dining-tables', payload);
  return res.data;
};

export const updateDiningTable = async (id, payload) => {
  // payload: { label?, is_active? }
  const res = await api.patch(`/dining-tables/${id}`, payload);
  return res.data;
};

export const deleteDiningTable = async (id) => {
  const res = await api.delete(`/dining-tables/${id}`);
  return res.data;
};

// URL yang ditanam di QR: backend akan validasi `code` lalu redirect ke FE.
export const buildScanUrl = (code) =>
  `${API_URL.replace(/\/+$/, '')}/dining-tables/scan?code=${encodeURIComponent(code)}`;
