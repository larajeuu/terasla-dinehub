import { useState } from 'react';
import NotifikasiHeader from './components/NotifikasiHeader';
import NotifikasiTabs from './components/NotifikasiTabs';
import NotifikasiCard from './components/NotifikasiCard';
import BottomNavbar from '../../components/BottomNavbar';

const notifikasiData = [
  {
    id: 1,
    type: 'Order Baru',
    title: 'Order Baru Masuk!',
    description: 'Mutiara, #ORD-0041, Thai Tea Original x2, Thai Tea Oreo x1',
    time: '09:12',
    timeAgo: 'Baru saja',
    read: false,
  },
  {
    id: 2,
    type: 'Status',
    title: 'Perubahan Status Order',
    description: '#ORD-0039 telah berubah dari Baru.. Diproses oleh sistem',
    time: '08:58',
    timeAgo: '43 menit lalu',
    read: false,
  },
  {
    id: 3,
    type: 'Pembatalan',
    title: 'Pembatalan Order oleh Tenant',
    description: 'Mutiara, #ORD-0035 dibatalkan, Citra Dewi, Thai Tea Jumbo x1',
    time: '08:15',
    timeAgo: '1 jam lalu',
    read: false,
  },
  {
    id: 4,
    type: 'Status',
    title: 'Order Selesai oleh Customer',
    description: '#ORD-0037 telah selesai, Budi Santoso Thai Tea Original x2',
    time: '08:45',
    timeAgo: '56 menit lalu',
    read: false,
  },
  {
    id: 5,
    type: 'Status',
    title: 'Order Selesai oleh Customer',
    description: '#ORD-0030 telah selesai, Andi Nadi Thai Tea Original x1',
    time: '08:10',
    timeAgo: '1 jam lalu',
    read: true,
  },
  {
    id: 6,
    type: 'Status',
    title: 'Order Selesai oleh Customer',
    description: '#ORD-0026 telah selesai, Joko Anwar Thai Tea Original x1',
    time: '07:55',
    timeAgo: '1 jam lalu',
    read: true,
  },
];

const InboxPage = () => {
  const [notifikasi, setNotifikasi] = useState(notifikasiData);
  const [activeTab, setActiveTab] = useState('Semua');

  const markAsRead = (id) => {
    setNotifikasi((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
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
      />

      <div className="flex-1 px-4 pt-4 flex flex-col gap-3">
        <NotifikasiTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={{
            'Order Baru': notifikasi.filter((n) => n.type === 'Order Baru' && !n.read).length,
            Status: notifikasi.filter((n) => n.type === 'Status' && !n.read).length,
            Pembatalan: notifikasi.filter((n) => n.type === 'Pembatalan' && !n.read).length,
          }}
        />

        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
          Inbox Terbaru
        </p>

        <div className="flex flex-col gap-3">
          {filteredNotifikasi.map((notif) => (
            <NotifikasiCard
              key={notif.id}
              notif={notif}
              onRead={() => markAsRead(notif.id)}
            />
          ))}
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
};

export default InboxPage;