const tabs = ['Semua', 'Tersedia', 'Habis'];

const tabColors = {
  Semua: { bg: '#1D3A27', border: '#1D3A27' },
  Tersedia: { bg: '#16a34a', border: '#16a34a' },
  Habis: { bg: '#dc2626', border: '#dc2626' },
};

const MenuTabs = ({ activeTab, onTabChange, counts }) => {
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

export default MenuTabs;