import api from './api';

// Overview kategori produk lintas merchant (read-only, admin).
// CRUD kategori sendiri ada di panel merchant — di sini admin hanya memantau.

export const getAllCategories = async () => {
  const res = await api.get('/admin/categories');
  return res.data;
};
