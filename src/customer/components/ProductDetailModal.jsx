import { useEffect, useState } from 'react';
import { formatRupiah } from '../../shared/utils/format';
import { CloseIcon } from '../../shared/components/icons';
import useCartStore from '../../store/cartStore';
import QtyControl from './QtyControl';

const ProductDetailModal = ({ product, open, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);

  // ── Item tambahan (add-on) ──────────────────────────────────────────────
  const addItemWithAddons = useCartStore((s) => s.addItemWithAddons);
  const addons = (product?.additionals || []).filter((a) => a.is_active !== false);
  // Pilihan add-on PER PRODUK (per unit): unitAddons[i] = daftar id add-on untuk
  // produk ke-(i+1). Jumlah yang dipesan = unitAddons.length; qty 2 berarti ada
  // 2 tab pilihan tambahan, masing-masing bisa berbeda.
  const [unitAddons, setUnitAddons] = useState([[]]);
  const [activeUnit, setActiveUnit] = useState(0);

  // Saat modal dibuka (atau produknya berganti): selalu mulai dari 1 produk
  // tanpa tambahan. Reset dilakukan saat render (pola "adjusting state when
  // props change") agar tidak memicu render beruntun.
  const resetKey = open ? product?.id ?? null : null;
  const [prevResetKey, setPrevResetKey] = useState(null);
  if (resetKey !== prevResetKey) {
    setPrevResetKey(resetKey);
    if (resetKey != null) {
      setUnitAddons([[]]);
      setActiveUnit(0);
    }
  }

  const qty = unitAddons.length;

  // Ubah jumlah produk → jumlah tab pilihan ikut berubah. Saat bertambah,
  // langsung fokus ke tab produk baru; saat berkurang, buang pilihan unit
  // terakhir dan jaga tab aktif tetap valid.
  const changeQty = (next) => {
    const n = Math.max(1, Math.min(999, next));
    setUnitAddons((prev) => {
      if (n === prev.length) return prev;
      if (n > prev.length) {
        return [...prev, ...Array.from({ length: n - prev.length }, () => [])];
      }
      return prev.slice(0, n);
    });
    setActiveUnit((cur) => (n > qty ? n - 1 : Math.min(cur, n - 1)));
  };

  const toggleAddon = (id) =>
    setUnitAddons((prev) =>
      prev.map((ids, i) =>
        i === activeUnit
          ? ids.includes(id)
            ? ids.filter((x) => x !== id)
            : [...ids, id]
          : ids
      )
    );

  const activeIds = unitAddons[activeUnit] || [];
  const addonById = new Map(addons.map((a) => [a.id, a]));
  const unitTotal = (ids) =>
    (product?.harga || 0) +
    ids.reduce((s, id) => s + (addonById.get(id)?.harga || 0), 0);
  const grandTotal = unitAddons.reduce((s, ids) => s + unitTotal(ids), 0);
  // Produk dinonaktifkan merchant (toggle "Habis") → tidak bisa dipesan.
  const unavailable = product?.is_available === false;

  const handleAddToCart = () => {
    if (unavailable) return;
    // Unit dengan kombinasi add-on yang sama digabung jadi satu baris keranjang;
    // kombinasi berbeda menjadi baris terpisah.
    const groups = new Map();
    for (const ids of unitAddons) {
      const key = [...ids].sort((a, b) => a - b).join(',');
      if (!groups.has(key)) groups.set(key, { ids, count: 0 });
      groups.get(key).count += 1;
    }
    for (const { ids, count } of groups.values()) {
      const chosen = addons.filter((a) => ids.includes(a.id));
      addItemWithAddons(product, chosen, count);
    }
    onClose();
  };

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
            src={product.foto || 'https://placehold.co/400x300/e5e7eb/9ca3af?text=No+Image'}
            alt={product.nama}
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
              {product.merchant_nama}
            </span>

            {/* Name */}
            <h2
              className="text-xl font-bold mb-1 text-gray-900"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {product.nama}
            </h2>

            {/* Price */}
            <p
              className="text-xl font-bold mb-4"
              style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
            >
              {formatRupiah(product.harga)}
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
                {product.deskripsi || 'Belum ada deskripsi untuk produk ini.'}
              </p>
            </div>

            {/* Category */}
            {(product.category?.nama_kategori || product.merchant_category) && (
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
                  {product.category?.nama_kategori || product.merchant_category}
                </span>
              </div>
            )}

            {/* Item tambahan (add-on) — pilihan per produk (tab per unit) */}
            {addons.length > 0 && (
              <div className="mt-5">
                <h3
                  className="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-2"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Tambahan
                </h3>

                {qty > 1 && (
                  <>
                    <p
                      className="text-[11px] text-gray-400 mb-2"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Pilih tambahan untuk masing-masing produk.
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-2 mb-1 -mx-1 px-1">
                      {unitAddons.map((ids, i) => {
                        const active = i === activeUnit;
                        return (
                          <button
                            key={i}
                            onClick={() => setActiveUnit(i)}
                            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
                            style={{
                              background: active ? '#1D3A27' : '#f3f4f6',
                              color: active ? 'white' : '#6b7280',
                              fontFamily: "'Poppins', sans-serif",
                            }}
                          >
                            Produk {i + 1}
                            {ids.length > 0 ? ` · ${ids.length}` : ''}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                <div className="flex flex-col gap-2">
                  {addons.map((a) => {
                    const checked = activeIds.includes(a.id);
                    return (
                      <button
                        key={a.id}
                        onClick={() => toggleAddon(a.id)}
                        className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border transition-colors text-left"
                        style={{
                          borderColor: checked ? '#1D3A27' : '#e5e7eb',
                          background: checked ? '#f0fdf4' : 'white',
                        }}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                            style={{
                              border: `1.5px solid ${checked ? '#1D3A27' : '#d1d5db'}`,
                              background: checked ? '#1D3A27' : 'white',
                            }}
                          >
                            {checked && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </span>
                          <span
                            className="text-sm text-gray-700 truncate"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            {a.nama}
                          </span>
                        </div>
                        <span
                          className="text-sm font-semibold shrink-0"
                          style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
                        >
                          + {formatRupiah(a.harga || 0)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom action */}
        <div
          className="p-4 border-t bg-white"
          style={{ borderColor: '#f3f4f6' }}
        >
          {unavailable ? (
            <button
              disabled
              className="w-full inline-flex items-center justify-center rounded-xl font-semibold cursor-not-allowed"
              style={{ height: 44, background: '#e5e7eb', color: '#9ca3af', fontFamily: "'Poppins', sans-serif" }}
            >
              Produk Tidak Tersedia
            </button>
          ) : addons.length > 0 ? (
            <div className="flex items-center gap-3">
              {/* Stepper qty */}
              <div
                className="flex items-center justify-between rounded-xl overflow-hidden shrink-0"
                style={{ height: 44, border: '1.5px solid #1D3A27', width: 120 }}
              >
                <button
                  onClick={() => changeQty(qty - 1)}
                  className="flex items-center justify-center text-white h-full"
                  style={{ width: 40, background: '#1D3A27' }}
                  aria-label="Kurangi"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg>
                </button>
                <span className="flex-1 text-center font-bold tabular-nums" style={{ color: '#1D3A27' }}>{qty}</span>
                <button
                  onClick={() => changeQty(qty + 1)}
                  className="flex items-center justify-center text-white h-full"
                  style={{ width: 40, background: '#1D3A27' }}
                  aria-label="Tambah"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg>
                </button>
              </div>
              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl text-white font-semibold transition-all active:scale-95"
                style={{
                  height: 44,
                  background: 'linear-gradient(135deg, #2d5a3d 0%, #1D3A27 100%)',
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Tambah · {formatRupiah(grandTotal)}
              </button>
            </div>
          ) : (
            <QtyControl product={product} size="md" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
