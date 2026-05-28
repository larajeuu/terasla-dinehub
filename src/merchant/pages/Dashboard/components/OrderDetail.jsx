import { formatRupiah } from '../../../../shared/utils/format';

const statusConfig = {
  Baru: { bg: '#eff6ff', color: '#2563eb' },
  Diproses: { bg: '#fffbeb', color: '#d97706' },
  Selesai: { bg: '#f0fdf4', color: '#16a34a' },
  Dibatalkan: { bg: '#fef2f2', color: '#dc2626' },
};

const OrderDetail = ({ order, onClose, onUpdateStatus }) => {
  const status = statusConfig[order.status];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.4)' }}
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white"
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

          {/* Info customer */}
          <div
            className="rounded-2xl p-4 mb-4"
            style={{ background: '#f9fafb', border: '1px solid #f3f4f6' }}
          >
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
              Detail Pesanan
            </p>
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between items-center py-1.5" style={{ borderBottom: i < order.items.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
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

          {/* Tombol aksi */}
          {order.status === 'Baru' && (
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