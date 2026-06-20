import api from './api';

const USE_DUMMY = import.meta.env.VITE_USE_DUMMY_DATA === 'true';
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Kategori produk GLOBAL (read-only untuk merchant & customer).
// Endpoint publik: GET /categories → [{ id, nama_kategori }]
// Pengelolaan (CRUD) ada di adminCategoryService (/admin/categories).
const dummyCategories = [
  { id: 1, nama_kategori: 'Makanan' },
  { id: 2, nama_kategori: 'Minuman' },
  { id: 3, nama_kategori: 'Snack' },
  { id: 4, nama_kategori: 'Dessert' },
];

export const getCategories = async () => {
  if (USE_DUMMY) {
    await delay(150);
    return [...dummyCategories];
  }
  const res = await api.get('/categories');
  return res.data;
};
