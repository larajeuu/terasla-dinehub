import { useState, useMemo } from 'react';
import PageContainer from '../../components/PageContainer';
import StatCard from '../../components/StatCard';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';
import { CheckIcon, XIcon, WithdrawIcon } from '../../components/icons';
import { dummyAdminWithdrawals } from '../../../data/dummy/adminWithdrawals';
import { formatCurrency, formatCompactCurrency, formatDate } from '../../utils/format';

const Withdrawals = () => {
  const [withdrawals, setWithdrawals] = useState(dummyAdminWithdrawals);

  const stats = useMemo(() => {
    const pending = withdrawals.filter((w) => w.status === 'pending');
    const approved = withdrawals.filter((w) => w.status === 'approved');
    const rejected = withdrawals.filter((w) => w.status === 'rejected');
    const pendingAmount = pending.reduce((s, w) => s + w.amount, 0);
    const approvedAmount = approved.reduce((s, w) => s + w.amount, 0);
    return {
      pendingCount: pending.length,
      approvedCount: approved.length,
      rejectedCount: rejected.length,
      pendingAmount,
      approvedAmount,
    };
  }, [withdrawals]);

  const processNow = (id, status) => {
    setWithdrawals((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              status,
              processedAt: new Date().toISOString(),
              note: status === 'approved' ? 'Disbursed successfully' : 'Manual reject by admin',
            }
          : w
      )
    );
  };

  const columns = [
    {
      key: 'id',
      title: 'ID',
      render: (r) => <span className="font-mono text-xs font-semibold text-gray-800">{r.id}</span>,
    },
    {
      key: 'merchantName',
      title: 'Merchant',
      render: (r) => (
        <div>
          <div className="text-sm font-semibold text-gray-800">{r.merchantName}</div>
          <div className="text-[11px] text-gray-500">{r.merchantId}</div>
        </div>
      ),
    },
    {
      key: 'amount',
      title: 'Nominal',
      render: (r) => <span className="text-base font-bold whitespace-nowrap" style={{ color: '#1D3A27' }}>{formatCurrency(r.amount)}</span>,
    },
    {
      key: 'bank',
      title: 'Rekening Tujuan',
      render: (r) => (
        <div>
          <div className="text-sm font-semibold text-gray-700">{r.bank}</div>
          <div className="text-[11px] text-gray-500 font-mono">{r.accountNumber}</div>
          <div className="text-[11px] text-gray-500">{r.accountName}</div>
        </div>
      ),
    },
    {
      key: 'requestedAt',
      title: 'Diajukan',
      render: (r) => <span className="text-xs text-gray-600 whitespace-nowrap">{formatDate(r.requestedAt)}</span>,
    },
    { key: 'status', title: 'Status', render: (r) => <Badge status={r.status} /> },
    {
      key: 'actions',
      title: 'Aksi',
      render: (r) =>
        r.status === 'pending' ? (
          <div className="flex gap-1">
            <button
              onClick={() => processNow(r.id, 'approved')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-white"
              style={{ background: '#16a34a' }}
            >
              <CheckIcon size={12} />
              Approve
            </button>
            <button
              onClick={() => processNow(r.id, 'rejected')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-white"
              style={{ background: '#ef4444' }}
            >
              <XIcon size={12} />
              Reject
            </button>
          </div>
        ) : (
          <span className="text-[11px] text-gray-500 italic">{r.note || '-'}</span>
        ),
    },
  ];

  const filters = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' },
      ],
    },
  ];

  return (
    <PageContainer
      title="Penarikan Dana Merchant"
      subtitle="Approve / reject permintaan withdrawal dari merchant"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Pending Approval"
          value={stats.pendingCount}
          icon={WithdrawIcon}
          iconBg="#C8961A"
          changeLabel={formatCompactCurrency(stats.pendingAmount)}
        />
        <StatCard
          label="Total Pending Amount"
          value={formatCompactCurrency(stats.pendingAmount)}
          icon={WithdrawIcon}
          iconBg="#1D3A27"
        />
        <StatCard label="Approved" value={stats.approvedCount} icon={WithdrawIcon} iconBg="#16a34a" />
        <StatCard label="Rejected" value={stats.rejectedCount} icon={WithdrawIcon} iconBg="#ef4444" />
      </div>

      <DataTable
        columns={columns}
        data={withdrawals}
        searchKeys={['id', 'merchantName', 'accountNumber']}
        filters={filters}
        pageSize={10}
      />
    </PageContainer>
  );
};

export default Withdrawals;
