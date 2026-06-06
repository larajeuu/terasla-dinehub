const statusConfig = {
  Baru:     { label: 'Order Baru', color: '#2563eb', bg: '#eff6ff', icon: '📋' },
  Diterima: { label: 'Diproses',   color: '#d97706', bg: '#fffbeb', icon: '🔄' },
  Selesai:  { label: 'Selesai',    color: '#16a34a', bg: '#f0fdf4', icon: '✅' },
};

const formatRupiah = (amount) => 'Rp ' + amount.toLocaleString('id-ID');

const UnreadDot = () => (
  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#4caf50' }} />
);

const CardBase = ({ iconBg, icon, notif, children }) => (
  <div className="flex items-start gap-3">
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
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
    <CardBase iconBg={s.bg} icon={s.icon} notif={notif}>
      <div className="flex items-center justify-between gap-2 mb-0.5">
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}22` }}
        >
          {s.label}
        </span>
        {!notif.read && <UnreadDot />}
      </div>
      <p className="text-sm font-semibold text-gray-800 truncate">
        {notif.orderNumber} · {notif.customerName}
      </p>
      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{notif.items}</p>
    </CardBase>
  );
};

const CardPencairan = ({ notif }) => (
  <CardBase iconBg="#e8f5e9" icon="💰" notif={notif}>
    <div className="flex items-center justify-between gap-2">
      <p className="text-xs font-medium text-gray-400">Pencairan Dana</p>
      {!notif.read && <UnreadDot />}
    </div>
    <p className="text-base font-bold mt-0.5" style={{ color: '#16a34a' }}>
      {formatRupiah(notif.amount)}
    </p>
    <p className="text-xs text-gray-500 mt-0.5">{notif.description}</p>
  </CardBase>
);

const CardUlasan = ({ notif }) => (
  <CardBase iconBg="#fff3e0" icon="⭐" notif={notif}>
    <div className="flex items-center justify-between gap-2">
      <p className="text-sm font-semibold text-gray-800">{notif.customerName}</p>
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
  <CardBase iconBg="#e3f2fd" icon="📢" notif={notif}>
    <div className="flex items-center justify-between gap-2">
      <p className="text-xs font-medium text-gray-400">Admin Teras LA</p>
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
  <CardBase iconBg="#fff8e1" icon="🔔" notif={notif}>
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

const cardComponents = {
  Pesanan:    CardPesanan,
  Pencairan:  CardPencairan,
  Ulasan:     CardUlasan,
  Pengumuman: CardPengumuman,
  Pengingat:  CardPengingat,
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
