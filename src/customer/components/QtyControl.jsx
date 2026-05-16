import { useEffect, useState } from 'react';
import useCartStore from '../../store/cartStore';
import { PlusIcon, MinusIcon } from '../../shared/components/icons';

const MAX_QTY = 999;

const QtyControl = ({ product, size = 'sm', onAddOpenModal }) => {
  const addItem = useCartStore((s) => s.addItem);
  const decreaseItem = useCartStore((s) => s.decreaseItem);
  const setItemQty = useCartStore((s) => s.setItemQty);
  const qty = useCartStore((s) => s.getItemQty(product.id));

  const [inputValue, setInputValue] = useState(String(qty));

  useEffect(() => {
    setInputValue(String(qty));
  }, [qty]);

  const handleInputChange = (e) => {
    e.stopPropagation();
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 3);
    setInputValue(cleaned);
    const num = parseInt(cleaned, 10);
    if (!isNaN(num) && num > 0) {
      setItemQty(product, Math.min(num, MAX_QTY));
    }
  };

  const handleInputBlur = () => {
    const num = parseInt(inputValue, 10);
    if (isNaN(num) || num < 1) {
      setInputValue(String(qty));
    }
  };

  const dims = {
    sm: { height: 32, fontSize: 13, iconSize: 12, buttonW: 30, padX: 12 },
    md: { height: 44, fontSize: 15, iconSize: 14, buttonW: 40, padX: 16 },
  }[size];

  const handleAdd = (e) => {
    e?.stopPropagation?.();
    addItem(product);
  };

  const handleDecrease = (e) => {
    e?.stopPropagation?.();
    decreaseItem(product.id);
  };

  if (qty === 0) {
    return (
      <button
        onClick={(e) => {
          if (onAddOpenModal) {
            onAddOpenModal(e);
          } else {
            handleAdd(e);
          }
        }}
        className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl text-white font-semibold transition-all active:scale-95 hover:brightness-110"
        style={{
          height: dims.height,
          fontSize: dims.fontSize,
          background: 'linear-gradient(135deg, #2d5a3d 0%, #1D3A27 100%)',
          boxShadow: '0 4px 12px -2px rgba(29,58,39,0.35), inset 0 1px 0 rgba(255,255,255,0.1)',
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <PlusIcon size={dims.iconSize} color="white" strokeWidth={3} />
        Tambah
      </button>
    );
  }

  return (
    <div
      className="flex items-center justify-between rounded-xl overflow-hidden bg-white"
      style={{
        height: dims.height,
        border: '1.5px solid #1D3A27',
        boxShadow: '0 2px 8px -2px rgba(29,58,39,0.18)',
      }}
    >
      <button
        onClick={handleDecrease}
        className="flex items-center justify-center text-white shrink-0 transition-all active:scale-90 hover:brightness-110"
        style={{
          width: dims.buttonW,
          height: '100%',
          background: 'linear-gradient(135deg, #2d5a3d 0%, #1D3A27 100%)',
        }}
        aria-label="Kurangi"
      >
        <MinusIcon size={dims.iconSize} color="white" strokeWidth={3} />
      </button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onClick={(e) => e.stopPropagation()}
        onFocus={(e) => e.target.select()}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur();
        }}
        aria-label="Jumlah"
        className="flex-1 w-0 min-w-0 text-center font-bold tabular-nums bg-transparent outline-none"
        style={{
          color: '#1D3A27',
          fontSize: dims.fontSize,
          fontFamily: "'Poppins', sans-serif",
        }}
      />
      <button
        onClick={handleAdd}
        className="flex items-center justify-center text-white shrink-0 transition-all active:scale-90 hover:brightness-110"
        style={{
          width: dims.buttonW,
          height: '100%',
          background: 'linear-gradient(135deg, #2d5a3d 0%, #1D3A27 100%)',
        }}
        aria-label="Tambah"
      >
        <PlusIcon size={dims.iconSize} color="white" strokeWidth={3} />
      </button>
    </div>
  );
};

export default QtyControl;
