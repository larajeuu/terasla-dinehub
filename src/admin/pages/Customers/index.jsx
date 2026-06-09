import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/PageContainer';
import StatCard from '../../components/StatCard';
import DataTable from '../../components/DataTable';
import { UsersIcon, FlagIcon, EyeIcon, RevenueIcon } from '../../components/icons';
import { getCustomers, updateCustomerFlag } from '../../../services/customerService';
import { formatCurrency, formatDateShort, formatDate } from '../../utils/format';

const Customers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCustomers();
        if (alive) setCustomers(data);
      } catch (err) {
        if (alive) setError(err.message || 'Gagal memuat data customer');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const stats = useMemo(() => {
    const total = customers.length;
    const flagged = customers.filter((c) => c.flagged).length;
    const totalSpent = customers.reduce((s, c) => s + c.totalSpent, 0);
    const totalOrders = customers.reduce((s, c) => s + c.totalOrders, 0);
    return { total, flagged, totalSpent, totalOrders };
  }, [customers]);

  const toggleFlag = async (id) => {
    const current = customers.find((c) => c.id === id);
    const next = !current?.flagged;
    // Optimistic update, rollback bila API gagal.
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, flagged: next } : c)));
    try {
      await updateCustomerFlag(id, next);
    } catch {
      setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, flagged: !next } : c)));
    }
  };

  const goDetail = (id) => navigate(`/admin/customers/${id}`);

  const columns = [
    {
      key: 'id',
      title: 'Customer ID',
      render: (r) => (
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
            style={{ background: '#1D3A27' }}
          >
            {r.id.split('-')[1]}
          </div>
          <div>
            <div className="font-mono text-sm font-bold text-gray-800">{r.id}</div>
            <div className="text-[11px] text-gray-500">Anonim</div>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      title: 'Email',
      render: (r) => <span className="text-sm text-gray-700">{r.email}</span>,
    },
    {
      key: 'phone',
      title: 'No. Telepon',
      render: (r) => <span className="text-xs text-gray-600 whitespace-nowrap">{r.phone}</span>,
    },
    {
      key: 'joinedAt',
      title: 'Bergabung',
      render: (r) => <span className="text-xs text-gray-600">{formatDateShort(r.joinedAt)}</span>,
    },
    {
      key: 'totalOrders',
      title: 'Pesanan',
      render: (r) => <span className="text-sm font-semibold text-gray-700">{r.totalOrders}</span>,
    },
    {
      key: 'totalSpent',
      title: 'Total Belanja',
      render: (r) => (
        <span className="font-semibold text-sm whitespace-nowrap" style={{ color: '#1D3A27' }}>
          {formatCurrency(r.totalSpent)}
        </span>
      ),
    },
    {
      key: 'lastOrder',
      title: 'Order Terakhir',
      render: (r) => (
        <span className="text-xs text-gray-600 whitespace-nowrap">{formatDate(r.lastOrder)}</span>
      ),
    },
    {
      key: 'flagged',
      title: 'Status',
      render: (r) =>
        r.flagged ? (
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
        ),
    },
    {
      key: 'actions',
      title: 'Aksi',
      render: (r) => (
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => toggleFlag(r.id)}
            title={r.flagged ? 'Unflag' : 'Flag'}
            className="p-2 rounded-lg text-white"
            style={{ background: r.flagged ? '#64748b' : '#ef4444' }}
          >
            <FlagIcon size={14} />
          </button>
          <button
            onClick={() => goDetail(r.id)}
            title="Detail"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-white"
            style={{ background: '#1D3A27' }}
          >
            <EyeIcon size={12} />
            Detail
          </button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      title="Manajemen Customer"
      subtitle="Customer disimpan anonim. Klik baris untuk lihat detail & riwayat order."
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Customer" value={stats.total} icon={UsersIcon} iconBg="#1D3A27" />
        <StatCard
          label="Total Pesanan"
          value={stats.totalOrders.toLocaleString('id-ID')}
          icon={UsersIcon}
          iconBg="#0891b2"
        />
        <StatCard
          label="Total Belanja"
          value={formatCurrency(stats.totalSpent)}
          icon={RevenueIcon}
          iconBg="#C8961A"
        />
        <StatCard label="Flagged" value={stats.flagged} icon={FlagIcon} iconBg="#ef4444" />
      </div>

      {error ? (
        <div
          className="bg-white rounded-2xl border p-10 text-center text-sm text-red-600"
          style={{ borderColor: '#fecaca' }}
        >
          {error}
        </div>
      ) : loading ? (
        <div
          className="bg-white rounded-2xl border p-10 text-center text-sm text-gray-400"
          style={{ borderColor: '#e5e7eb' }}
        >
          Memuat data customer...
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={customers}
          searchKeys={['id', 'email', 'phone']}
          pageSize={10}
          onRowClick={(row) => goDetail(row.id)}
        />
      )}
    </PageContainer>
  );
};

export default Customers;
