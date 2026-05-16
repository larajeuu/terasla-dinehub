import { useEffect, useState } from 'react';
import { formatRupiah } from '../../shared/utils/format';
import { CloseIcon } from '../../shared/components/icons';
import QtyControl from './QtyControl';

const ProductDetailModal = ({ product, open, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);

  // Mount/unmount with delay for slide-out animation
  useEffect(() => {
    if (open) {
      setMounted(true);
    } else if (mounted) {
      setShown(false);
      const t = setTimeout(() => setMounted(false), 280);
      return () => clearTimeout(t);
    }
  }, [open, mounted]);

  // After mount, wait two frames so the browser paints the initial
  // translateY(100%) state before we flip to translateY(0). Without
  // this React batches the renders and the slide-in animation is skipped.
  useEffect(() => {
    if (!mounted || !open) return;
    let raf2;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setShown(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, [mounted, open]);

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!mounted || !product) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-end justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: 'rgba(0,0,0,0.45)',
          opacity: shown ? 1 : 0,
        }}
      />

      {/* Sheet */}
      <div
        className="relative w-full max-w-md bg-white rounded-t-3xl overflow-hidden transition-transform duration-300 ease-out"
        style={{
          transform: shown ? 'translateY(0)' : 'translateY(100%)',
          maxHeight: '90vh',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.18)',
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-gray-300" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-90"
          style={{ background: 'rgba(255,255,255,0.92)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
          aria-label="Tutup"
        >
          <CloseIcon size={18} color="#1D3A27" />
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 100px)' }}>
          {/* Image */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full object-cover"
            style={{ height: 220 }}
          />

          {/* Body */}
          <div className="p-5">
            {/* Tenant pill */}
            <span
              className="inline-block text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full mb-3"
              style={{
                background: '#F5EDD9',
                color: '#7c5a0f',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {product.tenantName}
            </span>

            {/* Name */}
            <h2
              className="text-xl font-bold mb-1 text-gray-900"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {product.name}
            </h2>

            {/* Price */}
            <p
              className="text-xl font-bold mb-4"
              style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
            >
              {formatRupiah(product.price)}
            </p>

            {/* Description */}
            <div className="mb-2">
              <h3
                className="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-1.5"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Deskripsi
              </h3>
              <p
                className="text-sm text-gray-600 leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {product.description || 'Belum ada deskripsi untuk produk ini.'}
              </p>
            </div>

            {/* Category */}
            {product.category && (
              <div className="mt-4 flex items-center gap-2">
                <span
                  className="text-xs font-semibold"
                  style={{ color: '#6b7280', fontFamily: "'Inter', sans-serif" }}
                >
                  Kategori:
                </span>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: '#f3f4f6', color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
                >
                  {product.category}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom action */}
        <div
          className="p-4 border-t bg-white"
          style={{ borderColor: '#f3f4f6' }}
        >
          <QtyControl product={product} size="md" />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
