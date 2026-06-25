import { useState } from 'react';
import { downloadSalesReport } from '../../../../services/merchantOrderService';

const PERIODS = [
  { key: 'weekly', label: 'Mingguan', desc: '7 hari terakhir' },
  { key: 'monthly', label: 'Bulanan', desc: 'Bulan berjalan' },
  { key: 'yearly', label: 'Tahunan', desc: 'Tahun berjalan' },
];

const SalesReportCard = () => {
  const [loadingKey, setLoadingKey] = useState(null);
  const [error, setError] = useState('');

  const handleDownload = async (period) => {
    if (loadingKey) return;
    setError('');
    setLoadingKey(period);
    try {
      await downloadSalesReport(period);
    } catch {
      setError('Gagal mengunduh laporan. Silakan coba lagi.');
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
      <div className="flex items-center gap-2 mb-1">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#1D3A27" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M14 2v6h6M9 13l2 2 4-4" stroke="#1D3A27" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="text-sm font-bold" style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}>
          Laporan Penjualan
        </p>
      </div>
      <p className="text-xs text-gray-500 mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
        Unduh rekap penjualan dalam format Excel (.xlsx)
      </p>

      <div className="flex flex-col gap-2">
        {PERIODS.map((p) => (
          <button
            key={p.key}
            onClick={() => handleDownload(p.key)}
            disabled={loadingKey !== null}
            className="flex items-center justify-between px-3 py-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-60"
            style={{ background: '#f5f7f5', border: '1px solid #eef0f2' }}
          >
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-800" style={{ fontFamily: "'Inter', sans-serif" }}>
                {p.label}
              </p>
              <p className="text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                {p.desc}
              </p>
            </div>
            {loadingKey === p.key ? (
              <span className="text-xs font-semibold" style={{ color: '#1D3A27', fontFamily: "'Inter', sans-serif" }}>
                Mengunduh...
              </span>
            ) : (
              <span
                className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
                style={{ background: '#1D3A27', fontFamily: "'Inter', sans-serif" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Excel
              </span>
            )}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default SalesReportCard;
