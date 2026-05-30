import { formatRupiah } from '../../../../shared/utils/format';

const TransactionList = ({ transactions }) => {
  const grouped = transactions.reduce((acc, trx) => {
    if (!acc[trx.date]) acc[trx.date] = [];
    acc[trx.date].push(trx);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-3 pb-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
        Riwayat Transaksi
      </p>

      {Object.entries(grouped).map(([date, items]) => (
        <div key={date}>
          {/* Tanggal */}
          <p
            className="text-xs font-semibold text-gray-400 mb-2"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {date}
          </p>

          <div
            className="bg-white rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}
          >
            {items.map((trx, index) => (
              <div
                key={trx.id}
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderBottom: index < items.length - 1 ? '1px solid #f3f4f6' : 'none' }}
              >
                {/* Icon */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: trx.type === 'masuk' ? '#f0fdf4' : '#fef2f2' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    {trx.type === 'masuk' ? (
                      <path d="M12 19V5M5 12l7-7 7 7" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    ) : (
                      <path d="M12 5v14M5 12l7 7 7-7" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    )}
                  </svg>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {trx.name}
                  </p>
                  <p className="text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {trx.id} · {trx.time}
                  </p>
                </div>

                {/* Nominal */}
                <p
                  className="text-sm font-bold shrink-0"
                  style={{
                    color: trx.type === 'masuk' ? '#16a34a' : '#dc2626',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {trx.type === 'masuk' ? '+' : '-'}{formatRupiah(trx.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;