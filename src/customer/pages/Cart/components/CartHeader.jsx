import { useNavigate } from 'react-router-dom';
import { BackIcon, TableIcon } from '../../../../shared/components/icons';
import useTableStore from '../../../../store/tableStore';

const CartHeader = () => {
  const navigate = useNavigate();
  const tableLabel = useTableStore((s) => s.label);

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
        className="text-base font-bold text-white flex-1"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Rincian Pesanan
      </h1>

      <div
        className="inline-flex items-center gap-1.5 pl-1 pr-3 py-1 rounded-full"
        style={{
          background: 'rgba(255,255,255,0.14)',
          border: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        <span
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #d6a425 0%, #C8961A 100%)',
          }}
        >
          <TableIcon size={12} color="white" />
        </span>
        <span
          className="text-[11px] font-semibold text-white tabular-nums"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {tableLabel ? `No. Meja ${tableLabel}` : 'Belum scan meja'}
        </span>
      </div>
    </header>
  );
};

export default CartHeader;
