import axios from 'axios';
import api from './api';
import { dummyProducts } from '../data/dummy/products';

const USE_DUMMY = import.meta.env.VITE_USE_DUMMY_DATA === 'true';
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Backend (snake_case) → UI (camelCase)
const mapProduct = (p) => ({
  id: p.id,
  name: p.nama,
  description: p.deskripsi || '',
  price: p.harga,
  stock: p.stok,
  // is_available jika ada di backend, fallback: stok > 0
  available: p.is_available !== undefined ? Boolean(p.is_available) : p.stok > 0,
  image: p.foto || null,
  categoryId: p.category_id ?? null,
  categoryName: p.category?.nama_kategori ?? null,
  addons: (p.additionals || []).map((a) => ({
    id: a.id,
    name: a.nama,
    price: a.harga,
    isActive: a.is_active !== false,
  })),
});

// UI add-on (camelCase) → payload backend (snake_case).
const mapAddonPayload = (addons) =>
  (addons || [])
    .filter((a) => (a.name || '').trim())
    .map((a) => ({
      nama: a.name.trim(),
      harga: Number(a.price) || 0,
      is_active: a.isActive !== false,
    }));

export const getMerchantMenus = async (merchantId) => {
  if (USE_DUMMY) {
    await delay(300);
    return dummyProducts
      .filter((p) => p.merchant_id === Number(merchantId))
      .map(mapProduct);
  }
  // only_active_merchant=false: panel merchant harus tetap bisa mengelola
  // menunya sendiri meski tokonya sedang dinonaktifkan/pending/suspended.
  const res = await api.get('/products/', {
    params: { merchant_id: merchantId, only_active_merchant: false },
  });
  return res.data.map(mapProduct);
};

// Upload/ganti foto produk ke endpoint attachment terpisah (multipart).
// Server menyimpan file (Vercel Blob / lokal) lalu meng-update product.foto,
// dan mengembalikan AttachmentOut { url, ... }.
//
// Sengaja TIDAK memakai instance `api` (yang default Content-Type-nya
// application/json) karena axios akan mengubah FormData menjadi JSON. Pakai
// axios polos agar browser menyetel "multipart/form-data; boundary=..." sendiri.
export const uploadProductImage = async (productId, file) => {
  const form = new FormData();
  form.append('file', file);
  const token = localStorage.getItem('token');
  // Normalkan base URL: VITE_API_URL bisa berakhiran '/', kalau disambung manual
  // jadi '//attachments' (double slash) → 404. Strip dulu trailing slash-nya.
  const base = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
  const res = await axios.post(
    `${base}/attachments/product/${productId}`,
    form,
    { headers: token ? { Authorization: `Bearer ${token}` } : {} },
  );
  return res.data; // { url, filename, ... }
};

export const createMenu = async (merchantId, data) => {
  if (USE_DUMMY) {
    await delay(300);
    const maxId = Math.max(...dummyProducts.map((p) => p.id), 0);
    return mapProduct({
      id: maxId + 1,
      nama: data.name,
      deskripsi: data.description || '',
      harga: data.price,
      stok: data.stock,
      is_available: data.available,
      foto: data.imageFile ? URL.createObjectURL(data.imageFile) : null,
      merchant_id: Number(merchantId),
      category_id: data.categoryId ?? null,
    });
  }

  // 1) Buat produk (JSON). merchant_id ditimpa dari token di backend.
  const res = await api.post('/products/', {
    nama: data.name,
    deskripsi: data.description || '',
    harga: data.price,
    stok: data.stock,
    is_available: data.available !== undefined ? data.available : true,
    merchant_id: merchantId,
    category_id: data.categoryId ?? null,
    additionals: mapAddonPayload(data.addons),
  });
  let product = res.data;

  // 2) Bila ada foto, unggah ke endpoint attachment lalu sematkan url-nya.
  if (data.imageFile) {
    const att = await uploadProductImage(product.id, data.imageFile);
    product = { ...product, foto: att.url };
  }
  return mapProduct(product);
};

export const updateMenu = async (id, data) => {
  if (USE_DUMMY) {
    await delay(300);
    return mapProduct({
      id,
      nama: data.name,
      deskripsi: data.description || '',
      harga: data.price,
      stok: data.stock,
      is_available: data.available,
      foto: data.imageFile ? URL.createObjectURL(data.imageFile) : (data.image || null),
      category_id: data.categoryId ?? null,
    });
  }

  // 1) Update field produk (JSON). Add-on hanya dikirim bila form menyertakannya
  //    (mencegah penghapusan tak sengaja oleh pemanggil yang tak mengelola add-on).
  const res = await api.put(`/products/${id}`, {
    nama: data.name,
    deskripsi: data.description || '',
    harga: data.price,
    stok: data.stock,
    category_id: data.categoryId ?? null,
    ...(data.available !== undefined ? { is_available: data.available } : {}),
    ...(data.addons !== undefined ? { additionals: mapAddonPayload(data.addons) } : {}),
  });
  let product = res.data;

  // 2) Bila ada foto baru, unggah & ganti; jika tidak, pertahankan foto lama.
  if (data.imageFile) {
    const att = await uploadProductImage(id, data.imageFile);
    product = { ...product, foto: att.url };
  }
  return mapProduct(product);
};

// Hapus produk permanen. Backend menolak (HTTP 409) bila produk sudah pernah
// dipakai dalam transaksi — pemanggil sebaiknya menyarankan nonaktifkan saja.
export const deleteMenu = async (id) => {
  if (USE_DUMMY) {
    await delay(200);
    return { message: 'Produk dihapus', id };
  }
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

// PUT karena backend tidak support PATCH pada /products/{id}
export const toggleMenuAvailability = async (id, available, menuData) => {
  if (USE_DUMMY) {
    await delay(200);
    return { ...menuData, available };
  }
  const res = await api.put(`/products/${id}`, {
    nama: menuData.name,
    deskripsi: menuData.description || '',
    harga: menuData.price,
    stok: menuData.stock,
    is_available: available,
  });
  return mapProduct(res.data);
};
