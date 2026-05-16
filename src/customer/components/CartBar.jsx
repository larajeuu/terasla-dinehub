import { useNavigate } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import { formatRupiah } from '../../shared/utils/format';
import { CartIcon } from '../../shared/components/icons';

const CartBar = () => {
  const navigate = useNavigate();
  const totalItems = useCartStore((s) => s.getTotalItems());
  const totalPrice = useCartStore((s) => s.getTotalPrice());

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 pointer-events-none">
      {/* Gradient fade behind bar for clarity over content */}
      <div
        className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(249,250,251,0.95) 30%, rgba(249,250,251,0))',
        }}
      />

      <button
        onClick={() => navigate('/cart')}
        className="pointer-events-auto relative w-full flex items-center justify-between pl-2 pr-4 py-2 rounded-2xl text-white transition-all active:scale-[0.97] hover:brightness-110"
        style={{
          background: 'linear-gradient(135deg, #2d5a3d 0%, #1D3A27 50%, #15291c 100%)',
          boxShadow:
            '0 10px 28px -8px rgba(29,58,39,0.45), 0 4px 12px -2px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.12)',
        }}
      >
        {/* Left: Cart icon + count + label */}
        <div className="flex items-center gap-3">
          <div
            className="relative w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: 'linear-gradient(135deg, #d6a425 0%, #C8961A 100%)',
              boxShadow: '0 4px 10px -2px rgba(200,150,26,0.45), inset 0 1px 0 rgba(255,255,255,0.25)',
            }}
          >
            <CartIcon size={20} color="white" />
            <span
              className="absolute -top-1 -right-1 text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center"
              style={{
                width: 18,
                height: 18,
                background: 'white',
                color: '#1D3A27',
                boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
              }}
            >
              {totalItems > 9 ? '9+' : totalItems}
            </span>
          </div>
          <div className="text-left">
            <p
              className="text-[11px] leading-none opacity-70 mb-1"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {totalItems} item · siap dipesan
            </p>
            <p
              className="text-sm font-bold leading-none"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Pesan Sekarang
            </p>
          </div>
        </div>

        {/* Right: total price + arrow */}
        <div className="flex items-center gap-2">
          <span
            className="text-base font-bold tabular-nums"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {formatRupiah(totalPrice)}
          </span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>
    </div>
  );
};

export default CartBar;
