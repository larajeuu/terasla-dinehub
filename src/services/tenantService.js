import api from './api';
import { dummyTenants } from '../data/dummy/tenants';

const USE_DUMMY = import.meta.env.VITE_USE_DUMMY_DATA === 'true';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const getTenants = async (params = {}) => {
  if (USE_DUMMY) {
    await delay(300);
    let results = [...dummyTenants];
    if (params.search) {
      const q = params.search.toLowerCase();
      results = results.filter(
        (t) =>
          t.nama.toLowerCase().includes(q) ||
          (t.category || '').toLowerCase().includes(q)
      );
    }
    if (params.block) {
      results = results.filter((t) => t.block === params.block);
    }
    return results;
  }

  const response = await api.get('/merchants/', { params });
  return response.data;
};

export const getTenantById = async (id) => {
  if (USE_DUMMY) {
    await delay(200);
    return dummyTenants.find((t) => String(t.id) === String(id)) ?? null;
  }
  const response = await api.get(`/merchants/${id}`);
  return response.data;
};
