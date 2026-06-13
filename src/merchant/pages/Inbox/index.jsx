import { useState } from 'react';
import NotifikasiHeader from './components/NotifikasiHeader';
import NotifikasiTabs from './components/NotifikasiTabs';
import NotifikasiCard from './components/NotifikasiCard';
import BottomNavbar from '../../components/BottomNavbar';

// =============================================
// Dummy data — type harus match dengan tabs:
// 'Pesanan' | 'Pencairan' | 'Ulasan' | 'Pengumuman' | 'Pengingat'
// =============================================
const notifikasiData = [
  // --- PESANAN ---
  {
    id: 1,
    type: 'Pesanan',
    status: 'Baru',
    orderNumber: '#ORD-0041',
    customerName: 'Mutiara',
    items: 'Thai Tea Original x2, Thai Tea Oreo x1',
    time: '09:12',
    timeAgo: 'Baru saja',
    read: false,
  },
  {
    id: 2,
    type: 'Pesanan',
    status: 'Diterima',
    orderNumber: '#ORD-0039',
    customerName: 'Citra Dewi',
    items: 'Thai Tea Jumbo x1',
    time: '08:58',
    timeAgo: '43 menit lalu',
    read: false,
  },
  {
    id: 3,
    type: 'Pesanan',
    status: 'Selesai',
    orderNumber: '#ORD-0037',
    customerName: 'Budi Santoso',
    items: 'Thai Tea Original x2',
    time: '08:45',
    timeAgo: '56 menit lalu',
    read: true,
  },

  // --- PENCAIRAN ---
  {
    id: 4,
    type: 'Pencairan',
    amount: 1247500,
    description: 'Saldo berhasil ditransfer ke rekening BCA **** 4521',
    time: '08:00',
    timeAgo: '1 jam lalu',
    read: false,
  },
  {
    id: 5,
    type: 'Pencairan',
    amount: 875000,
    description: 'Saldo berhasil ditransfer ke rekening BCA **** 4521',
    time: '07:00',
    timeAgo: 'Kemarin',
    read: true,
  },

  // --- ULASAN ---
  {
    id: 6,
    type: 'Ulasan',
    customerName: 'Andi Wijaya',
    rating: 5,
    review: 'Thai Tea-nya enak banget, manis pas dan susunya creamy. Pasti balik lagi!',
    time: '08:30',
    timeAgo: '1 jam lalu',
    read: false,
  },
  {
    id: 7,
    type: 'Ulasan',
    customerName: 'Rina Dewi',
    rating: 4,
    review: 'Rasanya enak, tapi packaging-nya agak bocor. Overall recommended.',
    time: '07:45',
    timeAgo: '2 jam lalu',
    read: true,
  },

  // --- PENGUMUMAN (dari admin Teras LA) ---
  {
    id: 8,
    type: 'Pengumuman',
    title: 'Pemeliharaan Sistem Teras LA',
    description: 'Sistem akan dalam pemeliharaan pada Minggu, 15 Juni 2025 pukul 02.00–04.00 WIB. Pesanan tidak dapat masuk selama periode ini.',
    time: '07:00',
    timeAgo: '2 jam lalu',
    read: false,
  },
  {
    id: 9,
    type: 'Pengumuman',
    title: 'Promo Ramadan — Komisi 0%',
    description: 'Selama bulan Ramadan, komisi transaksi diturunkan menjadi 0% untuk semua tenant. Periode: 1–30 Maret 2025.',
    time: '06:00',
    timeAgo: 'Kemarin',
    read: true,
  },

  // --- PENGINGAT (sistem otomatis) ---
  {
    id: 10,
    type: 'Pengingat',
    title: 'Stok Thai Tea Original Hampir Habis',
    description: 'Sisa stok: 3 porsi. Segera perbarui stok agar pesanan tidak tertolak otomatis.',
    time: '08:20',
    timeAgo: '1 jam lalu',
    read: false,
  },
  {
    id: 11,
    type: 'Pengingat',
    title: 'Jam Operasional Belum Diatur',
    description: 'Kamu belum mengatur jam buka untuk hari Sabtu. Pelanggan tidak dapat memesan di luar jam operasional.',
    time: '07:30',
    timeAgo: '2 jam lalu',
    read: true,
  },
];

const InboxPage = () => {
  const [notifikasi, setNotifikasi] = useState(notifikasiData);
  const [activeTab, setActiveTab] = useState('Semua');
  // 'Semua' | 'Pesanan' | 'Pencairan' | 'Ulasan' | 'Pengumuman' | 'Pengingat'
  // activePanel dipakai untuk tombol 📢 dan 🔔 di header
  const [activePanel, setActivePanel] = useState(null);

  const markAsRead = (id) => {
    setNotifikasi((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Klik tombol 📢 → filter tab ke 'Pengumuman', toggle jika diklik lagi
  const handleClickPengumuman = () => {
    const next = activePanel === 'Pengumuman' ? null : 'Pengumuman';
    setActivePanel(next);
    setActiveTab(next ?? 'Semua');
  };

  // Klik tombol 🔔 → filter tab ke 'Pengingat', toggle jika diklik lagi
  const handleClickPengingat = () => {
    const next = activePanel === 'Pengingat' ? null : 'Pengingat';
    setActivePanel(next);
    setActiveTab(next ?? 'Semua');
  };

  // Saat tab berubah dari NotifikasiTabs, reset activePanel
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActivePanel(null);
  };

  const filteredNotifikasi = notifikasi.filter((n) =>
    activeTab === 'Semua' ? true : n.type === activeTab
  );

  const pesanBelumDibaca = notifikasi.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col pb-20" style={{ background: '#f5f5f5' }}>
      <NotifikasiHeader
        tokoName="Thai Tea Bossku"
        lokasi="Blok E8 · Minuman"
        pesanBelumDibaca={pesanBelumDibaca}
        countPengumuman={notifikasi.filter((n) => n.type === 'Pengumuman' && !n.read).length}
        countPengingat={notifikasi.filter((n) => n.type === 'Pengingat' && !n.read).length}
        onClickPengumuman={handleClickPengumuman}
        onClickPengingat={handleClickPengingat}
        activePanel={activePanel}
      />

      <div className="flex-1 px-4 pt-4 flex flex-col gap-3">
        <NotifikasiTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          counts={{
            Pesanan:    notifikasi.filter((n) => n.type === 'Pesanan'    && !n.read).length,
            Pencairan:  notifikasi.filter((n) => n.type === 'Pencairan'  && !n.read).length,
            Ulasan:     notifikasi.filter((n) => n.type === 'Ulasan'     && !n.read).length,
          }}
        />

        <p
          className="text-xs font-semibold text-gray-500 uppercase tracking-wide"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {activeTab === 'Semua' ? 'Inbox Terbaru' : activeTab}
        </p>

        <div className="flex flex-col gap-3">
          {filteredNotifikasi.length === 0 ? (
            <p
              className="text-center text-sm text-gray-400 mt-8"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Tidak ada notifikasi
            </p>
          ) : (
            filteredNotifikasi.map((notif) => (
              <NotifikasiCard
                key={notif.id}
                notif={notif}
                onClick={() => markAsRead(notif.id)}
              />
            ))
          )}
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
};

export default InboxPage;