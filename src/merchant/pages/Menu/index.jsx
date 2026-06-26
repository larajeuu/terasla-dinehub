import { useState, useEffect, useCallback } from 'react';
import useAuthStore from '../../../store/authStore';
import { getMerchantById } from '../../../services/merchantService';
import {
  getMerchantMenus,
  toggleMenuAvailability,
  updateMenu,
  createMenu,
  deleteMenu,
} from '../../../services/menuService';
import MenuHeader from './components/MenuHeader';
import MenuSearch from './components/MenuSearch';
import MenuTabs from './components/MenuTabs';
import MenuCard from './components/MenuCard';
import MenuDetail from './components/MenuDetail';
import MenuAdd from './components/MenuAdd';
import BottomNavbar from '../../components/BottomNavbar';

const MenuPage = () => {
  const user = useAuthStore((s) => s.user);

  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [merchantInfo, setMerchantInfo] = useState({ block: '', category: '' });
  const [activeTab, setActiveTab] = useState('Semua');
  const [search, setSearch] = useState('');
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const fetchMenus = useCallback(async () => {
    if (!user?.merchantId) return;
    try {
      const data = await getMerchantMenus(user.merchantId);
      setMenus(data);
    } catch (err) {
      console.error('Gagal memuat menu:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.merchantId]);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  useEffect(() => {
    if (!user?.merchantId) return;
    getMerchantById(user.merchantId)
      .then((m) => setMerchantInfo({ block: m.block || '', category: m.category || '' }))
      .catch(() => {});
  }, [user?.merchantId]);

  const toggleAvailable = async (id) => {
    const menu = menus.find((m) => m.id === id);
    if (!menu) return;
    const newAvailable = !menu.available;
    // Optimistic update
    setMenus((prev) => prev.map((m) => (m.id === id ? { ...m, available: newAvailable } : m)));
    try {
      await toggleMenuAvailability(id, newAvailable, menu);
    } catch (err) {
      console.error('Gagal update ketersediaan:', err);
      // Rollback
      setMenus((prev) => prev.map((m) => (m.id === id ? { ...m, available: menu.available } : m)));
    }
  };

  const handleUpdateMenu = async (updatedData) => {
    const updated = await updateMenu(updatedData.id, updatedData);
    setMenus((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    setSelectedMenu(null);
  };

  const handleAddMenu = async (newData) => {
    const created = await createMenu(user.merchantId, newData);
    setMenus((prev) => [...prev, created]);
    setShowAdd(false);
  };

  // Hapus produk. Dibiarkan throw agar MenuDetail bisa menampilkan pesan
  // larangan (mis. produk sudah dipakai transaksi → sarankan nonaktifkan).
  const handleDeleteMenu = async (id) => {
    await deleteMenu(id);
    setMenus((prev) => prev.filter((m) => m.id !== id));
    setSelectedMenu(null);
  };

  const filteredMenus = menus
    .filter((m) => {
      if (activeTab === 'Tersedia') return m.available;
      if (activeTab === 'Habis') return !m.available;
      return true;
    })
    .filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));

  const countTersedia = menus.filter((m) => m.available).length;
  const countHabis = menus.filter((m) => !m.available).length;

  const tokoName = user?.name || 'Merchant';
  const lokasi = [merchantInfo.block, merchantInfo.category].filter(Boolean).join(' · ');

  if (selectedMenu) {
    return (
      <MenuDetail
        menu={selectedMenu}
        onBack={() => setSelectedMenu(null)}
        onSave={handleUpdateMenu}
        onDelete={handleDeleteMenu}
      />
    );
  }

  if (showAdd) {
    return <MenuAdd onBack={() => setShowAdd(false)} onAdd={handleAddMenu} />;
  }

  return (
    <div className="min-h-screen flex flex-col pb-20" style={{ background: '#f5f5f5' }}>
      <MenuHeader
        tokoName={tokoName}
        lokasi={lokasi}
        totalProduk={menus.length}
        totalTersedia={countTersedia}
      />

      <div className="flex-1 px-4 pt-4 flex flex-col gap-3">
        <MenuSearch search={search} onSearch={setSearch} />
        <MenuTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={{ Tersedia: countTersedia, Habis: countHabis }}
        />

        <div className="flex flex-col gap-3">
          {loading ? (
            <p className="text-center text-sm text-gray-400 mt-8" style={{ fontFamily: "'Inter', sans-serif" }}>
              Memuat menu...
            </p>
          ) : filteredMenus.length === 0 ? (
            <p className="text-center text-sm text-gray-400 mt-8" style={{ fontFamily: "'Inter', sans-serif" }}>
              Tidak ada produk
            </p>
          ) : (
            filteredMenus.map((menu) => (
              <MenuCard
                key={menu.id}
                menu={menu}
                onClick={() => setSelectedMenu(menu)}
                onToggle={() => toggleAvailable(menu.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Floating button tambah menu */}
      <button
        onClick={() => setShowAdd(true)}
        className="fixed bottom-20 right-4 flex items-center gap-2 px-4 py-3 rounded-2xl text-white font-semibold text-sm transition-all active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #1D3A27 0%, #244830 100%)',
          boxShadow: '0 4px 16px rgba(29,58,39,0.35)',
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
        Tambah Menu
      </button>

      <BottomNavbar />
    </div>
  );
};

export default MenuPage;
