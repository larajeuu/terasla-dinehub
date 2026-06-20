import { formatRupiah } from '../../../../shared/utils/format';

const statusConfig = {
  'Perlu Diproses': { bg: '#eff6ff', color: '#2563eb', label: 'Perlu Diproses' },
  Diproses: { bg: '#fffbeb', color: '#d97706', label: 'Diproses' },
  Selesai: { bg: '#f0fdf4', color: '#16a34a', label: 'Selesai' },
  Dibatalkan: { bg: '#fef2f2', color: '#dc2626', label: 'Dibatalkan' },
};

const OrderCard = ({ order, onClick }) => {
  const status = statusConfig[order.status] || { bg: '#f3f4f6', color: '#6b7280', label: order.status };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-4 flex flex-col gap-2 cursor-pointer active:scale-95 transition-all"
      style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-sm text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
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
          {status.label}
        </span>
      </div>

      <p className="text-xs text-gray-500" style={{ fontFamily: "'Inter', sans-serif" }}>
        <span className="font-medium text-gray-700">{order.customerName || 'Pelanggan'}</span>
        {order.items?.length > 0 && ` · ${order.items.join(', ')}`}
      </p>

      <div className="flex items-center justify-between pt-1" style={{ borderTop: '1px solid #f3f4f6' }}>
        <p className="font-bold text-sm" style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}>
          {formatRupiah(order.total)}
        </p>
        {order.payment ? (
          <p className="text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
            {order.payment} ›
          </p>
        ) : (
          <p className="text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>›</p>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
