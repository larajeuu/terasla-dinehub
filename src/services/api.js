import axios from 'axios';
import { API_URL } from '../shared/constants';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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
// Bersihkan auth dan kembalikan user ke halaman login yang sesuai (admin/merchant).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const path = window.location.pathname;

      // Konsol admin: jangan redirect dari halaman login admin itu sendiri.
      if (path.startsWith('/admin') && !path.endsWith('/admin')) {
        localStorage.removeItem('admin_auth');
        localStorage.removeItem('token');
        window.location.replace('/admin');
      }

      // Aplikasi merchant: jangan redirect dari landing/login/register.
      else if (
        path.startsWith('/merchant') &&
        !['/merchant', '/merchant/login', '/merchant/register'].includes(path)
      ) {
        localStorage.removeItem('admin_auth');
        localStorage.removeItem('token');
        window.location.replace('/merchant');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
