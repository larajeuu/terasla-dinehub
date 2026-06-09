import axios from 'axios';
import { API_URL } from '../shared/constants';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Lampirkan token Bearer dari localStorage pada setiap request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Jika server mengembalikan 401, sesi sudah expired atau token tidak valid.
// Bersihkan auth dan kembalikan user ke halaman login admin.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      window.location.pathname.startsWith('/admin') &&
      !window.location.pathname.endsWith('/admin')   // jangan redirect dari halaman login itu sendiri
    ) {
      localStorage.removeItem('admin_auth');
      localStorage.removeItem('token');
      window.location.replace('/admin');
    }
    return Promise.reject(error);
  }
);

export default api;
