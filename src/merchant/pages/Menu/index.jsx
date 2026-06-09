import { useState } from 'react';
import MenuHeader from './components/MenuHeader';
import MenuSearch from './components/MenuSearch';
import MenuTabs from './components/MenuTabs';
import MenuCard from './components/MenuCard';
import MenuDetail from './components/MenuDetail';
import MenuAdd from './components/MenuAdd';
import BottomNavbar from '../../components/BottomNavbar';

export const menuData = [
  {
    id: '0001',
    name: 'Thai Tea Original',
    description: 'Teh thai autentik dengan susu kental manis premium, rasa manis pas dan creamy',
    price: 12000,
    image: null,
    available: true,
    stock: 20,
  },
  {
    id: '0002',
    name: 'Thai Tea Oreo',
    description: 'Thai tea original dipadukan dengan oreo crush lembut yang bikin nagih',
    price: 15000,
    image: null,
    available: true,
    stock: 15,
  },
  {
    id: '0003',
    name: 'Thai Green Tea',
    description: 'Teh hijau Thailand asli, segar dan ringan, cocok untuk semua kalangan',
    price: 13000,
    image: null,
    available: true,
    stock: 18,
  },
  {
    id: '0004',
    name: 'Thai Tea Jumbo',
    description: 'Versi jumbo 700ml dari thai tea original favorit, cocok buat yang haus berat',
    price: 16000,
    image: null,
    available: true,
    stock: 10,
  },
  {
    id: '0005',
    name: 'Brown Sugar Thai Tea',
    description: 'Thai tea dengan brown sugar caramel, tren minuman kekinian yang wajib dicoba',
    price: 18000,
    image: null,
    available: false,
    stock: 0,
  },
  {
    id: '0006',
    name: 'Matcha Thai Fusion',
    description: 'Perpaduan unik matcha Jepang dengan thai tea, dua dunia dalam satu gelas',
    price: 18000,
    image: null,
    available: false,
    stock: 0,
  },
];

const MenuPage = () => {
  const [menus, setMenus] = useState(menuData);
  const [activeTab, setActiveTab] = useState('Semua');
  const [search, setSearch] = useState('');
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const toggleAvailable = (id) => {
    setMenus((prev) =>
      prev.map((m) => (m.id === id ? { ...m, available: !m.available } : m))
    );
  };

  const updateMenu = (updatedMenu) => {
    setMenus((prev) =>
      prev.map((m) => (m.id === updatedMenu.id ? updatedMenu : m))
    );
    setSelectedMenu(null);
  };

  const addMenu = (newMenu) => {
    const maxId = menus.reduce((max, m) => Math.max(max, parseInt(m.id)), 0);
    const newId = String(maxId + 1).padStart(4, '0');
    setMenus((prev) => [...prev, { ...newMenu, id: newId }]);
    setShowAdd(false);
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

  if (selectedMenu) {
    return (
      <MenuDetail
        menu={selectedMenu}
        onBack={() => setSelectedMenu(null)}
        onSave={updateMenu}
      />
    );
  }

  if (showAdd) {
    return <MenuAdd onBack={() => setShowAdd(false)} onAdd={addMenu} />;
  }

  return (
    <div className="min-h-screen flex flex-col pb-20" style={{ background: '#f5f5f5' }}>
      <MenuHeader
        tokoName="Thai Tea Bossku"
        lokasi="Blok E8 · Minuman"
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
          {filteredMenus.length === 0 ? (
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
