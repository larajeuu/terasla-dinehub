import { formatRupiah } from '../../../../shared/utils/format';

const DashboardHeader = ({ tokoName, lokasi, pendapatan, pesananBaru, diproses }) => {
  return (
    <div
      className="px-4 pt-5 pb-6"
      style={{ background: 'linear-gradient(135deg, #1D3A27 0%, #244830 100%)' }}
    >
      {/* Nama toko + notif */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-white font-bold text-base" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {tokoName}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8"/>
              <circle cx="12" cy="9" r="2.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8"/>
            </svg>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Inter', sans-serif" }}>
              {lokasi}
            </p>
          </div>
        </div>
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center relative"
          style={{ background: 'rgba(255,255,255,0.12)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {pesananBaru > 0 && (
            <span
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white flex items-center justify-center"
              style={{ background: '#ef4444', fontSize: '9px', fontFamily: "'Inter', sans-serif" }}
            >
              {pesananBaru}
            </span>
          )}
        </button>
      </div>

      {/* Title */}
      <p className="text-white font-bold text-xl mb-0.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
        PESANAN MASUK
      </p>
      <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Inter', sans-serif" }}>
        Day, dd-mm-yyyy
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Pesanan Baru', value: pesananBaru, color: 'white' },
          { label: 'Diproses', value: diproses, color: 'white' },
          { label: 'Pendapatan Hari ini', value: formatRupiah(pendapatan), color: '#C8961A' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-2.5 flex flex-col gap-1 text-center"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <p
              className="font-bold text-base leading-none"
              style={{ color: stat.color, fontFamily: "'Poppins', sans-serif" }}
            >
              {stat.value}
            </p>
            <p
              className="text-xs leading-tight"
              style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Inter', sans-serif" }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHeader;