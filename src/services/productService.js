import api from './api';
import { dummyProducts } from '../data/dummy/products';

const USE_DUMMY = import.meta.env.VITE_USE_DUMMY_DATA === 'true';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const getProducts = async (params = {}) => {
  if (USE_DUMMY) {
    await delay(300);
    let results = [...dummyProducts];
    if (params.category && params.category !== 'Semua') {
      results = results.filter((p) => p.merchant_category === params.category);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      results = results.filter(
        (p) =>
          p.nama.toLowerCase().includes(q) ||
          (p.merchant_nama || '').toLowerCase().includes(q)
      );
    }
    if (params.merchant_id != null) {
      results = results.filter((p) => p.merchant_id === Number(params.merchant_id));
    }
    return results;
  }

  const response = await api.get('/products/', { params });
  return response.data;
};

export const getProductById = async (id) => {
  if (USE_DUMMY) {
    await delay(200);
    return dummyProducts.find((p) => String(p.id) === String(id)) ?? null;
  }
  const response = await api.get(`/products/${id}`);
  return response.data;
};
