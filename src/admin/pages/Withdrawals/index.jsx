import { useState, useEffect, useCallback } from 'react';
import PageContainer from '../../components/PageContainer';
import StatCard from '../../components/StatCard';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';
import { CheckIcon, XIcon, WithdrawIcon } from '../../components/icons';
import {
  getWithdrawals,
  getWithdrawalSummary,
  approveWithdrawal,
  rejectWithdrawal,
  extractErrorMessage,
} from '../../../services/withdrawalService';
import { WITHDRAWAL_STATUS } from '../../../shared/constants';
import { formatCurrency, formatCompactCurrency, formatDate } from '../../utils/format';

// ── Toast ─────────────────────────────────────────────────────────────────────

const TOAST_COLORS = {
  success: { bg: '#dcfce7', color: '#15803d', border: '#bbf7d0' },
  error:   { bg: '#fee2e2', color: '#b91c1c', border: '#fecaca' },
  info:    { bg: '#dbeafe', color: '#1e40af', border: '#bfdbfe' },
};

const ToastList = ({ toasts, onRemove }) => (
  <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50 pointer-events-none">
    {toasts.map((t) => {
      const s = TOAST_COLORS[t.type] || TOAST_COLORS.info;
      return (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium max-w-sm"
          style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
        >
          <span className="flex-1">{t.message}</span>
          <button onClick={() => onRemove(t.id)} className="opacity-60 hover:opacity-100 text-lg leading-none">×</button>
        </div>
      );
    })}
  </div>
);

// ── Modal Reject ──────────────────────────────────────────────────────────────

const RejectModal = ({ withdrawal, onConfirm, onCancel, loading }) => {
  const [note, setNote] = useState('');
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
        <h3 className="font-bold text-gray-800 text-base mb-1">Tolak Withdrawal</h3>
        <p className="text-sm text-gray-500 mb-4">
          Nominal <span className="font-semibold text-gray-700">{formatCurrency(withdrawal.amount)}</span> dari{' '}
          <span className="font-semibold text-gray-700">{withdrawal.merchantName}</span>
        </p>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Alasan penolakan</label>
        <textarea
          rows={3}
          placeholder="Mis: Akun rekening tidak sesuai, perlu klarifikasi..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border rounded-xl px-3 py-2 text-sm outline-none resize-none"
          style={{ borderColor: '#e5e7eb' }}
        />
        <div className="flex gap-2 justify-end mt-4">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 border hover:bg-gray-50 disabled:opacity-40"
            style={{ borderColor: '#e5e7eb' }}
          >
            Batal
          </button>
          <button
            onClick={() => onConfirm(note.trim())}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
            style={{ background: '#ef4444' }}
          >
            {loading ? 'Memproses...' : <><XIcon size={13} /> Tolak</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Halaman utama ─────────────────────────────────────────────────────────────

const Withdrawals = () => {
  const [withdrawals, setWithdrawals]   = useState([]);
  const [summary, setSummary]           = useState(null);
  const [loading, setLoading]           = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toasts, setToasts]             = useState([]);
  const [rejectTarget, setRejectTarget] = useState(null);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Muat list dan summary secara paralel
  useEffect(() => {
    let active = true;
    Promise.all([getWithdrawals(), getWithdrawalSummary()])
      .then(([data, sum]) => {
        if (!active) return;
        setWithdrawals(data);
        setSummary(sum);
      })
      .catch((err) => {
        if (active) addToast(extractErrorMessage(err), 'error');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [addToast]);

  const refreshSummary = useCallback(() => {
    getWithdrawalSummary().then(setSummary).catch(() => {});
  }, []);

  const handleApprove = async (row) => {
    setActionLoading(true);
    const prev = withdrawals;
    setWithdrawals((cur) =>
      cur.map((w) => w.id === row.id ? { ...w, status: WITHDRAWAL_STATUS.APPROVED, processedAt: new Date().toISOString(), note: 'Disetujui oleh admin' } : w)
    );
    try {
      const updated = await approveWithdrawal(row.id);
      setWithdrawals((cur) => cur.map((w) => w.id === row.id ? { ...w, ...updated } : w));
      refreshSummary();
      addToast(`Withdrawal #${row.id} berhasil disetujui.`, 'success');
    } catch (err) {
      setWithdrawals(prev);
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectConfirm = async (note) => {
    if (!rejectTarget) return;
    setActionLoading(true);
    const prev = withdrawals;
    const target = rejectTarget;
    setRejectTarget(null);
    setWithdrawals((cur) =>
      cur.map((w) => w.id === target.id ? { ...w, status: WITHDRAWAL_STATUS.REJECTED, processedAt: new Date().toISOString(), note: note || 'Ditolak oleh admin' } : w)
    );
    try {
      const updated = await rejectWithdrawal(target.id, note);
      setWithdrawals((cur) => cur.map((w) => w.id === target.id ? { ...w, ...updated } : w));
      refreshSummary();
      addToast(`Withdrawal #${target.id} ditolak.`, 'info');
    } catch (err) {
      setWithdrawals(prev);
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setActionLoading(false);
    }
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
          <div className="text-[11px] text-gray-500">ID #{r.merchantId}</div>
        </div>
      ),
    },
    {
      key: 'amount',
      title: 'Nominal',
      render: (r) => (
        <span className="text-base font-bold whitespace-nowrap" style={{ color: '#1D3A27' }}>
          {formatCurrency(r.amount)}
        </span>
      ),
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
        r.status === WITHDRAWAL_STATUS.PENDING ? (
          <div className="flex gap-1">
            <button
              onClick={() => handleApprove(r)}
              disabled={actionLoading}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-white disabled:opacity-50"
              style={{ background: '#16a34a' }}
            >
              <CheckIcon size={12} />
              Approve
            </button>
            <button
              onClick={() => setRejectTarget(r)}
              disabled={actionLoading}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-white disabled:opacity-50"
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
        { value: WITHDRAWAL_STATUS.PENDING,  label: 'Pending' },
        { value: WITHDRAWAL_STATUS.APPROVED, label: 'Approved' },
        { value: WITHDRAWAL_STATUS.REJECTED, label: 'Rejected' },
      ],
    },
  ];

  const pending  = summary?.pending  ?? { count: 0, total_amount: 0 };
  const approved = summary?.approved ?? { count: 0, total_amount: 0 };
  const rejected = summary?.rejected ?? { count: 0, total_amount: 0 };

  return (
    <>
      <PageContainer
        title="Penarikan Dana Merchant"
        subtitle="Approve / reject permintaan withdrawal dari merchant"
      >
        {loading ? (
          <div
            className="bg-white rounded-2xl border p-10 text-center text-gray-400 text-sm"
            style={{ borderColor: '#e5e7eb' }}
          >
            Memuat data withdrawal...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard
                label="Pending Approval"
                value={pending.count}
                icon={WithdrawIcon}
                iconBg="#C8961A"
                changeLabel={formatCompactCurrency(pending.total_amount)}
              />
              <StatCard
                label="Total Pending Amount"
                value={formatCompactCurrency(pending.total_amount)}
                icon={WithdrawIcon}
                iconBg="#1D3A27"
              />
              <StatCard
                label="Approved"
                value={approved.count}
                icon={WithdrawIcon}
                iconBg="#16a34a"
                changeLabel={formatCompactCurrency(approved.total_amount)}
              />
              <StatCard
                label="Rejected"
                value={rejected.count}
                icon={WithdrawIcon}
                iconBg="#ef4444"
              />
            </div>

            <DataTable
              columns={columns}
              data={withdrawals}
              searchKeys={['merchantName', 'accountNumber', 'bank']}
              filters={filters}
              pageSize={15}
            />
          </>
        )}
      </PageContainer>

      {rejectTarget && (
        <RejectModal
          withdrawal={rejectTarget}
          onConfirm={handleRejectConfirm}
          onCancel={() => setRejectTarget(null)}
          loading={actionLoading}
        />
      )}

      <ToastList toasts={toasts} onRemove={removeToast} />
    </>
  );
};

export default Withdrawals;
