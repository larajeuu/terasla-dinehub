import { useEffect, useMemo, useState } from 'react';
import PageContainer from '../../components/PageContainer';
import StatCard from '../../components/StatCard';
import OrderTable from '../../components/OrderTable';
import {
  DownloadIcon,
  TransactionIcon,
  RevenueIcon,
  MerchantIcon,
  ReceiptIcon,
} from '../../components/icons';
import { getCustomerOrders } from '../../../services/customerOrderService';
import { formatCompactCurrency } from '../../utils/format';

const Transactions = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    getCustomerOrders()
      .then((data) => { if (active) setOrders(data); })
      .catch(() => { if (active) setError('Gagal memuat data transaksi dari server.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const stats = useMemo(() => {
    const totalGross = orders.reduce((s, o) => s + o.totalAmount, 0);
    const orderCount = orders.length;
    const multiTenantCount = orders.filter((o) => o.tenantCount > 1).length;
    const lineItemCount = orders.reduce((s, o) => s + o.tenantCount, 0);
    const cancelled = orders.filter((o) => o.status === 'cancelled').length;
    return { totalGross, orderCount, multiTenantCount, lineItemCount, cancelled };
  }, [orders]);

  return (
    <PageContainer
      title="Transaksi"
      subtitle="Daftar semua order. Klik salah satu untuk melihat rincian customer & per-tenant."
      actions={
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: '#1D3A27' }}
        >
          <DownloadIcon size={15} />
          <span className="hidden sm:inline">Export</span>
        </button>
      }
    >
      {error && (
        <div
          className="mb-4 rounded-xl px-4 py-3 text-sm"
          style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border p-10 text-center text-gray-400 text-sm" style={{ borderColor: '#e5e7eb' }}>
          Memuat data transaksi...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Total Order"
              value={stats.orderCount}
              icon={ReceiptIcon}
              iconBg="#1D3A27"
              changeLabel={`${stats.multiTenantCount} multi-tenant order`}
            />
            <StatCard
              label="Total Revenue"
              value={formatCompactCurrency(stats.totalGross)}
              icon={RevenueIcon}
              iconBg="#0891b2"
            />
            <StatCard
              label="Line Item Tenant"
              value={stats.lineItemCount}
              icon={MerchantIcon}
              iconBg="#C8961A"
              changeLabel="Total order sisi tenant"
            />
            <StatCard
              label="Order Dibatalkan"
              value={stats.cancelled}
              icon={TransactionIcon}
              iconBg="#ef4444"
            />
          </div>

          <OrderTable orders={orders} pageSize={10} />
        </>
      )}
    </PageContainer>
  );
};

export default Transactions;
