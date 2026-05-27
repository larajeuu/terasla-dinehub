import { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PageContainer from '../../components/PageContainer';
import Badge from '../../components/Badge';
import {
  BackIcon,
  UsersIcon,
  FlagIcon,
  RevenueIcon,
  ReceiptIcon,
  MailIcon,
  PhoneIcon,
  EyeIcon,
} from '../../components/icons';
import { dummyAdminCustomers } from '../../../data/dummy/adminCustomers';
import { dummyAdminOrdersSummary } from '../../../data/dummy/adminOrders';
import { formatCurrency, formatDate, formatDateShort } from '../../utils/format';

const CustomerDetail = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();

  const initial = useMemo(
    () => dummyAdminCustomers.find((c) => c.id === customerId),
    [customerId]
  );
  const [customer, setCustomer] = useState(initial);

  const orders = useMemo(
    () =>
      dummyAdminOrdersSummary
        .filter((o) => o.customerId === customerId)
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [customerId]
  );

  const orderStats = useMemo(() => {
    const total = orders.length;
    const totalSpent = orders.reduce((s, o) => s + o.totalAmount, 0);
    const done = orders.filter((o) => o.status === 'done').length;
    const cancelled = orders.filter((o) => o.status === 'cancelled').length;
    const tenantSet = new Set();
    orders.forEach((o) => o.items.forEach((i) => tenantSet.add(i.tenantId)));
    return { total, totalSpent, done, cancelled, tenantCount: tenantSet.size };
  }, [orders]);

  if (!customer) {
    return (
      <PageContainer title="Customer Tidak Ditemukan" subtitle={`Customer ID: ${customerId}`}>
        <div
          className="bg-white rounded-2xl border p-10 text-center"
          style={{ borderColor: '#e5e7eb', fontFamily: "'Inter', sans-serif" }}
        >
          <div className="text-gray-500 mb-4">
            Customer dengan ID <span className="font-mono">{customerId}</span> tidak ada di sistem.
          </div>
          <Link
            to="/admin/customers"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: '#1D3A27' }}
          >
            <BackIcon size={16} />
            Kembali ke Customer
          </Link>
        </div>
      </PageContainer>
    );
  }

  const toggleFlag = () => setCustomer((p) => ({ ...p, flagged: !p.flagged }));

  return (
    <PageContainer
      title={`Customer ${customer.id}`}
      subtitle="Detail customer & riwayat pesanan"
      actions={
        <button
          onClick={() => navigate('/admin/customers')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border bg-white"
          style={{ borderColor: '#e5e7eb', color: '#475569' }}
        >
          <BackIcon size={15} />
          <span className="hidden sm:inline">Kembali</span>
        </button>
      }
    >
      {/* Customer profile card */}
      <div
        className="bg-white rounded-2xl border p-6 mb-6"
        style={{ borderColor: '#e5e7eb', fontFamily: "'Inter', sans-serif" }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-base font-bold shrink-0"
              style={{ background: '#1D3A27' }}
            >
              {customer.id.split('-')[1]}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span
                  className="font-mono text-xl font-bold"
                  style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
                >
                  {customer.id}
                </span>
                {customer.flagged ? (
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                    style={{ background: '#fee2e2', color: '#b91c1c' }}
                  >
                    <FlagIcon size={11} />
                    Flagged
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold"
                    style={{ background: '#dcfce7', color: '#15803d' }}
                  >
                    Normal
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1.5">
                  <MailIcon size={14} />
                  {customer.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <PhoneIcon size={14} />
                  {customer.phone}
                </span>
              </div>
              <div className="text-[11px] text-gray-500 mt-1">
                Bergabung sejak {formatDateShort(customer.joinedAt)}
              </div>
            </div>
          </div>

          <button
            onClick={toggleFlag}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: customer.flagged ? '#64748b' : '#ef4444' }}
          >
            <FlagIcon size={14} />
            {customer.flagged ? 'Hapus Flag' : 'Flag Customer'}
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat icon={ReceiptIcon} iconBg="#1D3A27" label="Total Pesanan" value={customer.totalOrders} />
        <Stat
          icon={RevenueIcon}
          iconBg="#C8961A"
          label="Total Belanja"
          value={formatCurrency(customer.totalSpent)}
        />
        <Stat
          icon={UsersIcon}
          iconBg="#0891b2"
          label="Tenant Dikunjungi"
          value={`${orderStats.tenantCount} tenant`}
          sub={`dari ${orders.length} order tampil`}
        />
        <Stat
          icon={ReceiptIcon}
          iconBg="#16a34a"
          label="Order Terakhir"
          value={formatDate(customer.lastOrder)}
        />
      </div>

      {/* Order history */}
      <div
        className="bg-white rounded-2xl border overflow-hidden"
        style={{ borderColor: '#e5e7eb', fontFamily: "'Inter', sans-serif" }}
      >
        <div className="p-5 border-b" style={{ borderColor: '#e5e7eb' }}>
          <h2
            className="text-base font-bold"
            style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
          >
            Riwayat Order
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {orders.length} order tampil di sistem dummy
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">
            Belum ada riwayat order di sistem dummy
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ background: '#f9fafb' }}>
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Tanggal</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Meja</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Tenant</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Metode</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr
                    key={o.orderId}
                    onClick={() => navigate(`/admin/transactions/${o.orderId}`)}
                    className="border-t hover:bg-gray-50/60 transition-colors cursor-pointer"
                    style={{ borderColor: '#f1f5f9' }}
                  >
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-800">{o.orderId}</td>
                    <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{formatDate(o.date)}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-md text-[11px] font-mono font-semibold bg-gray-100 text-gray-700">
                        {o.tableCode}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold"
                        style={{
                          background: o.tenantCount > 1 ? '#fef3c7' : '#f1f5f9',
                          color: o.tenantCount > 1 ? '#a16207' : '#475569',
                        }}
                      >
                        {o.tenantCount} tenant
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-sm whitespace-nowrap" style={{ color: '#1D3A27' }}>
                      {formatCurrency(o.totalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-md text-[11px] font-medium bg-gray-100 text-gray-700">
                        {o.paymentMethod}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={o.status} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/admin/transactions/${o.orderId}`); }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-white"
                        style={{ background: '#1D3A27' }}
                      >
                        <EyeIcon size={12} />
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

const Stat = ({ icon: Icon, iconBg, label, value, sub }) => (
  <div
    className="bg-white rounded-2xl p-5 border"
    style={{ borderColor: '#e5e7eb', fontFamily: "'Inter', sans-serif" }}
  >
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4"
      style={{ background: iconBg }}
    >
      <Icon size={20} />
    </div>
    <div className="text-xs text-gray-500 font-medium mb-1">{label}</div>
    <div className="text-xl font-bold" style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}>
      {value}
    </div>
    {sub && <div className="text-[11px] text-gray-400 mt-1">{sub}</div>}
  </div>
);

export default CustomerDetail;
