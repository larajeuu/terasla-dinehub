import axios from 'axios';
import api from './api';
import { dummyAdminMerchants } from '../data/dummy/adminMerchants';

const USE_DUMMY = import.meta.env.VITE_USE_DUMMY_DATA === 'true';
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const notFound = () => {
  const err = new Error('Not found');
  err.response = { status: 404 };
  return err;
};

// Backend (snake_case) → bentuk yang dipakai konsol admin (camelCase).
const mapMerchant = (m) => ({
  id: m.id,
  name: m.nama,
  owner: m.owner,
  email: m.email,
  phone: m.phone,
  block: m.block,
  category: m.category,
  status: m.status,
  isOpen: m.is_open ?? true,
  foto: m.foto || null,
  joinedAt: m.created_at,
  totalOrders: m.total_orders ?? 0,
  totalRevenue: m.total_revenue ?? 0,
  balance: m.balance ?? 0,
  rating: m.rating ?? 0,
});

const mapMerchantDetail = (m) => ({
  ...mapMerchant(m),
  deskripsi: m.deskripsi,
  alamat: m.alamat,
  products: (m.products || []).map((p) => ({
    id: p.id,
    name: p.nama,
    price: p.harga,
    stock: p.stok,
    isBanned: p.is_banned ?? false,
  })),
});

export const getMerchants = async (params = {}) => {
  if (USE_DUMMY) {
    await delay(250);
    return [...dummyAdminMerchants];
  }
  const response = await api.get('/merchants/', { params });
  return response.data.map(mapMerchant);
};

export const getMerchantById = async (id) => {
  if (USE_DUMMY) {
    await delay(200);
    const found = dummyAdminMerchants.find((m) => String(m.id) === String(id));
    if (!found) throw notFound();
    return { ...found, deskripsi: found.deskripsi, alamat: found.block, products: [] };
  }
  const response = await api.get(`/merchants/${id}`);
  return mapMerchantDetail(response.data);
};

export const updateMerchantStatus = async (id, status) => {
  if (USE_DUMMY) {
    await delay(150);
    return { id, status };
  }
  const response = await api.put(`/merchants/${id}`, { status });
  return mapMerchant(response.data);
};

// Update profil milik sendiri lewat endpoint khusus merchant (PUT /merchants/me).
// Pakai token merchant, jadi tidak butuh id & tidak kena proteksi admin.
// Hanya field yang terdefinisi (bukan undefined) yang dikirim → partial update.
export const updateMerchantProfile = async (
  _id,
  { nama, block, email, deskripsi, alamat, password },
) => {
  const payload = {};
  if (nama !== undefined) payload.nama = nama;
  if (block !== undefined) payload.block = block;
  if (email !== undefined) payload.email = email;
  if (deskripsi !== undefined) payload.deskripsi = deskripsi;
  if (alamat !== undefined) payload.alamat = alamat;
  if (password) payload.password = password;
  const response = await api.put('/merchants/me', payload);
  return mapMerchantDetail(response.data);
};

// Upload/ganti logo (foto) merchant ke endpoint attachment (multipart).
// Backend (POST /attachments/merchant/logo) menyimpan file lalu meng-update
// kolom merchant.foto dan otomatis menghapus logo lama bila ada.
// Sengaja pakai axios polos (bukan instance `api`) agar browser menyetel
// header multipart/form-data; boundary=... sendiri (FormData tidak di-JSON-kan).
export const uploadMerchantLogo = async (file) => {
  const form = new FormData();
  form.append('file', file);
  const token = localStorage.getItem('token');
  const base = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
  const res = await axios.post(`${base}/attachments/merchant/logo`, form, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data; // { url, filename, ... }
};

// Toggle buka/tutup toko oleh merchant sendiri (PUT /merchants/me).
export const updateStoreOpenStatus = async (_id, isOpen) => {
  if (USE_DUMMY) {
    await delay(200);
    return { id: _id, is_open: isOpen };
  }
  const response = await api.put('/merchants/me', { is_open: isOpen });
  return mapMerchant(response.data);
};
