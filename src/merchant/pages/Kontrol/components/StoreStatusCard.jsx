const StoreStatusCard = ({ tokoName, lokasi, isOpen, onToggle }) => {
  return (
    <div
      className="bg-white rounded-2xl p-4"
      style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Info toko + status badge */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-gray-800 truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {tokoName}
          </p>
          {lokasi ? (
            <div className="flex items-center gap-1 mt-0.5">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#9ca3af" strokeWidth="1.8"/>
                <circle cx="12" cy="9" r="2.5" stroke="#9ca3af" strokeWidth="1.8"/>
              </svg>
              <p className="text-xs text-gray-400 truncate" style={{ fontFamily: "'Inter', sans-serif" }}>
                {lokasi}
              </p>
            </div>
          ) : null}
          <div className="flex items-center gap-2 mt-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: isOpen ? '#22c55e' : '#ef4444' }}
            />
            <p
              className="text-xs font-semibold"
              style={{
                color: isOpen ? '#16a34a' : '#dc2626',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {isOpen ? 'Toko sedang buka' : 'Toko sedang tutup'}
            </p>
          </div>
        </div>

        {/* Toggle */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <p className="text-xs font-medium text-gray-500" style={{ fontFamily: "'Inter', sans-serif" }}>
            {isOpen ? 'Buka' : 'Tutup'}
          </p>
          <button
            onClick={onToggle}
            className="relative w-14 h-7 rounded-full transition-all duration-300"
            style={{ background: isOpen ? '#1D3A27' : '#d1d5db' }}
          >
            <div
              className="absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all duration-300"
              style={{ left: isOpen ? '34px' : '4px' }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreStatusCard;