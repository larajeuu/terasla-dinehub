import { useMemo } from 'react';
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
import { dummyAdminOrdersSummary } from '../../../data/dummy/adminOrders';
import { dummyAdminTransactions } from '../../../data/dummy/adminTransactions';
import { formatCompactCurrency } from '../../utils/format';

const Transactions = () => {
  const stats = useMemo(() => {
    const totalGross = dummyAdminOrdersSummary.reduce((s, o) => s + o.totalAmount, 0);
    const orderCount = dummyAdminOrdersSummary.length;
    const multiTenantCount = dummyAdminOrdersSummary.filter((o) => o.tenantCount > 1).length;
    const lineItemCount = dummyAdminTransactions.length;
    const failed = dummyAdminTransactions.filter(
      (t) => t.status === 'failed' || t.status === 'disputed'
    ).length;
    return { totalGross, orderCount, multiTenantCount, lineItemCount, failed };
  }, []);

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
          changeLabel="Total transaksi sisi tenant"
        />
        <StatCard
          label="Failed / Disputed"
          value={stats.failed}
          icon={TransactionIcon}
          iconBg="#ef4444"
        />
      </div>

      <OrderTable orders={dummyAdminOrdersSummary} pageSize={10} />
    </PageContainer>
  );
};

export default Transactions;
