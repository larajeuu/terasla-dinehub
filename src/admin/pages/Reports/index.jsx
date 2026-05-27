import { useState } from 'react';
import PageContainer from '../../components/PageContainer';
import StatCard from '../../components/StatCard';
import { DownloadIcon, ReportIcon, RevenueIcon, ReceiptIcon, MerchantIcon } from '../../components/icons';
import { dummyAdminStats, dummyTopTenants } from '../../../data/dummy/adminStats';
import { dummyAdminOrdersSummary } from '../../../data/dummy/adminOrders';
import { dummyAdminMerchants } from '../../../data/dummy/adminMerchants';
import { formatCurrency, formatCompactCurrency } from '../../utils/format';

const REPORT_TYPES = [
  { id: 'daily', label: 'Harian', desc: 'Ringkasan order & revenue hari ini' },
  { id: 'weekly', label: 'Mingguan', desc: 'Aggregate 7 hari terakhir' },
  { id: 'monthly', label: 'Bulanan', desc: 'Closing report bulan berjalan' },
  { id: 'tenant', label: 'Per Tenant', desc: 'Rincian revenue per merchant' },
  { id: 'products', label: 'Produk Terlaris', desc: 'Ranking produk paling banyak terjual' },
];

const Reports = () => {
  const [period, setPeriod] = useState('weekly');
  const totalGross = dummyAdminOrdersSummary.reduce((s, o) => s + o.totalAmount, 0);
  const totalOrders = dummyAdminOrdersSummary.length;
  const totalLineItems = dummyAdminOrdersSummary.reduce((s, o) => s + o.tenantCount, 0);
  const activeMerchants = dummyAdminMerchants.filter((m) => m.status === 'active').length;

  return (
    <PageContainer
      title="Laporan Keuangan"
      subtitle="Generate dan export laporan untuk operasional & pajak"
      actions={
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: '#1D3A27' }}
        >
          <DownloadIcon size={15} />
          <span className="hidden sm:inline">Export PDF</span>
        </button>
      }
    >
      {/* Period selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['today', 'weekly', 'monthly', 'yearly'].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className="px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-colors"
            style={{
              background: period === p ? '#1D3A27' : 'white',
              color: period === p ? 'white' : '#475569',
              border: '1px solid ' + (period === p ? '#1D3A27' : '#e5e7eb'),
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {p === 'today' ? 'Hari Ini' : p === 'weekly' ? 'Mingguan' : p === 'monthly' ? 'Bulanan' : 'Tahunan'}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Revenue"
          value={formatCompactCurrency(totalGross)}
          icon={RevenueIcon}
          iconBg="#1D3A27"
        />
        <StatCard
          label="Total Order"
          value={totalOrders}
          icon={ReceiptIcon}
          iconBg="#C8961A"
          changeLabel={`${totalLineItems} line item tenant`}
        />
        <StatCard
          label="Merchant Aktif"
          value={activeMerchants}
          icon={MerchantIcon}
          iconBg="#16a34a"
        />
        <StatCard
          label="Total Customer"
          value={dummyAdminStats.totalCustomers.toLocaleString('id-ID')}
          icon={ReportIcon}
          iconBg="#0891b2"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Available reports */}
        <div
          className="bg-white rounded-2xl p-5 border"
          style={{ borderColor: '#e5e7eb', fontFamily: "'Inter', sans-serif" }}
        >
          <h3 className="text-base font-bold mb-4" style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}>
            Generate Laporan
          </h3>
          <div className="flex flex-col gap-2">
            {REPORT_TYPES.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between gap-3 p-3 rounded-xl border hover:bg-gray-50 transition-colors"
                style={{ borderColor: '#e5e7eb' }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-white"
                    style={{ background: '#1D3A27' }}
                  >
                    <ReportIcon size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-800">{r.label}</div>
                    <div className="text-[11px] text-gray-500 truncate">{r.desc}</div>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    className="px-3 py-1.5 rounded-lg text-[11px] font-semibold border hover:bg-gray-50"
                    style={{ borderColor: '#e5e7eb', color: '#475569' }}
                  >
                    PDF
                  </button>
                  <button
                    className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white"
                    style={{ background: '#16a34a' }}
                  >
                    Excel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settlement breakdown */}
        <div
          className="bg-white rounded-2xl p-5 border"
          style={{ borderColor: '#e5e7eb', fontFamily: "'Inter', sans-serif" }}
        >
          <h3 className="text-base font-bold mb-4" style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}>
            Top Tenant Revenue Breakdown
          </h3>
          <div className="flex flex-col gap-3">
            {dummyTopTenants.map((t) => {
              const pct = (t.revenue / dummyTopTenants[0].revenue) * 100;
              return (
                <div key={t.id}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-800">{t.name}</span>
                    <span className="text-sm font-bold" style={{ color: '#1D3A27' }}>{formatCurrency(t.revenue)}</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: '#f1f5f9' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: t.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 pt-4 border-t" style={{ borderColor: '#e5e7eb' }}>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Merchant Aktif</span>
              <span className="font-bold" style={{ color: '#1D3A27' }}>
                {dummyAdminMerchants.filter((m) => m.status === 'active').length} tenant
              </span>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Reports;
