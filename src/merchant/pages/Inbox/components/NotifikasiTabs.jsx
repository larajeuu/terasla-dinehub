const tabs = ['Semua', 'Pesanan', 'Pencairan', 'Ulasan'];

const tabColors = {
  Semua:     { bg: '#1D3A27', border: '#1D3A27' },
  Pesanan:   { bg: '#7c3aed', border: '#7c3aed' },
  Pencairan: { bg: '#16a34a', border: '#16a34a' },
  Ulasan:    { bg: '#d97706', border: '#d97706' },
};

const NotifikasiTabs = ({ activeTab, onTabChange, counts }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        const count = counts[tab];
        const color = tabColors[tab];

        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className="shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            style={{
              background: isActive ? color.bg : 'white',
              color: isActive ? 'white' : color.bg,
              border: `1px solid ${isActive ? color.border : '#e5e7eb'}`,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {tab}{count ? ` (${count})` : ''}
          </button>
        );
      })}
    </div>
  );
};

export default NotifikasiTabs;
