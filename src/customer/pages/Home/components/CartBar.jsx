import { useNavigate } from 'react-router-dom';
import useCartStore from '../../../../store/cartStore';

const formatRupiah = (n) => 'Rp ' + n.toLocaleString('id-ID');

const CartBar = () => {
  const navigate = useNavigate();
  const totalItems = useCartStore((s) => s.getTotalItems());
  const totalPrice = useCartStore((s) => s.getTotalPrice());

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 pointer-events-none">
      <button
        onClick={() => navigate('/cart')}
        className="pointer-events-auto w-full flex items-center justify-between px-4 py-3 rounded-2xl text-white shadow-xl transition-transform active:scale-95"
        style={{ background: '#1D3A27' }}
      >
        {/* Left: count badge + label */}
        <div className="flex items-center gap-3">
          <span
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: '#C8961A' }}
          >
            {totalItems}
          </span>
          <span
            className="text-sm font-semibold"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Pesan Sekarang
          </span>
        </div>

        {/* Right: total price */}
        <span
          className="text-sm font-bold"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {formatRupiah(totalPrice)}
        </span>
      </button>
    </div>
  );
};

export default CartBar;
