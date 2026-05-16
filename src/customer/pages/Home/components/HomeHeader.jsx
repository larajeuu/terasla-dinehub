import { useSearchParams } from 'react-router-dom';
import useCartStore from '../../../../store/cartStore';
import { TableIcon } from '../../../../shared/components/icons';

const HomeHeader = () => {
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get('meja') || '1';
  const totalItems = useCartStore((s) => s.getTotalItems());

  return (
    <header
      className="flex items-center justify-between px-4 py-3 sticky top-0 z-40 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1D3A27 0%, #244830 50%, #1D3A27 100%)',
      }}
    >
      {/* Soft background accent */}
      <div
        className="absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-15 pointer-events-none"
        style={{ background: '#C8961A', filter: 'blur(30px)' }}
      />

      {/* Logo */}
      <div className="relative flex items-center gap-2 z-10">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{
            background: 'linear-gradient(135deg, #d6a425 0%, #C8961A 100%)',
            boxShadow: '0 2px 8px -1px rgba(200,150,26,0.5)',
          }}
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
          <div
            className="text-[10px] leading-none mt-0.5 tracking-widest"
            style={{ color: '#C8961A', fontFamily: "'Poppins', sans-serif" }}
          >
            LENTENG AGUNG
          </div>
        </div>
      </div>

      {/* No. Meja — white pill for high contrast on dark header */}
      <div
        className="relative inline-flex items-center gap-2 pl-1.5 pr-3.5 py-1.5 rounded-full z-10"
        style={{
          background: '#ffffff',
          boxShadow: '0 4px 12px -2px rgba(0,0,0,0.25), 0 0 0 1px rgba(200,150,26,0.35)',
        }}
      >
        {/* Icon badge */}
        <span
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
          style={{
            background: 'linear-gradient(135deg, #d6a425 0%, #C8961A 100%)',
            boxShadow: '0 2px 6px rgba(200,150,26,0.55), inset 0 1px 0 rgba(255,255,255,0.35)',
          }}
        >
          <TableIcon size={14} color="white" />
        </span>
        <div className="text-left leading-none">
          <span
            className="block text-[9px] font-semibold tracking-[0.15em] uppercase"
            style={{ color: '#9ca3af', fontFamily: "'Poppins', sans-serif" }}
          >
            Meja
          </span>
          <span
            className="block text-base font-extrabold mt-0.5 tabular-nums"
            style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif", lineHeight: 1 }}
          >
            {tableNumber}
          </span>
        </div>
      </div>

      {/* Right: indicator dot (matches gold accent if cart has items) */}
      <div className="relative z-10 w-8 flex justify-end">
        {totalItems > 0 && (
          <span
            className="block w-2 h-2 rounded-full animate-pulse"
            style={{ background: '#C8961A', boxShadow: '0 0 8px rgba(200,150,26,0.7)' }}
          />
        )}
      </div>
    </header>
  );
};

export default HomeHeader;
