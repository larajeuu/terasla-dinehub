import api from './api';
import { dummyAdminStats, dummyRevenueChart, dummyTopTenants } from '../data/dummy/adminStats';
import { dummyAdminTransactions } from '../data/dummy/adminTransactions';

const USE_DUMMY = import.meta.env.VITE_USE_DUMMY_DATA === 'true';
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const TENANT_COLORS = ['#ef4444', '#d97706', '#f59e0b', '#16a34a', '#f43f5e'];

// Label tanggal 'YYYY-MM-DD' → '10 Jun' (tanpa pergeseran zona waktu).
const chartLabel = (isoDate) => {
  const d = new Date(`${isoDate}T00:00:00`);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
};

const mapDashboard = (data) => ({
  transaksiToday:             data.transaksi_today,
  transaksiYesterday:         data.transaksi_yesterday,
  ordersToday:                data.orders_today,
  multiTenantOrdersToday:     data.multi_tenant_orders_today,
  completedTransactionsToday: data.completed_transactions_today,
  activeTransactions:         data.active_transactions,
  totalMerchants:             data.total_merchants,
  activeMerchants:            data.active_merchants,
  pendingMerchants:           data.pending_merchants,
  totalCustomers:             data.total_customers,
  newCustomersToday:          data.new_customers_today,
  pendingWithdrawals:         data.pending_withdrawals,
  pendingWithdrawalAmount:    data.pending_withdrawal_amount,
  revenueChart: (data.transaksi_chart || []).map((p) => ({
    date: chartLabel(p.date),
    revenue: p.total,
  })),
  topTenants: (data.top_tenants || []).map((t, i) => ({
    id: t.id,
    name: t.nama,
    revenue: t.total,
    orders: t.orders,
    color: TENANT_COLORS[i % TENANT_COLORS.length],
  })),
  recentTransactions: (data.recent_transactions || []).map((tx) => ({
    id: tx.id,
    tenant: tx.tenant,
    customer: tx.customer,
    amount: tx.amount,
    status: tx.status,
    paymentMethod: tx.payment_method,
    date: tx.created_at,
  })),
});

export const getDashboard = async () => {
  if (USE_DUMMY) {
    await delay(300);
    const s = dummyAdminStats;
    return {
      transaksiToday:             s.revenueToday,
      transaksiYesterday:         s.revenueYesterday,
      ordersToday:                s.ordersToday,
      multiTenantOrdersToday:     s.multiTenantOrdersToday,
      completedTransactionsToday: s.completedTransactionsToday,
      activeTransactions:         s.activeTransactions,
      totalMerchants:             s.totalMerchants,
      activeMerchants:            s.activeMerchants,
      pendingMerchants:           s.pendingMerchants,
      totalCustomers:             s.totalCustomers,
      newCustomersToday:          s.newCustomersToday,
      pendingWithdrawals:         s.pendingWithdrawals,
      pendingWithdrawalAmount:    s.pendingWithdrawalAmount,
      revenueChart: dummyRevenueChart.map((p) => ({ date: p.date, revenue: p.revenue })),
      topTenants: dummyTopTenants,
      recentTransactions: dummyAdminTransactions.slice(0, 5).map((tx) => ({
        id: tx.id,
        tenant: tx.tenant,
        customer: tx.customerId,
        amount: tx.amount,
        status: tx.status,
        paymentMethod: tx.paymentMethod,
        date: tx.date,
      })),
    };
  }
  const { data } = await api.get('/admin/dashboard');
  return mapDashboard(data);
};
