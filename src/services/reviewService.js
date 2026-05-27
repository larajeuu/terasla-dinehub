import api from './api';

const USE_DUMMY = import.meta.env.VITE_USE_DUMMY_DATA === 'true';
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const DUMMY_REVIEWS = [
  { id: 1, rating: 5, comment: 'Enak banget, porsi pas!', author: 'Andi Pratama', date: '2026-05-24T10:15:00' },
  { id: 2, rating: 4, comment: 'Recommended, pelayanan cepat.', author: 'Budi Santoso', date: '2026-05-23T13:40:00' },
  { id: 3, rating: 5, comment: 'Langganan terus di sini.', author: 'Citra Lestari', date: '2026-05-22T19:05:00' },
];

export const getReviews = async (merchantId) => {
  if (USE_DUMMY) {
    await delay(150);
    return [...DUMMY_REVIEWS];
  }
  const res = await api.get('/reviews', { params: { merchant_id: merchantId } });
  return res.data.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.komentar,
    author: r.pelanggan_nama,
    date: r.created_at,
  }));
};
