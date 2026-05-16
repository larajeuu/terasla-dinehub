const TABS = [
  { key: 'produk', label: 'Produk' },
  { key: 'tenant', label: 'Tenant' },
];

const HomeTabNav = ({ activeTab, onTabChange }) => {
  return (
    <div
      className="flex mx-4 mt-4 p-1 rounded-xl gap-1"
      style={{ background: '#f3f4f6' }}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              fontFamily: "'Poppins', sans-serif",
              background: isActive ? '#1D3A27' : 'transparent',
              color: isActive ? '#fff' : '#6b7280',
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default HomeTabNav;
