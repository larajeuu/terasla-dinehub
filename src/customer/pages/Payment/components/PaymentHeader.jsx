import { useNavigate } from 'react-router-dom';
import { BackIcon } from '../../../../shared/components/icons';

const PaymentHeader = () => {
  const navigate = useNavigate();
  return (
    <header
      className="flex items-center gap-3 px-4 py-3 sticky top-0 z-40"
      style={{
        background: 'linear-gradient(135deg, #1D3A27 0%, #244830 50%, #1D3A27 100%)',
      }}
    >
      <button
        onClick={() => navigate(-1)}
        className="w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-90"
        style={{ background: 'rgba(255,255,255,0.12)', color: 'white' }}
        aria-label="Kembali"
      >
        <BackIcon size={20} color="white" />
      </button>
      <h1
        className="text-base font-bold text-white flex-1 truncate"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Metode Pembayaran
      </h1>
    </header>
  );
};

export default PaymentHeader;
