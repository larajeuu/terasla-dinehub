const IC = '#374151';
const ICON_BG = '#f3f4f6';

const IconPesanan = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={IC} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
    <path d="M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
    <line x1="9" y1="12" x2="15" y2="12"/>
    <line x1="9" y1="16" x2="13" y2="16"/>
  </svg>
);

const IconPencairan = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={IC} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
);

const IconUlasan = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={IC} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const IconBell = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={IC} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
);

const IconPenting = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={IC} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const statusConfig = {
  Baru:     { label: 'Order Baru', color: '#2563eb', bg: '#eff6ff' },
  Diterima: { label: 'Diproses',   color: '#d97706', bg: '#fffbeb' },
  Selesai:  { label: 'Selesai',    color: '#16a34a', bg: '#f0fdf4' },
};

const formatRupiah = (amount) => 'Rp ' + amount.toLocaleString('id-ID');

const UnreadDot = () => (
  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: '#4caf50' }} />
);

const CardBase = ({ icon, notif, children, iconBg = ICON_BG }) => (
  <div className="flex items-start gap-3">
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
      style={{ background: iconBg }}
    >
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      {children}
      <p className="text-xs text-gray-400 mt-1">{notif.timeAgo} · {notif.time}</p>
    </div>
  </div>
);

const CardPesanan = ({ notif }) => {
  const s = statusConfig[notif.status] || statusConfig.Baru;
  return (
    <CardBase icon={<IconPesanan />} notif={notif}>
      <div className="flex items-center justify-between gap-2 mb-0.5">
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}22` }}
        >
          {s.label}
        </span>
        {!notif.read && <UnreadDot />}
      </div>
      <p
        className="text-sm text-gray-800 truncate"
        style={{ fontWeight: notif.read ? 500 : 700 }}
      >
        {notif.orderNumber} · {notif.customerName}
      </p>
      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{notif.items}</p>
    </CardBase>
  );
};

const CardPencairan = ({ notif }) => (
  <CardBase icon={<IconPencairan />} notif={notif}>
    <div className="flex items-center justify-between gap-2">
      <p className="text-xs font-medium text-gray-400">Pencairan Dana</p>
      {!notif.read && <UnreadDot />}
    </div>
    <p
      className="text-base mt-0.5"
      style={{ color: '#16a34a', fontWeight: notif.read ? 600 : 800 }}
    >
      {formatRupiah(notif.amount)}
    </p>
    <p className="text-xs text-gray-500 mt-0.5">{notif.description}</p>
  </CardBase>
);

const CardUlasan = ({ notif }) => (
  <CardBase icon={<IconUlasan />} notif={notif}>
    <div className="flex items-center justify-between gap-2">
      <p
        className="text-sm text-gray-800"
        style={{ fontWeight: notif.read ? 500 : 700 }}
      >
        {notif.customerName}
      </p>
      {!notif.read && <UnreadDot />}
    </div>
    <div className="flex gap-0.5 mt-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < notif.rating ? '#f59e0b' : '#d1d5db', fontSize: 14 }}>★</span>
      ))}
    </div>
    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">"{notif.review}"</p>
  </CardBase>
);

const CardPengumuman = ({ notif }) => (
  <CardBase icon={<IconBell />} notif={notif}>
    <div className="flex items-center justify-between gap-2">
      <p className="text-xs font-medium text-gray-400">Notifikasi</p>
      {!notif.read && <UnreadDot />}
    </div>
    <p
      className="text-sm mt-0.5 text-gray-800 truncate"
      style={{ fontWeight: notif.read ? 500 : 700 }}
    >
      {notif.title}
    </p>
    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.description}</p>
  </CardBase>
);

const CardPengingat = ({ notif }) => (
  <CardBase icon={<IconBell />} notif={notif} iconBg="#fef9c3">
    <div className="flex items-center justify-between gap-2">
      <p className="text-xs font-medium text-gray-400">Pengingat</p>
      {!notif.read && <UnreadDot />}
    </div>
    <p
      className="text-sm mt-0.5 text-gray-800 truncate"
      style={{ fontWeight: notif.read ? 500 : 700 }}
    >
      {notif.title}
    </p>
    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.description}</p>
  </CardBase>
);

const CardPenting = ({ notif }) => (
  <CardBase icon={<IconPenting />} notif={notif} iconBg="#fce7f3">
    <div className="flex items-center justify-between gap-2">
      <p className="text-xs font-medium" style={{ color: '#dc2626' }}>Pesan Penting</p>
      {!notif.read && <UnreadDot />}
    </div>
    <p
      className="text-sm mt-0.5 text-gray-800 truncate"
      style={{ fontWeight: notif.read ? 500 : 700 }}
    >
      {notif.title}
    </p>
    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.description}</p>
  </CardBase>
);

const cardComponents = {
  Pesanan:    CardPesanan,
  Pencairan:  CardPencairan,
  Ulasan:     CardUlasan,
  Pengumuman: CardPengumuman,
  Pengingat:  CardPengingat,
  Penting:    CardPenting,
};

const NotifikasiCard = ({ notif, onClick }) => {
  const CardContent = cardComponents[notif.type] || CardPengumuman;
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl px-4 py-3 cursor-pointer active:bg-gray-50 transition-colors"
      style={{
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <CardContent notif={notif} />
    </div>
  );
};

export default NotifikasiCard;