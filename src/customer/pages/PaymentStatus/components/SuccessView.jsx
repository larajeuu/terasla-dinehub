import { formatRupiah } from '../../../../shared/utils/format';

const formatTanggal = (iso) => {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return '-';
  }
};

const Row = ({ label, value, accent }) => (
  <div className="flex items-center justify-between py-2 border-t" style={{ borderColor: '#f1f5f9' }}>
    <span className="text-xs text-gray-500">{label}</span>
    <span className="text-sm font-semibold tabular-nums" style={{ color: accent || '#1f2937', fontFamily: "'Poppins', sans-serif" }}>
      {value}
    </span>
  </div>
);

const SuccessView = ({ charge, onHome, onSummary }) => (
  <div className="bg-white rounded-3xl overflow-hidden mx-auto max-w-sm" style={{ boxShadow: '0 12px 32px -8px rgba(0,0,0,0.3)' }}>
    <div className="p-6 text-center">
      <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3" style={{ background: '#1D3A27' }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
          <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className="text-lg font-bold" style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}>
        Pesanan Dikonfirmasi!
      </h2>
      <p className="text-xs text-gray-500 mt-1">Pesananmu sedang diproses. Silakan cek email untuk informasi lebih lanjut.</p>
    </div>

    <div className="px-5">
      <div className="rounded-2xl p-3 text-center mb-3" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
        <p className="text-[11px] uppercase tracking-wider text-gray-400">Nomor Pesanan</p>
        <p className="text-base font-bold text-gray-900 mt-0.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {charge.order_code}
        </p>
      </div>

      <Row label="Lokasi Meja" value={charge.no_meja || '-'} />
      <Row label="Total Bayar" value={formatRupiah(charge.nominal)} accent="#1D3A27" />
      <Row label="Metode" value={charge.method} />
      <Row label="Tanggal" value={formatTanggal(charge.created_at)} />

      <div className="rounded-2xl p-3 mt-3 text-center" style={{ background: '#f1f5f9' }}>
        <p className="text-sm font-bold text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Estimasi Siap 10 - 15 menit
        </p>
        <p className="text-[11px] text-gray-500 mt-0.5">Kami akan beri tahu saat pesananmu siap</p>
      </div>
    </div>

    <div className="px-5 py-5 space-y-2">
      <button
        onClick={onHome}
        className="w-full py-3 rounded-xl text-white text-sm font-bold transition-all active:scale-[0.98]"
        style={{ background: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
      >
        Kembali ke Beranda
      </button>
      <button
        onClick={onSummary}
        className="w-full py-2.5 rounded-xl text-sm font-semibold border"
        style={{ borderColor: '#e5e7eb', color: '#475569' }}
      >
        Lihat Ringkasan Transaksi
      </button>
    </div>
  </div>
);

export default SuccessView;
