import { formatRupiah } from '../../../../shared/utils/format';

const Row = ({ label, value, muted }) => (
  <div className="flex items-center justify-between">
    <span
      className="text-xs"
      style={{
        color: muted ? '#9ca3af' : '#6b7280',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {label}
    </span>
    <span
      className="text-xs font-semibold tabular-nums"
      style={{ color: '#374151', fontFamily: "'Poppins', sans-serif" }}
    >
      {value}
    </span>
  </div>
);

const CartSummary = ({ totalItems, subtotal, serviceFee = 0 }) => {
  const total = subtotal + serviceFee;
  return (
    <div
      className="mx-4 mt-4 p-4 bg-white rounded-2xl"
      style={{
        border: '1px solid #f3f4f6',
        boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
      }}
    >
      <h3
        className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-3"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Ringkasan Pesanan
      </h3>

      <div className="space-y-1.5">
        <Row label={`Subtotal (${totalItems} item)`} value={formatRupiah(subtotal)} />
        <Row label="Biaya layanan" value={serviceFee > 0 ? formatRupiah(serviceFee) : 'Gratis'} muted />
      </div>

      <div
        className="my-3 border-t border-dashed"
        style={{ borderColor: '#e5e7eb' }}
      />

      <div className="flex items-end justify-between">
        <span
          className="text-sm font-semibold text-gray-800"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Total Bayar
        </span>
        <span
          className="text-lg font-extrabold tabular-nums"
          style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
        >
          {formatRupiah(total)}
        </span>
      </div>
    </div>
  );
};

export default CartSummary;
