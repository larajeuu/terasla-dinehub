import useCartStore from '../../../../store/cartStore';

const formatRupiah = (n) =>
  'Rp ' + n.toLocaleString('id-ID');

const ProductCard = ({ product }) => {
  const addItem = useCartStore((s) => s.addItem);
  const decreaseItem = useCartStore((s) => s.decreaseItem);
  const qty = useCartStore((s) => s.getItemQty(product.id));

  return (
    <div className="bg-white rounded-2xl overflow-hidden flex flex-col" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}>
      {/* Image */}
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full object-cover"
          style={{ height: 110 }}
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="p-2.5 flex flex-col gap-0.5 flex-1">
        <p
          className="text-sm font-semibold leading-snug text-gray-800 truncate"
          style={{ fontFamily: "'Poppins', sans-serif" }}
          title={product.name}
        >
          {product.name}
        </p>
        <p
          className="text-sm font-bold"
          style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
        >
          {formatRupiah(product.price)}
        </p>
        <p
          className="text-[11px] text-gray-400 truncate"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {product.tenantName}
        </p>

        {/* Cart control — pinned to bottom */}
        <div className="mt-auto pt-2">
          {qty === 0 ? (
            <button
              onClick={() => addItem(product)}
              className="w-full py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity active:opacity-80"
              style={{ background: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
            >
              + Tambah
            </button>
          ) : (
            <div
              className="flex items-center justify-between rounded-lg overflow-hidden"
              style={{ border: '1.5px solid #1D3A27' }}
            >
              <button
                onClick={() => decreaseItem(product.id)}
                className="w-8 h-7 flex items-center justify-center text-white text-base font-bold shrink-0"
                style={{ background: '#1D3A27' }}
              >
                −
              </button>
              <span
                className="flex-1 text-center text-sm font-bold"
                style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
              >
                {qty}
              </span>
              <button
                onClick={() => addItem(product)}
                className="w-8 h-7 flex items-center justify-center text-white text-base font-bold shrink-0"
                style={{ background: '#1D3A27' }}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
