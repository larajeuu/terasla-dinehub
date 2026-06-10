import api from './api';

// Kategori produk GLOBAL (dikelola admin). CRUD penuh di /admin/categories.

export const getAllCategories = async () => {
  const res = await api.get('/admin/categories');
  return res.data;
};

export const createCategory = async (payload) => {
  // payload: { nama_kategori }
  const res = await api.post('/admin/categories', payload);
  return res.data;
};

export const updateCategory = async (id, payload) => {
  // payload: { nama_kategori }
  const res = await api.put(`/admin/categories/${id}`, payload);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await api.delete(`/admin/categories/${id}`);
  return res.data;
};
