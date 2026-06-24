import axios from 'axios';
import api from './api';

// Banner promo. GET '' publik (home customer, hanya aktif);
// GET '/all' + create/update/delete butuh token admin.

export const getActiveBanners = async () => {
  const res = await api.get('/banners');
  return res.data;
};

export const getAllBanners = async () => {
  const res = await api.get('/banners/all');
  return res.data;
};

export const createBanner = async (payload) => {
  const res = await api.post('/banners', payload);
  return res.data;
};

export const updateBanner = async (id, payload) => {
  const res = await api.patch(`/banners/${id}`, payload);
  return res.data;
};

export const deleteBanner = async (id) => {
  const res = await api.delete(`/banners/${id}`);
  return res.data;
};

// Upload gambar banner (admin) → kembalikan { url } untuk disimpan ke image_url.
// Pakai axios polos agar browser menyetel header multipart/form-data sendiri.
export const uploadBannerImage = async (file) => {
  const form = new FormData();
  form.append('file', file);
  const token = localStorage.getItem('token');
  const base = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
  const res = await axios.post(`${base}/banners/upload-image`, form, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data.url; // string URL
};
