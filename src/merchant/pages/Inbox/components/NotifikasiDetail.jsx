const formatRupiah = (n) => 'Rp ' + Number(n).toLocaleString('id-ID');

// ── Icons ────────────────────────────────────────────────────────────────────

const IconDoc = ({ color }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
    <path d="M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
    <line x1="9" y1="12" x2="15" y2="12"/>
    <line x1="9" y1="16" x2="13" y2="16"/>
  </svg>
);

const IconRefresh = ({ color }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 109-9 9 9 0 00-6.9 3.2"/>
    <path d="M3 4v5h5"/>
  </svg>
);

const IconCheck = ({ color }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);

const IconX = ({ color }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

const IconMoney = ({ color }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 14a1 1 0 110 2 1 1 0 010-2z" fill={color} stroke="none"/>
    <path d="M2 10h20"/>
  </svg>
);

const IconStar = ({ color }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const IconBell = ({ color }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
);

const IconWarn = ({ color }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const IconAlert = ({ color }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

// ── Hero config per tipe / status ────────────────────────────────────────────

const pesananHero = {
  Baru:       { title: 'Order Baru Masuk!',        Icon: IconDoc,     bg: '#eff6ff', color: '#2563eb' },
  Diterima:   { title: 'Perubahan Status Order',   Icon: IconRefresh, bg: '#fffbeb', color: '#d97706' },
  Selesai:    { title: 'Order Selesai',            Icon: IconCheck,   bg: '#f0fdf4', color: '#16a34a' },
  Dibatalkan: { title: 'Pesanan Dibatalkan',       Icon: IconX,       bg: '#fef2f2', color: '#dc2626' },
};

const statusBadge = {
  Baru:       { label: 'Baru',       color: '#2563eb', bg: '#eff6ff' },
  Diterima:   { label: 'Diproses',   color: '#d97706', bg: '#fffbeb' },
  Selesai:    { label: 'Selesai',    color: '#16a34a', bg: '#f0fdf4' },
  Dibatalkan: { label: 'Dibatalkan', color: '#dc2626', bg: '#fef2f2' },
};

// ── Shared components ────────────────────────────────────────────────────────

const Hero = ({ bg, color, Icon, title, timeAgo, time }) => (
  <div className="flex flex-col items-center text-center pt-6 pb-4 px-6">
    <div
      className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4"
      style={{ background: bg, boxShadow: `0 4px 20px ${color}22` }}
    >
      <Icon color={color} />
    </div>
    <p className="text-lg font-bold text-gray-800 mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {title}
    </p>
    <p className="text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
      {timeAgo} · {time}
    </p>
  </div>
);

const InfoRow = ({ label, value, badge }) => (
  <div className="flex items-center justify-between gap-3 py-3" style={{ borderBottom: '1px solid #f3f4f6' }}>
    <p className="text-sm text-gray-500" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</p>
    {badge ? (
      <span
        className="text-xs font-semibold px-2.5 py-1 rounded-full"
        style={{ background: badge.bg, color: badge.color, fontFamily: "'Inter', sans-serif" }}
      >
        {badge.label}
      </span>
    ) : (
      <p className="text-sm font-semibold text-gray-800 text-right" style={{ fontFamily: "'Inter', sans-serif" }}>
        {value}
      </p>
    )}
  </div>
);

const InfoCard = ({ title = 'Info Terkait', children }) => (
  <div
    className="bg-white rounded-2xl px-4 mx-4 mb-4"
    style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}
  >
    <p
      className="text-xs font-semibold text-gray-400 uppercase tracking-wide pt-4 pb-2"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {title}
    </p>
    <div style={{ borderTop: '1px solid #f3f4f6' }}>
      {children}
    </div>
  </div>
);

const BodyCard = ({ children }) => (
  <div
    className="bg-white rounded-2xl px-4 py-4 mx-4 mb-4"
    style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}
  >
    {children}
  </div>
);

// ── Detail per tipe ──────────────────────────────────────────────────────────

const DetailPesanan = ({ notif }) => {
  const hero = pesananHero[notif.status] || pesananHero.Baru;
  const badge = statusBadge[notif.status] || statusBadge.Baru;

  const bodyText = {
    Baru: `Order baru telah masuk dari pelanggan ${notif.customerName}.`,
    Diterima: `Status pesanan ${notif.orderNumber} milik ${notif.customerName} telah berubah menjadi Diproses. Pastikan pesanan selesai tepat waktu!`,
    Selesai: `Pesanan ${notif.orderNumber} milik ${notif.customerName} telah selesai dan diterima oleh pelanggan. Dana dari pesanan ini telah masuk ke saldo tenant kamu. Terima kasih telah memberikan pelayanan terbaik! 🎉`,
    Dibatalkan: `Pesanan ${notif.orderNumber} dari pelanggan ${notif.customerName} telah dibatalkan. Mohon pastikan stok selalu diperbarui di menu kamu.`,
  }[notif.status] || '';

  return (
    <>
      <Hero
        bg={hero.bg}
        color={hero.color}
        Icon={hero.Icon}
        title={hero.title}
        timeAgo={notif.timeAgo}
        time={notif.time}
      />

      <BodyCard>
        <p className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
          {bodyText}
        </p>
        {notif.items && notif.status === 'Baru' && (
          <div className="mt-3">
            <p className="text-xs font-semibold text-gray-400 mb-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>
              Pesanan:
            </p>
            <div className="flex flex-col gap-1">
              {String(notif.items).split(',').map((item, i) => (
                <p key={i} className="text-sm text-gray-700" style={{ fontFamily: "'Inter', sans-serif" }}>
                  • {item.trim()}
                </p>
              ))}
            </div>
            {notif.payment && notif.payment !== '-' && (
              <p className="text-xs text-gray-400 mt-2.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                Metode Pembayaran: <span className="font-semibold text-gray-600">{notif.payment}</span>
              </p>
            )}
          </div>
        )}
      </BodyCard>

      <InfoCard>
        <InfoRow label="ID Pesanan" value={notif.orderNumber} />
        <InfoRow label="Pelanggan" value={notif.customerName} />
        <InfoRow label="Status" badge={badge} />
        {notif.total != null && (
          <InfoRow label="Total" value={formatRupiah(notif.total)} />
        )}
      </InfoCard>
    </>
  );
};

const DetailPencairan = ({ notif }) => {
  // Warna hero menyesuaikan jenis pergerakan (ditolak = merah, lainnya = hijau).
  const ditolak = /tolak|ditolak|gagal/i.test(notif.title || '');
  const color = ditolak ? '#dc2626' : '#16a34a';
  const bg = ditolak ? '#fef2f2' : '#f0fdf4';
  return (
    <>
      <Hero
        bg={bg}
        color={color}
        Icon={IconMoney}
        title={notif.title || 'Pencairan Dana'}
        timeAgo={notif.timeAgo}
        time={notif.time}
      />

      <BodyCard>
        {notif.amount > 0 && (
          <p className="text-2xl font-bold text-center" style={{ color, fontFamily: "'Poppins', sans-serif" }}>
            {formatRupiah(notif.amount)}
          </p>
        )}
        {notif.description && (
          <p className="text-sm text-gray-500 text-center mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            {notif.description}
          </p>
        )}
      </BodyCard>

      <InfoCard>
        {notif.amount > 0 && <InfoRow label="Nominal" value={formatRupiah(notif.amount)} />}
        <InfoRow label="Waktu" value={`${notif.timeAgo} · ${notif.time}`} />
      </InfoCard>
    </>
  );
};

const DetailUlasan = ({ notif }) => (
  <>
    <Hero
      bg="#fefce8"
      color="#f59e0b"
      Icon={IconStar}
      title="Ulasan Pelanggan"
      timeAgo={notif.timeAgo}
      time={notif.time}
    />

    <BodyCard>
      <p className="text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
        {notif.customerName}
      </p>
      <div className="flex gap-1 mb-3">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} style={{ fontSize: 24, color: i < notif.rating ? '#f59e0b' : '#e5e7eb' }}>★</span>
        ))}
      </div>
      {notif.review && (
        <div
          className="rounded-xl px-4 py-3"
          style={{ background: '#f9fafb', borderLeft: '3px solid #f59e0b' }}
        >
          <p className="text-sm text-gray-600 italic leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
            "{notif.review}"
          </p>
        </div>
      )}
    </BodyCard>

    <InfoCard>
      <InfoRow label="Pelanggan" value={notif.customerName} />
      <InfoRow label="Rating" value={`${notif.rating} / 5`} />
      <InfoRow label="Waktu" value={`${notif.timeAgo} · ${notif.time}`} />
    </InfoCard>
  </>
);

const DetailPengumuman = ({ notif }) => (
  <>
    <Hero
      bg="#f3f4f6"
      color="#374151"
      Icon={IconBell}
      title={notif.title || 'Pengumuman'}
      timeAgo={notif.timeAgo}
      time={notif.time}
    />

    <BodyCard>
      <p className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
        {notif.description}
      </p>
    </BodyCard>

    <InfoCard>
      <InfoRow label="Waktu" value={`${notif.timeAgo} · ${notif.time}`} />
    </InfoCard>
  </>
);

const DetailPengingat = ({ notif }) => (
  <>
    <Hero
      bg="#fffbeb"
      color="#d97706"
      Icon={IconWarn}
      title={notif.title || 'Pengingat Stok'}
      timeAgo={notif.timeAgo}
      time={notif.time}
    />

    <BodyCard>
      <p className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
        {notif.description}
      </p>
    </BodyCard>

    <InfoCard>
      <InfoRow label="Waktu" value={`${notif.timeAgo} · ${notif.time}`} />
    </InfoCard>
  </>
);

const DetailPenting = ({ notif }) => (
  <>
    <Hero
      bg="#fef2f2"
      color="#dc2626"
      Icon={IconAlert}
      title={notif.title || 'Pesan Penting'}
      timeAgo={notif.timeAgo}
      time={notif.time}
    />

    <BodyCard>
      <p className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
        {notif.description}
      </p>
    </BodyCard>

    <InfoCard>
      <InfoRow label="Dari" value="Admin" />
      <InfoRow label="Waktu" value={`${notif.timeAgo} · ${notif.time}`} />
    </InfoCard>
  </>
);

// ── Main ─────────────────────────────────────────────────────────────────────

const detailMap = {
  Pesanan:    DetailPesanan,
  Pencairan:  DetailPencairan,
  Ulasan:     DetailUlasan,
  Pengumuman: DetailPengumuman,
  Pengingat:  DetailPengingat,
  Penting:    DetailPenting,
};

const NotifikasiDetail = ({ notif, onBack }) => {
  const Detail = detailMap[notif.type] || DetailPengumuman;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f5f5f5' }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 pt-5 pb-4"
        style={{ background: 'linear-gradient(135deg, #1D3A27 0%, #244830 100%)' }}
      >
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{ background: 'rgba(255,255,255,0.12)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12l6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <p className="text-white font-bold text-base" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Detail Notifikasi
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 py-2">
        <Detail notif={notif} />
      </div>
    </div>
  );
};

export default NotifikasiDetail;