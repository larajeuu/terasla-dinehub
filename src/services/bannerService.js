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
