import { useSearchParams } from 'react-router-dom';
import useCartStore from '../../../../store/cartStore';

const CartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HomeHeader = () => {
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get('meja') || '1';
  const totalItems = useCartStore((s) => s.getTotalItems());

  return (
    <header
      className="flex items-center justify-between px-4 py-3 sticky top-0 z-40"
      style={{ background: '#1D3A27' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: '#C8961A' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M3 9.5L12 3L21 9.5V21H15V15H9V21H3V9.5Z" fill="white" />
          </svg>
        </div>
        <div>
          <div
            className="font-bold text-white text-sm leading-none"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Teras LA
          </div>
          <div className="text-xs leading-none mt-0.5" style={{ color: '#C8961A', fontFamily: "'Poppins', sans-serif" }}>
            LENTENG AGUNG
          </div>
        </div>
      </div>

      {/* Table number */}
      <div
        className="text-xs font-semibold px-3 py-1 rounded-full"
        style={{
          background: 'rgba(255,255,255,0.12)',
          color: 'rgba(255,255,255,0.85)',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        No. Meja {tableNumber}
      </div>
    </header>
  );
};

export default HomeHeader;
