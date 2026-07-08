import useCartStore, { itemUnitPrice } from '../../../../store/cartStore';
import { formatRupiah } from '../../../../shared/utils/format';
import { TrashIcon } from '../../../../shared/components/icons';
import QtyControl from '../../../components/QtyControl';

const CartItem = ({ item }) => {
  const removeLine = useCartStore((s) => s.removeLine);
  const unitPrice = itemUnitPrice(item);
  const subtotal = unitPrice * item.qty;
  const addonLabel = item.selectedAddons?.map((a) => a.nama || a.name).join(', ');

  return (
    <div
      className="flex gap-3 p-3 bg-white rounded-2xl"
      style={{
        border: '1px solid #f3f4f6',
        boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
      }}
    >
      <div
        className="relative shrink-0 rounded-xl overflow-hidden"
        style={{ width: 72, height: 72 }}
      >
        <img
          src={item.foto || 'https://placehold.co/400x300/e5e7eb/9ca3af?text=No+Image'}
          alt={item.nama}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p
              className="text-sm font-semibold text-gray-900 leading-snug truncate"
              style={{ fontFamily: "'Poppins', sans-serif" }}
              title={item.nama}
            >
              {item.nama}
            </p>
            <p
              className="text-[11px] text-gray-400 truncate"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {item.merchant_nama}
            </p>
            {addonLabel && (
              <p
                className="text-[11px] truncate"
                style={{ color: '#C8961A', fontFamily: "'Inter', sans-serif" }}
                title={addonLabel}
              >
                + {addonLabel}
              </p>
            )}
          </div>
          <button
            onClick={() => removeLine(item.lineKey)}
            className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            aria-label="Hapus item"
          >
            <TrashIcon size={15} />
          </button>
        </div>

        <div className="flex items-end justify-between mt-auto pt-2 gap-2">
          <div className="min-w-0">
            <p
              className="text-[11px] text-gray-400 leading-none"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {item.qty} x {formatRupiah(unitPrice)}
            </p>
            <p
              className="text-sm font-bold leading-tight mt-1 tabular-nums"
              style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
            >
              {formatRupiah(subtotal)}
            </p>
          </div>
          <div style={{ width: 108 }}>
            <QtyControl product={item} size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
