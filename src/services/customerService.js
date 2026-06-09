import api from './api';
import { dummyAdminCustomers } from '../data/dummy/adminCustomers';
import { getCustomerOrders } from './customerOrderService';

const USE_DUMMY = import.meta.env.VITE_USE_DUMMY_DATA === 'true';
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const notFound = () => {
  const err = new Error('Not found');
  err.response = { status: 404 };
  return err;
};

// Customer di-anonimkan di konsol admin: id integer BE ditampilkan sebagai "C-0001".
const toCode = (id) => `C-${String(id).padStart(4, '0')}`;
const fromCode = (code) => parseInt(String(code).replace(/\D/g, ''), 10);

// Backend (snake_case + agregat property) → bentuk yang dipakai konsol admin.
const mapCustomer = (c) => ({
  id: toCode(c.id),
  rawId: c.id,
  nama: c.nama,
  email: c.email || '-',
  phone: c.phone || '-',
  joinedAt: c.created_at,
  totalOrders: c.total_orders ?? 0,
  totalSpent: c.total_spent ?? 0,
  lastOrder: c.last_order_at ?? null,
  flagged: c.flagged ?? false,
});

export const getCustomers = async () => {
  if (USE_DUMMY) {
    await delay(250);
    return [...dummyAdminCustomers];
  }
  const res = await api.get('/customers', { params: { limit: 100 } });
  return res.data.map(mapCustomer);
};

export const getCustomerById = async (code) => {
  if (USE_DUMMY) {
    await delay(200);
    const found = dummyAdminCustomers.find((c) => String(c.id) === String(code));
    if (!found) throw notFound();
    const allOrders = await getCustomerOrders();
    const orders = allOrders.filter((o) => o.customerId === code);
    return { customer: found, orders };
  }
  const id = fromCode(code);
  const [profileRes, orders] = await Promise.all([
    api.get(`/customers/${id}`),
    getCustomerOrders({ customer_id: id, limit: 200 }),
  ]);
  return { customer: mapCustomer(profileRes.data), orders };
};

export const updateCustomerFlag = async (code, flagged) => {
  if (USE_DUMMY) {
    await delay(150);
    return { id: code, flagged };
  }
  const id = fromCode(code);
  const res = await api.put(`/customers/${id}`, { flagged });
  return mapCustomer(res.data);
};
