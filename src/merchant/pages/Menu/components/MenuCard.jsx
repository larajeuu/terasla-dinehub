import { formatRupiah } from '../../../../shared/utils/format';

const MenuCard = ({ menu, onClick, onToggle }) => {
  return (
    <div
      className="bg-white rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition-all"
      style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}
      onClick={onClick}
    >
      {/* Foto produk */}
      <div
        className="w-16 h-16 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
        style={{ background: '#f3f4f6' }}
      >
        {menu.image ? (
          <img src={menu.image} alt={menu.name} className="w-full h-full object-cover" />
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="#d1d5db" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="13" r="4" stroke="#d1d5db" strokeWidth="1.8"/>
          </svg>
        )}
      </div>

      {/* Info produk */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-gray-800 truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {menu.name}
        </p>
        <p className="text-xs text-gray-400 truncate mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
          {menu.description}
        </p>
        <p className="text-sm font-bold mt-1" style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}>
          {formatRupiah(menu.price)}
        </p>
        <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
          Stok: {menu.stock} porsi
        </p>
      </div>

      {/* Toggle + status */}
      <div className="flex flex-col items-center gap-1.5 shrink-0">
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{
            background: menu.available ? '#f0fdf4' : '#fef2f2',
            color: menu.available ? '#16a34a' : '#dc2626',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {menu.available ? 'Tersedia' : 'Habis'}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className="relative w-11 h-6 rounded-full transition-all"
          style={{ background: menu.available ? '#1D3A27' : '#d1d5db' }}
        >
          <div
            className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
            style={{ left: menu.available ? '22px' : '2px' }}
          />
        </button>
      </div>
    </div>
  );
};

export default MenuCard;