import { useNavigate } from 'react-router-dom';
import { CartIcon } from '../../../../shared/components/icons';

const EmptyCart = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
        style={{ background: '#F5EDD9' }}
      >
        <CartIcon size={36} color="#1D3A27" />
      </div>
      <h2
        className="text-base font-bold text-gray-900 mb-1"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Keranjang masih kosong
      </h2>
      <p
        className="text-sm text-gray-500 mb-5 max-w-xs"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        Yuk pilih menu favoritmu dulu, baru lanjut pesan.
      </p>
      <button
        onClick={() => navigate('/')}
        className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 hover:brightness-110"
        style={{
          background: 'linear-gradient(135deg, #2d5a3d 0%, #1D3A27 100%)',
          boxShadow: '0 4px 12px -2px rgba(29,58,39,0.35)',
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        Lihat Menu
      </button>
    </div>
  );
};

export default EmptyCart;
