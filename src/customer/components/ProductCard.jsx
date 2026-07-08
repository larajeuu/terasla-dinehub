import { useState } from 'react';
import useCartStore from '../../store/cartStore';
import { formatRupiah } from '../../shared/utils/format';
import QtyControl from './QtyControl';
import ProductDetailModal from './ProductDetailModal';

const ProductCard = ({ product, showTenant = true }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const qty = useCartStore((s) => s.getItemQty(product.id));
  // Produk dinonaktifkan merchant (toggle "Habis") → tidak bisa dipesan.
  const unavailable = product.is_available === false;
  // Produk ber-add-on: tombol tambah membuka modal agar pelanggan memilih
  // add-on per unit (tiap kombinasi jadi baris keranjang terpisah).
  const hasAddons = (product.additionals || []).some((a) => a.is_active !== false);

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        className="bg-white rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
        style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}
      >
        {/* Image */}
        <div className="relative">
          <img
            src={product.foto || 'https://placehold.co/400x300/e5e7eb/9ca3af?text=No+Image'}
            alt={product.nama}
            className="w-full object-cover"
            style={{ height: 110, filter: unavailable ? 'grayscale(1)' : 'none', opacity: unavailable ? 0.6 : 1 }}
            loading="lazy"
          />
          {unavailable && (
            <span
              className="absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: '#6b7280' }}
            >
              Habis
            </span>
          )}
          {qty > 0 && (
            <span
              className="absolute top-2 right-2 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: '#C8961A', boxShadow: '0 2px 6px rgba(0,0,0,0.18)' }}
            >
              {qty}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-2.5 flex flex-col gap-0.5 flex-1">
          <p
            className="text-sm font-semibold leading-snug text-gray-800 truncate"
            style={{ fontFamily: "'Poppins', sans-serif" }}
            title={product.nama}
          >
            {product.nama}
          </p>
          <p
            className="text-sm font-bold"
            style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
          >
            {formatRupiah(product.harga)}
          </p>
          {showTenant && (
            <p
              className="text-[11px] text-gray-400 truncate"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {product.merchant_nama}
            </p>
          )}

          {/* Cart control pinned bottom */}
          <div
            className="mt-auto pt-2"
            onClick={(e) => e.stopPropagation()}
          >
            {unavailable ? (
              <button
                disabled
                className="w-full inline-flex items-center justify-center rounded-xl font-semibold cursor-not-allowed"
                style={{ height: 32, fontSize: 13, background: '#e5e7eb', color: '#9ca3af', fontFamily: "'Poppins', sans-serif" }}
              >
                Habis
              </button>
            ) : (
              <QtyControl
                product={product}
                size="sm"
                onAddOpenModal={hasAddons ? () => setModalOpen(true) : undefined}
              />
            )}
          </div>
        </div>
      </div>

      <ProductDetailModal
        product={product}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default ProductCard;
