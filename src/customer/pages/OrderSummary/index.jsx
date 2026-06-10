import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderByPaymentToken } from '../../../services/paymentService';
import { formatRupiah } from '../../../shared/utils/format';

// Label + warna status (mencakup status customer order & merchant order).
const STATUS = {
  verifying: { label: 'Menunggu Pembayaran', color: '#b45309', bg: '#fffbeb' },
  open: { label: 'Diproses', color: '#1d4ed8', bg: '#eff6ff' },
  process: { label: 'Diproses', color: '#1d4ed8', bg: '#eff6ff' },
  waiting_confirmation: { label: 'Menunggu Konfirmasi', color: '#b45309', bg: '#fffbeb' },
  done: { label: 'Selesai', color: '#15803d', bg: '#f0fdf4' },
  cancelled: { label: 'Dibatalkan', color: '#b91c1c', bg: '#fef2f2' },
  baru: { label: 'Baru', color: '#475569', bg: '#f1f5f9' },
  terbuka: { label: 'Diterima', color: '#1d4ed8', bg: '#eff6ff' },
  diproses: { label: 'Diproses', color: '#1d4ed8', bg: '#eff6ff' },
  selesai: { label: 'Selesai', color: '#15803d', bg: '#f0fdf4' },
  dibatalkan: { label: 'Dibatalkan', color: '#b91c1c', bg: '#fef2f2' },
};

const StatusBadge = ({ status }) => {
  const s = STATUS[status] || { label: status || '-', color: '#475569', bg: '#f1f5f9' };
  return (
    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ color: s.color, background: s.bg }}>
      {s.label}
    </span>
  );
};

const formatTanggal = (iso) => {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return '-';
  }
};

const InfoRow = ({ label, value, accent }) => (
  <div className="flex items-center justify-between py-1.5">
    <span className="text-xs text-gray-500">{label}</span>
    <span className="text-sm font-semibold tabular-nums" style={{ color: accent || '#1f2937', fontFamily: "'Poppins', sans-serif" }}>
      {value}
    </span>
  </div>
);

const OrderSummary = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setOrder(await getOrderByPaymentToken(token));
    } catch (err) {
      setError(err?.response?.data?.detail || 'Gagal memuat ringkasan transaksi');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const merchantOrders = order?.merchant_orders || [];

  return (
    <div className="min-h-screen pb-24" style={{ background: '#f9fafb', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3.5 bg-white border-b" style={{ borderColor: '#f1f5f9' }}>
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-gray-600">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="text-base font-bold" style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}>
          Ringkasan Transaksi
        </h1>
      </div>

      {loading && <p className="text-center text-gray-400 text-sm py-16">Memuat ringkasan...</p>}

      {error && !loading && (
        <div className="text-center py-16 px-4">
          <p className="text-red-500 text-sm mb-3">{error}</p>
          <button onClick={load} className="text-sm font-semibold px-4 py-2 rounded-lg text-white" style={{ background: '#1D3A27' }}>
            Coba Lagi
          </button>
        </div>
      )}

      {!loading && !error && order && (
        <div className="p-4 space-y-4">
          {/* Ringkasan order */}
          <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#e5e7eb' }}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-400">Nomor Pesanan</p>
                <p className="text-base font-bold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {order.order_code}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <div className="divide-y" style={{ borderColor: '#f1f5f9' }}>
              <InfoRow label="Lokasi Meja" value={order.no_meja || '-'} />
              <InfoRow label="Metode Pembayaran" value={order.metode_pembayaran || '-'} />
              <InfoRow label="Jumlah Tenant" value={`${order.tenant_count} tenant`} />
              <InfoRow label="Waktu Pesan" value={formatTanggal(order.created_at)} />
              {order.catatan && <InfoRow label="Catatan" value={order.catatan} />}
              <InfoRow label="Total Bayar" value={formatRupiah(order.total_harga)} accent="#1D3A27" />
            </div>
          </div>

          {/* Pesanan per tenant */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2 px-1">
              Pesanan per Tenant ({merchantOrders.length})
            </p>
            <div className="space-y-3">
              {merchantOrders.map((mo) => (
                <div key={mo.id} className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e5e7eb' }}>
                  <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: '#f1f5f9' }}>
                    <div>
                      <p className="text-sm font-bold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {mo.merchant_nama || `Tenant #${mo.merchant_id}`}
                      </p>
                      <p className="text-[11px] text-gray-400 font-mono">{mo.order_code}</p>
                    </div>
                    <StatusBadge status={mo.status} />
                  </div>

                  <div className="px-4 py-2">
                    {(mo.items || []).map((it) => (
                      <div key={it.id} className="flex items-start justify-between gap-3 py-1.5">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 truncate">
                            {it.product?.nama || 'Produk'}
                            {it.varian ? <span className="text-gray-400"> · {it.varian}</span> : null}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            {it.jumlah} × {formatRupiah(it.harga_satuan)}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-gray-700 tabular-nums">
                          {formatRupiah(it.subtotal)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between px-4 py-2.5 border-t" style={{ borderColor: '#f1f5f9', background: '#fafafa' }}>
                    <span className="text-xs text-gray-500">Subtotal tenant</span>
                    <span className="text-sm font-bold" style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}>
                      {formatRupiah(mo.total_harga)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full py-3 rounded-2xl text-white text-sm font-bold"
            style={{ background: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
          >
            Kembali ke Beranda
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
