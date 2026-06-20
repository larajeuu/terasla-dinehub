import { formatRupiah } from '../../../../shared/utils/format';

const SalesSummary = ({ totalOrder, totalPendapatan, produkTerlaris }) => {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
        Ringkasan Hari Ini
      </p>

      <div className="grid grid-cols-2 gap-3">
        {/* Total Order */}
        <div
          className="bg-white rounded-2xl p-4"
          style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
            style={{ background: '#eff6ff' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round"/>
              <rect x="9" y="3" width="6" height="4" rx="1" stroke="#2563eb" strokeWidth="1.8"/>
            </svg>
          </div>
          <p className="text-xl font-bold text-gray-800 leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {totalOrder}
          </p>
          <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
            Total Pesanan
          </p>
        </div>

        {/* Total Pendapatan */}
        <div
          className="bg-white rounded-2xl p-4"
          style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
            style={{ background: '#f0fdf4' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="7" width="20" height="14" rx="2" stroke="#16a34a" strokeWidth="1.8"/>
              <path d="M16 14a1 1 0 110 2 1 1 0 010-2z" fill="#16a34a"/>
              <path d="M2 10h20" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M6 3l3 4M18 3l-3 4" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="text-lg font-bold text-gray-800 leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {formatRupiah(totalPendapatan)}
          </p>
          <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
            Total Pendapatan
          </p>
        </div>
      </div>

      {/* Produk terlaris */}
      <div
        className="bg-white rounded-2xl p-4 flex items-center gap-3"
        style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: '#fffbeb' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
            Produk Terlaris
          </p>
          <p className="text-sm font-semibold text-gray-800 truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {produkTerlaris}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalesSummary;