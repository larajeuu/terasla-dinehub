import { useState, useMemo } from 'react';
import PageContainer from '../../components/PageContainer';
import StatCard from '../../components/StatCard';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';
import {
  CheckIcon,
  XIcon,
  EyeIcon,
  MerchantIcon,
} from '../../components/icons';
import { dummyAdminMerchants } from '../../../data/dummy/adminMerchants';
import { formatCurrency, formatDateShort } from '../../utils/format';

const Merchants = () => {
  const [merchants, setMerchants] = useState(dummyAdminMerchants);

  const stats = useMemo(() => {
    const active = merchants.filter((m) => m.status === 'active').length;
    const pending = merchants.filter((m) => m.status === 'pending').length;
    const suspended = merchants.filter((m) => m.status === 'suspended').length;
    return { total: merchants.length, active, pending, suspended };
  }, [merchants]);

  const updateStatus = (id, status) => {
    setMerchants((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
  };

  const columns = [
    {
      key: 'name',
      title: 'Merchant',
      render: (r) => (
        <div>
          <div className="font-semibold text-gray-800 text-sm">{r.name}</div>
          <div className="text-[11px] text-gray-500">{r.block} · {r.category}</div>
        </div>
      ),
    },
    {
      key: 'owner',
      title: 'Owner',
      render: (r) => (
        <div>
          <div className="text-sm text-gray-700">{r.owner}</div>
          <div className="text-[11px] text-gray-500">{r.email}</div>
        </div>
      ),
    },
    {
      key: 'joinedAt',
      title: 'Gabung',
      render: (r) => <span className="text-xs text-gray-600">{formatDateShort(r.joinedAt)}</span>,
    },
    {
      key: 'totalOrders',
      title: 'Pesanan',
      render: (r) => <span className="text-sm font-semibold text-gray-700">{r.totalOrders.toLocaleString('id-ID')}</span>,
    },
    {
      key: 'totalRevenue',
      title: 'Revenue',
      render: (r) => <span className="font-semibold text-sm whitespace-nowrap" style={{ color: '#1D3A27' }}>{formatCurrency(r.totalRevenue)}</span>,
    },
    {
      key: 'balance',
      title: 'Saldo',
      render: (r) => <span className="text-sm whitespace-nowrap" style={{ color: '#C8961A' }}>{formatCurrency(r.balance)}</span>,
    },
    { key: 'status', title: 'Status', render: (r) => <Badge status={r.status} /> },
    {
      key: 'actions',
      title: 'Aksi',
      render: (r) => (
        <div className="flex gap-1">
          {r.status === 'pending' && (
            <>
              <button
                onClick={() => updateStatus(r.id, 'active')}
                title="Approve"
                className="p-2 rounded-lg text-white"
                style={{ background: '#16a34a' }}
              >
                <CheckIcon size={14} />
              </button>
              <button
                onClick={() => updateStatus(r.id, 'suspended')}
                title="Reject"
                className="p-2 rounded-lg text-white"
                style={{ background: '#ef4444' }}
              >
                <XIcon size={14} />
              </button>
            </>
          )}
          {r.status === 'active' && (
            <button
              onClick={() => updateStatus(r.id, 'suspended')}
              title="Suspend"
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-white"
              style={{ background: '#ef4444' }}
            >
              Suspend
            </button>
          )}
          {r.status === 'suspended' && (
            <button
              onClick={() => updateStatus(r.id, 'active')}
              title="Activate"
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-white"
              style={{ background: '#16a34a' }}
            >
              Aktifkan
            </button>
          )}
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <EyeIcon size={14} />
          </button>
        </div>
      ),
    },
  ];

  const filters = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'pending', label: 'Pending' },
        { value: 'suspended', label: 'Suspended' },
      ],
    },
    {
      key: 'category',
      label: 'Kategori',
      options: [
        { value: 'Makanan', label: 'Makanan' },
        { value: 'Minuman', label: 'Minuman' },
        { value: 'Camilan', label: 'Camilan' },
      ],
    },
  ];

  return (
    <PageContainer
      title="Manajemen Merchant"
      subtitle="Approval, suspend, dan pantauan merchant"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Merchant" value={stats.total} icon={MerchantIcon} iconBg="#1D3A27" />
        <StatCard label="Aktif" value={stats.active} icon={MerchantIcon} iconBg="#16a34a" />
        <StatCard label="Pending" value={stats.pending} icon={MerchantIcon} iconBg="#C8961A" />
        <StatCard label="Suspended" value={stats.suspended} icon={MerchantIcon} iconBg="#ef4444" />
      </div>

      <DataTable
        columns={columns}
        data={merchants}
        searchKeys={['name', 'owner', 'email', 'block']}
        filters={filters}
        pageSize={10}
      />
    </PageContainer>
  );
};

export default Merchants;
