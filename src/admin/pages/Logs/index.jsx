import PageContainer from '../../components/PageContainer';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';
import { dummyAdminLogs } from '../../../data/dummy/adminLogs';
import { formatDate } from '../../utils/format';

const ACTION_LABEL = {
  LOGIN: 'Login',
  WITHDRAWAL_APPROVED: 'Approve Withdrawal',
  WITHDRAWAL_REJECTED: 'Reject Withdrawal',
  MERCHANT_APPROVED: 'Approve Merchant',
  MERCHANT_SUSPENDED: 'Suspend Merchant',
  CUSTOMER_FLAGGED: 'Flag Customer',
  CATEGORY_ADDED: 'Tambah Kategori',
  BANNER_CREATED: 'Create Banner',
  REFUND_APPROVED: 'Approve Refund',
};

const Logs = () => {
  const columns = [
    {
      key: 'id',
      title: 'Log ID',
      render: (r) => <span className="font-mono text-xs text-gray-600">{r.id}</span>,
    },
    {
      key: 'timestamp',
      title: 'Waktu',
      render: (r) => <span className="text-xs text-gray-600 whitespace-nowrap">{formatDate(r.timestamp)}</span>,
    },
    {
      key: 'admin',
      title: 'Admin',
      render: (r) => <span className="text-sm font-semibold text-gray-700">{r.admin}</span>,
    },
    {
      key: 'action',
      title: 'Aksi',
      render: (r) => (
        <span
          className="px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide"
          style={{ background: '#f1f5f9', color: '#1D3A27' }}
        >
          {ACTION_LABEL[r.action] || r.action}
        </span>
      ),
    },
    {
      key: 'target',
      title: 'Target',
      render: (r) => <span className="font-mono text-xs text-gray-600">{r.target}</span>,
    },
    {
      key: 'description',
      title: 'Deskripsi',
      render: (r) => <span className="text-sm text-gray-700">{r.description}</span>,
    },
    { key: 'severity', title: 'Severity', render: (r) => <Badge status={r.severity} /> },
  ];

  const filters = [
    {
      key: 'severity',
      label: 'Severity',
      options: [
        { value: 'info', label: 'Info' },
        { value: 'warning', label: 'Warning' },
        { value: 'critical', label: 'Critical' },
      ],
    },
    {
      key: 'action',
      label: 'Aksi',
      options: Object.entries(ACTION_LABEL).map(([value, label]) => ({ value, label })),
    },
  ];

  return (
    <PageContainer
      title="Activity Logs"
      subtitle="Audit trail semua aksi admin di platform"
    >
      <DataTable
        columns={columns}
        data={dummyAdminLogs}
        searchKeys={['id', 'admin', 'target', 'description']}
        filters={filters}
        pageSize={15}
      />
    </PageContainer>
  );
};

export default Logs;
