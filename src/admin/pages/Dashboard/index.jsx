import PageContainer from '../../components/PageContainer';
import StatCard from '../../components/StatCard';
import Badge from '../../components/Badge';
import RevenueChart from './components/RevenueChart';
import {
  RevenueIcon,
  TransactionIcon,
  MerchantIcon,
  WithdrawIcon,
  UsersIcon,
  ReceiptIcon,
} from '../../components/icons';
import { dummyAdminStats, dummyRevenueChart, dummyTopTenants } from '../../../data/dummy/adminStats';
import { dummyAdminTransactions } from '../../../data/dummy/adminTransactions';
import { formatCurrency, formatCompactCurrency, formatTime, percentChange } from '../../utils/format';

const Dashboard = () => {
  const s = dummyAdminStats;
  const revChange = percentChange(s.revenueToday, s.revenueYesterday);
  const recentTx = dummyAdminTransactions.slice(0, 5);

  return (
    <PageContainer
      title="Dashboard"
      subtitle="Pantauan kinerja platform secara real-time"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Revenue Hari Ini"
          value={formatCompactCurrency(s.revenueToday)}
          icon={RevenueIcon}
          iconBg="#1D3A27"
          change={revChange}
          changeLabel={`vs kemarin ${formatCompactCurrency(s.revenueYesterday)}`}
        />
        <StatCard
          label="Order Hari Ini"
          value={s.ordersToday}
          icon={ReceiptIcon}
          iconBg="#C8961A"
          changeLabel={`${s.multiTenantOrdersToday} order multi-tenant`}
        />
        <StatCard
          label="Transaksi Selesai"
          value={s.completedTransactionsToday}
          icon={TransactionIcon}
          iconBg="#4A7C40"
          changeLabel={`${s.activeTransactions} sedang berjalan`}
        />
        <StatCard
          label="Merchant Aktif"
          value={`${s.activeMerchants} / ${s.totalMerchants}`}
          icon={MerchantIcon}
          iconBg="#0891b2"
          changeLabel={`${s.pendingMerchants} menunggu approval`}
        />
      </div>

      {/* Chart + Top Tenants */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div
          className="lg:col-span-2 bg-white rounded-2xl p-5 border"
          style={{ borderColor: '#e5e7eb', fontFamily: "'Inter', sans-serif" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3
                className="text-base font-bold"
                style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
              >
                Tren Revenue 8 Hari Terakhir
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">Gross revenue platform</p>
            </div>
          </div>
          <RevenueChart data={dummyRevenueChart} />
        </div>

        <div
          className="bg-white rounded-2xl p-5 border"
          style={{ borderColor: '#e5e7eb', fontFamily: "'Inter', sans-serif" }}
        >
          <h3
            className="text-base font-bold mb-4"
            style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
          >
            Top Tenant Minggu Ini
          </h3>
          <div className="flex flex-col gap-3">
            {dummyTopTenants.map((t, i) => (
              <div key={t.id} className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: t.color }}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 truncate">
                    {t.name}
                  </div>
                  <div className="text-[11px] text-gray-500">{t.orders} pesanan</div>
                </div>
                <div className="text-sm font-bold text-right" style={{ color: '#1D3A27' }}>
                  {formatCompactCurrency(t.revenue)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending alerts + Recent transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div
          className="bg-white rounded-2xl p-5 border"
          style={{ borderColor: '#e5e7eb', fontFamily: "'Inter', sans-serif" }}
        >
          <h3
            className="text-base font-bold mb-4"
            style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
          >
            Perlu Tindakan
          </h3>
          <div className="flex flex-col gap-3">
            <div
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: '#fffbeb', border: '1px solid #fde68a' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
                style={{ background: '#C8961A' }}
              >
                <WithdrawIcon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-800">
                  {s.pendingWithdrawals} Withdrawal Pending
                </div>
                <div className="text-[11px] text-gray-600">
                  Total {formatCurrency(s.pendingWithdrawalAmount)}
                </div>
              </div>
            </div>
            <div
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
                style={{ background: '#1d4ed8' }}
              >
                <MerchantIcon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-800">
                  {s.pendingMerchants} Merchant Menunggu
                </div>
                <div className="text-[11px] text-gray-600">Approval registrasi baru</div>
              </div>
            </div>
            <div
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
                style={{ background: '#16a34a' }}
              >
                <UsersIcon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-800">
                  {s.newCustomersToday} Customer Baru Hari Ini
                </div>
                <div className="text-[11px] text-gray-600">
                  Total {s.totalCustomers.toLocaleString('id-ID')} customer
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="lg:col-span-2 bg-white rounded-2xl border overflow-hidden"
          style={{ borderColor: '#e5e7eb', fontFamily: "'Inter', sans-serif" }}
        >
          <div className="p-5 pb-3 flex items-center justify-between">
            <h3
              className="text-base font-bold"
              style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
            >
              Transaksi Terbaru
            </h3>
            <a
              href="/admin/transactions"
              className="text-xs font-semibold"
              style={{ color: '#C8961A' }}
            >
              Lihat Semua →
            </a>
          </div>
          <div>
            {recentTx.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-3 px-5 py-3 border-t"
                style={{ borderColor: '#f1f5f9' }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white"
                  style={{ background: '#1D3A27' }}
                >
                  <TransactionIcon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 truncate">
                    {tx.tenant}
                  </div>
                  <div className="text-[11px] text-gray-500 truncate">
                    {tx.customerId} · {formatTime(tx.date)} · {tx.paymentMethod}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold" style={{ color: '#1D3A27' }}>
                    {formatCurrency(tx.amount)}
                  </div>
                  <div className="mt-1">
                    <Badge status={tx.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Dashboard;
