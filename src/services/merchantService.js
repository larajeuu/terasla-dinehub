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
