const MenuSearch = ({ search, onSearch }) => {
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white"
        style={{ border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="#9ca3af" strokeWidth="1.8"/>
          <path d="M21 21l-4.35-4.35" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <input
          type="text"
          placeholder="Cari nama produk..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="flex-1 text-sm outline-none bg-transparent"
          style={{ fontFamily: "'Inter', sans-serif", color: '#374151' }}
        />
      </div>

      <button
        className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white"
        style={{ border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
};

export default MenuSearch;