import api from './api';
import { dummyProducts } from '../data/dummy/products';

const USE_DUMMY = import.meta.env.VITE_USE_DUMMY_DATA === 'true';
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Backend (snake_case) → UI (camelCase)
const mapProduct = (p) => ({
  id: p.id,
  name: p.nama,
  description: p.deskripsi || '',
  price: p.harga,
  stock: p.stok,
  // is_available jika ada di backend, fallback: stok > 0
  available: p.is_available !== undefined ? Boolean(p.is_available) : p.stok > 0,
  image: p.foto || null,
});

export const getMerchantMenus = async (merchantId) => {
  if (USE_DUMMY) {
    await delay(300);
    return dummyProducts
      .filter((p) => p.merchant_id === Number(merchantId))
      .map(mapProduct);
  }
  const res = await api.get('/products/', { params: { merchant_id: merchantId } });
  return res.data.map(mapProduct);
};

export const createMenu = async (merchantId, data) => {
  if (USE_DUMMY) {
    await delay(300);
    const maxId = Math.max(...dummyProducts.map((p) => p.id), 0);
    return mapProduct({
      id: maxId + 1,
      nama: data.name,
      deskripsi: data.description || '',
      harga: data.price,
      stok: data.stock,
      is_available: data.available,
      foto: data.imageFile ? URL.createObjectURL(data.imageFile) : null,
      merchant_id: Number(merchantId),
    });
  }

  if (data.imageFile) {
    const form = new FormData();
    form.append('nama', data.name);
    form.append('deskripsi', data.description || '');
    form.append('harga', data.price);
    form.append('stok', data.stock);
    form.append('merchant_id', merchantId);
    form.append('is_available', data.available);
    form.append('foto', data.imageFile);
    const res = await api.post('/products/', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return mapProduct(res.data);
  }

  const res = await api.post('/products/', {
    nama: data.name,
    deskripsi: data.description || '',
    harga: data.price,
    stok: data.stock,
    merchant_id: merchantId,
    is_available: data.available,
  });
  return mapProduct(res.data);
};

export const updateMenu = async (id, data) => {
  if (USE_DUMMY) {
    await delay(300);
    return mapProduct({
      id,
      nama: data.name,
      deskripsi: data.description || '',
      harga: data.price,
      stok: data.stock,
      is_available: data.available,
      foto: data.imageFile ? URL.createObjectURL(data.imageFile) : (data.image || null),
    });
  }

  if (data.imageFile) {
    const form = new FormData();
    form.append('nama', data.name);
    form.append('deskripsi', data.description || '');
    form.append('harga', data.price);
    form.append('stok', data.stock);
    form.append('is_available', data.available);
    form.append('foto', data.imageFile);
    const res = await api.put(`/products/${id}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return mapProduct(res.data);
  }

  const res = await api.put(`/products/${id}`, {
    nama: data.name,
    deskripsi: data.description || '',
    harga: data.price,
    stok: data.stock,
    is_available: data.available,
  });
  return mapProduct(res.data);
};

export const toggleMenuAvailability = async (id, available) => {
  if (USE_DUMMY) {
    await delay(200);
    return { id, available };
  }
  const res = await api.patch(`/products/${id}`, { is_available: available });
  return mapProduct(res.data);
};
