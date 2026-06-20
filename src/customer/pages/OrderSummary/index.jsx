import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderByPaymentToken, cancelMerchantOrderByToken } from '../../../services/paymentService';
import { confirmCustomerOrderByHash, getCustomerOrderByHash } from '../../../services/customerOrderService';
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

// Format singkat untuk batas waktu (deadline), mis. "20 Jun, 14:35".
const formatJam = (iso) => {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleString('id-ID', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return null;
  }
};

const WarningBox = ({ tone = 'amber', children }) => {
  const tones = {
    amber: { bg: '#fffbeb', border: '#fde68a', color: '#92400e' },
    red: { bg: '#fef2f2', border: '#fecaca', color: '#b91c1c' },
  };
  const t = tones[tone] || tones.amber;
  return (
    <div
      className="rounded-2xl px-4 py-3 flex items-start gap-2.5"
      style={{ background: t.bg, border: `1px solid ${t.border}` }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginTop: 1, flexShrink: 0 }}>
        <path
          d="M12 9v4M12 17h.01M10.3 3.86l-8.05 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.75-3.14l-8.05-14a2 2 0 0 0-3.4 0z"
          stroke={t.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
      <p className="text-xs leading-relaxed" style={{ color: t.color }}>{children}</p>
    </div>
  );
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
  const { token, hash } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [confirmErr, setConfirmErr] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelErr, setCancelErr] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Via token pembayaran (alur normal) atau via hash (link email /order/:hash).
      setOrder(token ? await getOrderByPaymentToken(token) : await getCustomerOrderByHash(hash));
    } catch (err) {
      setError(err?.response?.data?.detail || 'Gagal memuat ringkasan transaksi');
    } finally {
      setLoading(false);
    }
  }, [token, hash]);

  useEffect(() => { load(); }, [load]);

  // Selama pesanan masih dikerjakan tenant (open/process), poll berkala supaya
  // tombol "Konfirmasi" muncul otomatis begitu semua tenant selesai
  // (status struk → waiting_confirmation). Berhenti saat menunggu konfirmasi/final.
  useEffect(() => {
    if (!order) return undefined;
    const inProgress = order.status === 'open' || order.status === 'process';
    if (!inProgress) return undefined;
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [order, load]);

  const handleConfirm = async () => {
    if (!order?.hash) return;
    setConfirming(true);
    setConfirmErr(null);
    try {
      setOrder(await confirmCustomerOrderByHash(order.hash));
    } catch (err) {
      setConfirmErr(err?.response?.data?.detail || 'Gagal mengonfirmasi pesanan');
    } finally {
      setConfirming(false);
    }
  };

  const handleCancelTenant = async (moId) => {
    setCancellingId(moId);
    setCancelErr(null);
    try {
      setOrder(await cancelMerchantOrderByToken(token, moId));
    } catch (err) {
      setCancelErr(err?.response?.data?.detail || 'Gagal membatalkan pesanan tenant');
    } finally {
      setCancellingId(null);
    }
  };

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
          {/* Peringatan konsekuensi bila customer tidak merespons */}
          {order.status === 'verifying' && (
            <WarningBox tone="amber">
              Selesaikan pembayaran
              {order.pay_deadline_at ? ` sebelum ${formatJam(order.pay_deadline_at)}` : ''}.
              Jika belum dibayar, <b>pesanan otomatis dibatalkan</b> dan stok dilepas kembali.
            </WarningBox>
          )}
          {order.status === 'waiting_confirmation' && (
            <WarningBox tone="amber">
              Semua pesanan sudah disiapkan. Tekan <b>Konfirmasi Pesanan Diterima</b> di bawah
              {order.auto_confirm_at ? ` sebelum ${formatJam(order.auto_confirm_at)}` : ''}.
              Jika tidak, pesanan <b>otomatis ditandai selesai</b>.
            </WarningBox>
          )}

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

                  {mo.status === 'terbuka' && mo.auto_cancel_at && (
                    <p className="px-4 pt-2 text-[11px] leading-snug" style={{ color: '#92400e' }}>
                      Menunggu tenant menerima. Bila tak direspons sebelum {formatJam(mo.auto_cancel_at)},
                      pesanan tenant ini otomatis dibatalkan & dananya dikembalikan.
                    </p>
                  )}
                  {mo.status === 'diproses' && mo.is_prep_overdue && (
                    <div className="px-4 pt-2.5">
                      <p className="text-[11px] leading-snug mb-2" style={{ color: '#b91c1c' }}>
                        Tenant ini melewati batas waktu penyiapan.
                        {token
                          ? ' Kamu bisa membatalkan pesanan tenant ini & dananya akan dikembalikan. Tenant lain tidak terpengaruh.'
                          : ' Mohon tunggu, atau buka halaman ini dari tautan pembayaranmu untuk membatalkan.'}
                      </p>
                      {token && (
                        <button
                          onClick={() => handleCancelTenant(mo.id)}
                          disabled={cancellingId === mo.id}
                          className="text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-all active:scale-[0.98] disabled:opacity-60"
                          style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', fontFamily: "'Poppins', sans-serif" }}
                        >
                          {cancellingId === mo.id ? 'Membatalkan…' : 'Batalkan tenant ini & minta refund'}
                        </button>
                      )}
                      {cancelErr && cancellingId === null && (
                        <p className="text-[11px] text-red-500 mt-1.5">{cancelErr}</p>
                      )}
                    </div>
                  )}

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

          {order.status === 'waiting_confirmation' ? (
            <div className="space-y-2">
              {confirmErr && (
                <p className="text-xs text-red-500 text-center">{confirmErr}</p>
              )}
              <button
                onClick={handleConfirm}
                disabled={confirming}
                className="w-full py-3 rounded-2xl text-white text-sm font-bold disabled:opacity-60"
                style={{ background: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
              >
                {confirming ? 'Memproses...' : 'Konfirmasi Pesanan Diterima'}
              </button>
              <p className="text-[11px] text-gray-400 text-center px-4 leading-relaxed">
                Tekan setelah seluruh pesanan kamu terima. Pesanan akan ditandai selesai.
              </p>
              <button
                onClick={() => navigate('/')}
                className="w-full py-2.5 rounded-2xl text-sm font-semibold"
                style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
              >
                Nanti Saja
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 rounded-2xl text-white text-sm font-bold"
              style={{ background: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
            >
              Kembali ke Beranda
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
