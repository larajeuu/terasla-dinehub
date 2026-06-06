const typeConfig = {
  Pesanan:    { icon: '📋', label: 'Detail Pesanan' },
  Pencairan:  { icon: '💰', label: 'Detail Pencairan Dana' },
  Ulasan:     { icon: '⭐', label: 'Ulasan Customer' },
  Pengumuman: { icon: '📢', label: 'Pengumuman' },
  Pengingat:  { icon: '🔔', label: 'Pengingat' },
};

const statusOrder = ['Baru', 'Diterima', 'Selesai'];
const statusConfig = {
  Baru:     { label: 'Order Baru',  color: '#2563eb', bg: '#eff6ff' },
  Diterima: { label: 'Diproses',    color: '#d97706', bg: '#fffbeb' },
  Selesai:  { label: 'Selesai',     color: '#16a34a', bg: '#f0fdf4' },
};

const formatRupiah = (amount) => 'Rp ' + amount.toLocaleString('id-ID');

// ── Detail layouts per type ──────────────────────────────────────────────────

const DetailPesanan = ({ notif }) => {
  const currentStep = statusOrder.indexOf(notif.status);
  return (
    <div className="flex flex-col gap-4">
      {/* Status timeline */}
      <div
        className="bg-white rounded-2xl px-4 py-4"
        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
      >
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Status Pesanan
        </p>
        <div className="flex items-center gap-0">
          {statusOrder.map((step, i) => {
            const done = i <= currentStep;
            const cfg = statusConfig[step];
            return (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: done ? cfg.color : '#e5e7eb',
                      color: done ? 'white' : '#9ca3af',
                    }}
                  >
                    {i + 1}
                  </div>
                  <span className="text-xs text-center" style={{ color: done ? cfg.color : '#9ca3af', fontWeight: done ? 600 : 400, maxWidth: 60 }}>
                    {cfg.label}
                  </span>
                </div>
                {i < statusOrder.length - 1 && (
                  <div
                    className="flex-1 h-0.5 mx-1 mb-4"
                    style={{ background: i < currentStep ? '#16a34a' : '#e5e7eb' }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Info pesanan */}
      <div
        className="bg-white rounded-2xl px-4 py-4"
        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
      >
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Info Pesanan
        </p>
        <div className="flex flex-col gap-2.5">
          <Row label="No. Pesanan" value={notif.orderNumber} bold />
          <Row label="Customer"    value={notif.customerName} />
          <Row label="Item"        value={notif.items} />
          <Row label="Waktu"       value={`${notif.timeAgo} · ${notif.time}`} />
        </div>
      </div>
    </div>
  );
};

const DetailPencairan = ({ notif }) => (
  <div className="flex flex-col gap-4">
    {/* Nominal */}
    <div
      className="bg-white rounded-2xl px-4 py-5 flex flex-col items-center"
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-3"
        style={{ background: '#e8f5e9' }}
      >
        💰
      </div>
      <p className="text-2xl font-bold" style={{ color: '#16a34a', fontFamily: "'Poppins', sans-serif" }}>
        {formatRupiah(notif.amount)}
      </p>
      <p className="text-xs text-gray-400 mt-1">{notif.description}</p>
    </div>

    {/* Detail waktu */}
    <div
      className="bg-white rounded-2xl px-4 py-4"
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
    >
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
        Info Pencairan
      </p>
      <div className="flex flex-col gap-2.5">
        <Row label="Status"  value="Berhasil" valueColor="#16a34a" />
        <Row label="Waktu"   value={`${notif.timeAgo} · ${notif.time}`} />
      </div>
    </div>
  </div>
);

const DetailUlasan = ({ notif }) => (
  <div className="flex flex-col gap-4">
    {/* Rating */}
    <div
      className="bg-white rounded-2xl px-4 py-5 flex flex-col items-center"
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
    >
      <p className="text-sm font-semibold text-gray-700 mb-2">{notif.customerName}</p>
      <div className="flex gap-1 mb-3">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} style={{ fontSize: 28, color: i < notif.rating ? '#f59e0b' : '#e5e7eb' }}>★</span>
        ))}
      </div>
      <div
        className="w-full rounded-xl px-4 py-3"
        style={{ background: '#f9fafb', borderLeft: '3px solid #f59e0b' }}
      >
        <p className="text-sm text-gray-600 italic">"{notif.review}"</p>
      </div>
    </div>

    {/* Waktu */}
    <div
      className="bg-white rounded-2xl px-4 py-4"
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
    >
      <div className="flex flex-col gap-2.5">
        <Row label="Rating" value={`${notif.rating} / 5`} />
        <Row label="Waktu"  value={`${notif.timeAgo} · ${notif.time}`} />
      </div>
    </div>
  </div>
);

const DetailPengumuman = ({ notif }) => (
  <div className="flex flex-col gap-4">
    <div
      className="bg-white rounded-2xl px-4 py-4"
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{ background: '#e3f2fd' }}>
          📢
        </div>
        <div>
          <p className="text-xs text-gray-400">Dari</p>
          <p className="text-sm font-semibold text-gray-700">Admin Teras LA</p>
        </div>
      </div>
      <p className="text-base font-bold text-gray-800 mb-2">{notif.title}</p>
      <p className="text-sm text-gray-600 leading-relaxed">{notif.description}</p>
    </div>

    <div
      className="bg-white rounded-2xl px-4 py-4"
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
    >
      <Row label="Waktu" value={`${notif.timeAgo} · ${notif.time}`} />
    </div>
  </div>
);

const DetailPengingat = ({ notif }) => (
  <div className="flex flex-col gap-4">
    <div
      className="bg-white rounded-2xl px-4 py-4"
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{ background: '#fff8e1' }}>
          🔔
        </div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Pengingat</p>
      </div>
      <p className="text-base font-bold text-gray-800 mb-2">{notif.title}</p>
      <p className="text-sm text-gray-600 leading-relaxed">{notif.description}</p>
    </div>

    <div
      className="bg-white rounded-2xl px-4 py-4"
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
    >
      <Row label="Waktu" value={`${notif.timeAgo} · ${notif.time}`} />
    </div>
  </div>
);

// ── Shared row component ─────────────────────────────────────────────────────

const Row = ({ label, value, bold, valueColor }) => (
  <div className="flex items-start justify-between gap-4">
    <p className="text-xs text-gray-400 shrink-0" style={{ fontFamily: "'Inter', sans-serif" }}>
      {label}
    </p>
    <p
      className="text-xs text-right"
      style={{
        color: valueColor || '#374151',
        fontWeight: bold ? 700 : 500,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {value}
    </p>
  </div>
);

const detailComponents = {
  Pesanan:    DetailPesanan,
  Pencairan:  DetailPencairan,
  Ulasan:     DetailUlasan,
  Pengumuman: DetailPengumuman,
  Pengingat:  DetailPengingat,
};

// ── Main component ───────────────────────────────────────────────────────────

const NotifikasiDetail = ({ notif, onBack }) => {
  const cfg = typeConfig[notif.type] || typeConfig.Pengumuman;
  const DetailContent = detailComponents[notif.type] || DetailPengumuman;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f5f5f5' }}>
      {/* Header */}
      <div
        className="px-4 pt-5 pb-4 flex items-center gap-3"
        style={{ background: 'linear-gradient(135deg, #1D3A27 0%, #244830 100%)' }}
      >
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{ background: 'rgba(255,255,255,0.12)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <p className="text-white font-bold text-base" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {cfg.label}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4">
        <DetailContent notif={notif} />
      </div>
    </div>
  );
};

export default NotifikasiDetail;
