import { SearchIcon } from '../../shared/components/icons';

const FilterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const SearchBar = ({ value, onChange, placeholder = 'Cari produk atau tenant...', showFilter = false }) => {
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
          placeholder={placeholder}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 transition-shadow"
          style={{
            background: '#f3f4f6',
            fontFamily: "'Inter', sans-serif",
            color: '#111827',
          }}
        />
      </div>

      {/* Filter button */}
      {showFilter && (
        <button
          className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors hover:bg-gray-200"
          style={{ background: '#f3f4f6', color: '#374151' }}
          aria-label="Filter"
        >
          <FilterIcon />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
