import { formatRupiah } from '../../../../shared/utils/format';

const statusConfig = {
  'Perlu Diproses': { bg: '#eff6ff', color: '#2563eb' },
  Diproses: { bg: '#fffbeb', color: '#d97706' },
  'Menunggu Konfirmasi': { bg: '#eef2ff', color: '#4f46e5' },
  Selesai: { bg: '#f0fdf4', color: '#16a34a' },
  Dibatalkan: { bg: '#fef2f2', color: '#dc2626' },
};

// Format singkat batas waktu, mis. "20 Jun, 14:35".
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

const WarningNote = ({ tone = 'amber', children }) => {
  const tones = {
    amber: { bg: '#fffbeb', border: '#fde68a', color: '#92400e' },
    red: { bg: '#fef2f2', border: '#fecaca', color: '#b91c1c' },
  };
  const t = tones[tone] || tones.amber;
  return (
    <div
      className="rounded-xl px-3 py-2.5 mb-3 flex items-start gap-2"
      style={{ background: t.bg, border: `1px solid ${t.border}` }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ marginTop: 1, flexShrink: 0 }}>
        <path
          d="M12 9v4M12 17h.01M10.3 3.86l-8.05 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.75-3.14l-8.05-14a2 2 0 0 0-3.4 0z"
          stroke={t.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
      <p className="text-[11px] leading-relaxed" style={{ color: t.color, fontFamily: "'Inter', sans-serif" }}>
        {children}
      </p>
    </div>
  );
};

const OrderDetail = ({ order, onClose, onUpdateStatus }) => {
  const status = statusConfig[order.status] || { bg: '#f3f4f6', color: '#6b7280' };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[55]"
        style={{ background: 'rgba(0,0,0,0.4)' }}
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[60] rounded-t-3xl bg-white"
        style={{ boxShadow: '0 -4px 24px rgba(0,0,0,0.12)' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full" style={{ background: '#e5e7eb' }} />
        </div>

        <div className="px-5 pb-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-bold text-base text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
                #{order.id}
              </p>
              <p className="text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                {order.time} · {order.type}
              </p>
            </div>
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: status.bg, color: status.color, fontFamily: "'Inter', sans-serif" }}
            >
              {order.status}
            </span>
          </div>

          {/* Nama pelanggan */}
          {order.customerName && (
            <div className="flex items-center gap-2 mb-4 px-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="#9ca3af" strokeWidth="1.8"/>
                <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <p className="text-sm text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                {order.customerName}
              </p>
            </div>
          )}

          {/* Detail Pesanan */}
          <div
            className="rounded-2xl p-4 mb-4"
            style={{ background: '#f9fafb', border: '1px solid #f3f4f6' }}
          >
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
              Detail Pesanan
            </p>
            {(order.items || []).map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-1.5"
                style={{ borderBottom: i < order.items.length - 1 ? '1px solid #f3f4f6' : 'none' }}
              >
                <p className="text-sm text-gray-700" style={{ fontFamily: "'Inter', sans-serif" }}>{item}</p>
              </div>
            ))}
          </div>

          {/* Info pembayaran */}
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm text-gray-500" style={{ fontFamily: "'Inter', sans-serif" }}>Metode Pembayaran</p>
            <p className="text-sm font-medium text-gray-800" style={{ fontFamily: "'Inter', sans-serif" }}>{order.payment}</p>
          </div>
          <div className="flex justify-between items-center mb-5">
            <p className="text-sm font-bold text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>Total</p>
            <p className="text-sm font-bold" style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}>
              {formatRupiah(order.total)}
            </p>
          </div>

          {/* Peringatan konsekuensi bila merchant tidak merespons */}
          {order.status === 'Perlu Diproses' && (
            <WarningNote tone="amber">
              Terima atau tolak pesanan ini
              {order.autoCancelAt ? ` sebelum ${formatJam(order.autoCancelAt)}` : ' segera'}.
              Jika dibiarkan, pesanan <b>otomatis dibatalkan</b> dan dana dikembalikan ke pelanggan.
            </WarningNote>
          )}
          {order.status === 'Diproses' && (
            <WarningNote tone={order.isPrepOverdue ? 'red' : 'amber'}>
              {order.isPrepOverdue ? (
                <>Pesanan ini <b>sudah melewati batas waktu penyelesaian</b>. Segera selesaikan
                  agar pelanggan tidak menunggu terlalu lama.</>
              ) : (
                <>Selesaikan pesanan
                  {order.prepDeadlineAt ? ` sebelum ${formatJam(order.prepDeadlineAt)}` : ''}.
                  Jika lewat, pesanan ditandai <b>terlambat</b>.</>
              )}
            </WarningNote>
          )}

          {/* Tombol aksi */}
          {order.status === 'Perlu Diproses' && (
            <div className="flex gap-3">
              <button
                onClick={() => onUpdateStatus(order.id, 'Dibatalkan')}
                className="flex-1 py-3 rounded-2xl font-semibold text-sm transition-all active:scale-95"
                style={{
                  background: '#fef2f2',
                  color: '#dc2626',
                  border: '1px solid #fecaca',
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Tolak
              </button>
              <button
                onClick={() => onUpdateStatus(order.id, 'Diproses')}
                className="flex-1 py-3 rounded-2xl font-semibold text-sm text-white transition-all active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #1D3A27 0%, #244830 100%)',
                  fontFamily: "'Poppins', sans-serif",
                  boxShadow: '0 4px 16px rgba(29,58,39,0.3)',
                }}
              >
                Terima
              </button>
            </div>
          )}

          {order.status === 'Diproses' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'Selesai')}
              className="w-full py-3 rounded-2xl font-semibold text-sm text-white transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                fontFamily: "'Poppins', sans-serif",
                boxShadow: '0 4px 16px rgba(22,163,74,0.3)',
              }}
            >
              Selesaikan Pesanan
            </button>
          )}

          {order.status === 'Menunggu Konfirmasi' && (
            <div className="space-y-3">
              <div
                className="rounded-xl px-3 py-2.5 flex items-start gap-2"
                style={{ background: '#eef2ff', border: '1px solid #c7d2fe' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ marginTop: 1, flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="9" stroke="#4338ca" strokeWidth="1.8" />
                  <path d="M12 11v5M12 8h.01" stroke="#4338ca" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <p className="text-[11px] leading-relaxed" style={{ color: '#4338ca', fontFamily: "'Inter', sans-serif" }}>
                  Pesanan sudah selesai disiapkan. Menunggu <b>konfirmasi pelanggan</b>
                  {' '}sebelum ditandai selesai — tidak ada tindakan lain dari kamu.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl font-semibold text-sm transition-all active:scale-95"
                style={{ background: '#f3f4f6', color: '#6b7280', fontFamily: "'Poppins', sans-serif" }}
              >
                Tutup
              </button>
            </div>
          )}

          {(order.status === 'Selesai' || order.status === 'Dibatalkan') && (
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl font-semibold text-sm transition-all active:scale-95"
              style={{
                background: '#f3f4f6',
                color: '#6b7280',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Tutup
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderDetail;
