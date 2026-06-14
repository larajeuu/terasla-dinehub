import { formatRupiah } from '../../../../shared/utils/format';

const KeuanganHeader = ({ saldo }) => {
  return (
    <div
      className="px-4 pt-5 pb-6"
      style={{ background: 'linear-gradient(135deg, #1D3A27 0%, #244830 100%)' }}
    >
      <p className="text-white font-bold text-xl mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
        Dashboard Keuangan
      </p>

      <div
        className="rounded-2xl p-4"
        style={{
          background: 'linear-gradient(135deg, #C8961A 0%, #d6a425 100%)',
          boxShadow: '0 4px 16px rgba(200,150,26,0.35)',
        }}
      >
        <p className="text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: "'Inter', sans-serif" }}>
          Saldo Tenant
        </p>
        <p className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {formatRupiah(saldo)}
        </p>
        <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: "'Inter', sans-serif" }}>
          Terakhir diperbarui: hari ini 09.41
        </p>

        <button
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all active:scale-95"
          style={{
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.3)',
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Cairkan Dana
        </button>
      </div>
    </div>
  );
};

export default KeuanganHeader;