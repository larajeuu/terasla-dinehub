import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../../store/authStore';
import { getMerchantOrders } from '../../../../services/merchantOrderService';
import { getMerchantWithdrawals } from '../../../../services/withdrawalService';
import { formatRupiah } from '../../../../shared/utils/format';

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d)) return '-';
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Hari ini';
  if (d.toDateString() === yesterday.toDateString()) return 'Kemarin';
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

const formatTime = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d)) return '-';
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

const WITHDRAWAL_STATUS_LABEL = {
  pending: { label: 'Menunggu', color: '#d97706', bg: '#fffbeb' },
  approved: { label: 'Disetujui', color: '#16a34a', bg: '#f0fdf4' },
  rejected: { label: 'Ditolak', color: '#dc2626', bg: '#fef2f2' },
};

const RiwayatKeuangan = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Semua');

  useEffect(() => {
    if (!user?.merchantId) return;
    const load = async () => {
      try {
        const [orders, withdrawals] = await Promise.all([
          getMerchantOrders(user.merchantId),
          getMerchantWithdrawals(),
        ]);

        const orderTrx = orders.map((o) => {
          // Pesanan dibatalkan: dana dikembalikan ke pelanggan, jadi tidak
          // menambah pendapatan. Nilainya tetap 0 di riwayat (bukan bertambah).
          const isCancelled = o.status === 'Dibatalkan';
          return {
            id: o.orderCode || o.id,
            name: o.customerName || 'Pelanggan',
            amount: isCancelled ? 0 : (o.total || 0),
            type: 'masuk',
            category: 'Pesanan',
            cancelled: isCancelled,
            date: o.date,
            dateLabel: formatDate(o.date),
            time: formatTime(o.date),
            status: null,
          };
        });

        const withdrawalTrx = withdrawals.map((w) => ({
          id: `WD-${w.id}`,
          name: `${w.bank || 'Bank'} ****${String(w.accountNumber || '').slice(-4)}`,
          amount: w.amount || 0,
          type: 'keluar',
          category: 'Pencairan',
          date: w.requestedAt,
          dateLabel: formatDate(w.requestedAt),
          time: formatTime(w.requestedAt),
          status: w.status,
        }));

        const merged = [...orderTrx, ...withdrawalTrx].sort(
          (a, b) => new Date(b.date || 0) - new Date(a.date || 0)
        );
        setTransactions(merged);
      } catch {
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.merchantId]);

  const FILTERS = ['Semua', 'Pesanan', 'Pencairan'];
  const filtered = activeFilter === 'Semua'
    ? transactions
    : transactions.filter((t) => t.category === activeFilter);

  const grouped = filtered.reduce((acc, t) => {
    const key = t.dateLabel || '-';
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});

  const totalMasuk = transactions.filter((t) => t.type === 'masuk').reduce((s, t) => s + t.amount, 0);
  const totalKeluar = transactions.filter((t) => t.type === 'keluar').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="min-h-screen flex flex-col pb-6" style={{ background: '#f5f5f5' }}>
      <div className="px-4 pt-5 pb-5" style={{ background: 'linear-gradient(135deg, #1D3A27 0%, #244830 100%)' }}>
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/merchant/kontrol')}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 19l-7-7 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <p className="text-white font-bold text-base" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Riwayat Keuangan
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl px-3 py-3" style={{ background: 'rgba(255,255,255,0.12)' }}>
            <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.65)', fontFamily: "'Inter', sans-serif" }}>
              Total Masuk
            </p>
            <p className="text-base font-bold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {formatRupiah(totalMasuk)}
            </p>
          </div>
          <div className="rounded-2xl px-3 py-3" style={{ background: 'rgba(255,255,255,0.12)' }}>
            <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.65)', fontFamily: "'Inter', sans-serif" }}>
              Total Dicairkan
            </p>
            <p className="text-base font-bold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {formatRupiah(totalKeluar)}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 pb-2 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: activeFilter === f ? '#1D3A27' : 'white',
              color: activeFilter === f ? 'white' : '#6b7280',
              fontFamily: "'Inter', sans-serif",
              border: activeFilter === f ? 'none' : '1px solid #f3f4f6',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="px-4 flex flex-col gap-3">
        {loading ? (
          <p className="text-center text-sm text-gray-400 mt-8" style={{ fontFamily: "'Inter', sans-serif" }}>
            Memuat riwayat...
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-sm text-gray-400 mt-8" style={{ fontFamily: "'Inter', sans-serif" }}>
            Tidak ada transaksi.
          </p>
        ) : (
          Object.entries(grouped).map(([dateLabel, items]) => (
            <div key={dateLabel}>
              <p className="text-xs font-semibold text-gray-400 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                {dateLabel}
              </p>
              <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>
                {items.map((trx, idx) => {
                  const statusInfo = trx.status
                    ? WITHDRAWAL_STATUS_LABEL[trx.status]
                    : (trx.cancelled
                        ? { label: 'Dibatalkan', color: '#dc2626', bg: '#fef2f2' }
                        : null);
                  return (
                    <div
                      key={trx.id + idx}
                      className="flex items-center gap-3 px-4 py-3"
                      style={{ borderBottom: idx < items.length - 1 ? '1px solid #f3f4f6' : 'none' }}
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: trx.cancelled ? '#f3f4f6' : (trx.type === 'masuk' ? '#f0fdf4' : '#fef2f2') }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          {trx.cancelled ? (
                            <path d="M18 6L6 18M6 6l12 12" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          ) : trx.type === 'masuk' ? (
                            <path d="M12 19V5M5 12l7-7 7 7" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          ) : (
                            <path d="M12 5v14M5 12l7 7 7-7" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          )}
                        </svg>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {trx.name}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                            {trx.id} · {trx.time}
                          </p>
                          {statusInfo && (
                            <span
                              className="text-xs font-semibold px-1.5 py-0.5 rounded-md"
                              style={{ color: statusInfo.color, background: statusInfo.bg, fontFamily: "'Inter', sans-serif" }}
                            >
                              {statusInfo.label}
                            </span>
                          )}
                        </div>
                      </div>

                      <p
                        className="text-sm font-bold shrink-0"
                        style={{ color: trx.cancelled ? '#9ca3af' : (trx.type === 'masuk' ? '#16a34a' : '#dc2626'), fontFamily: "'Poppins', sans-serif" }}
                      >
                        {trx.cancelled ? '' : (trx.type === 'masuk' ? '+' : '-')}{formatRupiah(trx.amount)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RiwayatKeuangan;