import { useState, useEffect } from 'react';
import useAuthStore from '../../../store/authStore';
import { getMerchantById } from '../../../services/merchantService';
import { fetchAllNotifications } from '../../../services/notificationService';
import NotifikasiHeader from './components/NotifikasiHeader';
import NotifikasiTabs from './components/NotifikasiTabs';
import NotifikasiCard from './components/NotifikasiCard';
import NotifikasiDetail from './components/NotifikasiDetail';
import BottomNavbar from '../../components/BottomNavbar';

// Status baca disimpan di localStorage agar tetap tersimpan saat halaman di-refresh
const READ_KEY = 'inbox_read_ids';

const getReadIds = () => {
  try { return new Set(JSON.parse(localStorage.getItem(READ_KEY)) || []); }
  catch { return new Set(); }
};

const persistRead = (id) => {
  const ids = getReadIds();
  ids.add(String(id));
  localStorage.setItem(READ_KEY, JSON.stringify([...ids]));
};

const InboxPage = () => {
  const user = useAuthStore((s) => s.user);

  const [notifikasi, setNotifikasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [merchantInfo, setMerchantInfo] = useState({ block: '', category: '' });
  const [activeTab, setActiveTab] = useState('Semua');
  const [selectedNotif, setSelectedNotif] = useState(null);

  useEffect(() => {
    if (!user?.merchantId) return;
    let cancelled = false;
    const load = async () => {
      try {
        const readIds = getReadIds();
        const data = await fetchAllNotifications(user.merchantId);
        if (!cancelled) setNotifikasi(data.map((n) => ({ ...n, read: readIds.has(String(n.id)) })));
      } catch (err) {
        console.error('Gagal memuat notifikasi:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [user?.merchantId]);

  useEffect(() => {
    if (!user?.merchantId) return;
    getMerchantById(user.merchantId)
      .then((m) => setMerchantInfo({ block: m.block || '', category: m.category || '' }))
      .catch(() => {});
  }, [user?.merchantId]);

  const markAsRead = (id) => {
    persistRead(id);
    setNotifikasi((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleCardClick = (notif) => {
    markAsRead(notif.id);
    setSelectedNotif(notif);
  };

  const handleTabChange = (tab) => setActiveTab(tab);

  const filteredNotifikasi = notifikasi.filter((n) =>
    activeTab === 'Semua' ? true : n.type === activeTab
  );

  const count = (type, unreadOnly = false) =>
    notifikasi.filter((n) => n.type === type && (!unreadOnly || !n.read)).length;

  const tokoName = user?.name || 'Merchant';
  const lokasi = [merchantInfo.block, merchantInfo.category].filter(Boolean).join(' · ');

  if (selectedNotif) {
    return (
      <NotifikasiDetail
        notif={selectedNotif}
        onBack={() => setSelectedNotif(null)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-20" style={{ background: '#f5f5f5' }}>
      <NotifikasiHeader
        tokoName={tokoName}
        lokasi={lokasi}
        pesanBelumDibaca={notifikasi.filter((n) => !n.read).length}
      />

      <div className="flex-1 px-4 pt-4 flex flex-col gap-3">
        <NotifikasiTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          counts={{
            Penting:    count('Penting',    true),
            Pesanan:    count('Pesanan',    true),
            Pencairan:  count('Pencairan',  true),
            Ulasan:     count('Ulasan',     true),
            Pengumuman: count('Pengumuman', true),
            Pengingat:  count('Pengingat',  true),
          }}
        />

        <p
          className="text-xs font-semibold text-gray-500 uppercase tracking-wide"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {activeTab === 'Semua' ? 'Inbox Terbaru' : activeTab}
        </p>

        <div className="flex flex-col gap-3">
          {loading ? (
            <p className="text-center text-sm text-gray-400 mt-8" style={{ fontFamily: "'Inter', sans-serif" }}>
              Memuat notifikasi...
            </p>
          ) : filteredNotifikasi.length === 0 ? (
            <p className="text-center text-sm text-gray-400 mt-8" style={{ fontFamily: "'Inter', sans-serif" }}>
              Tidak ada notifikasi
            </p>
          ) : (
            filteredNotifikasi.map((notif) => (
              <NotifikasiCard
                key={notif.id}
                notif={notif}
                onClick={() => handleCardClick(notif)}
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