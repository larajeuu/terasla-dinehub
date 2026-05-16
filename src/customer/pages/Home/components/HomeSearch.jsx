const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="8" stroke="#9ca3af" strokeWidth="2" />
    <path d="M21 21l-4.35-4.35" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const HomeSearch = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2 px-4 mt-4">
      {/* Search input */}
      <div className="flex-1 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2">
          <SearchIcon />
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Cari produk atau tenant..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
          style={{
            background: '#f3f4f6',
            fontFamily: "'Inter', sans-serif",
            color: '#111827',
          }}
        />
      </div>
    </div>
  );
};

export default HomeSearch;
