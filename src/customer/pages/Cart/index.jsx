import { useState, useEffect, useMemo } from 'react';
import useCartStore from '../../../store/cartStore';
import useTableStore from '../../../store/tableStore';
import { formatRupiah } from '../../../shared/utils/format';
import { getPublicFee, calcServiceFee } from '../../../services/platformSettingService';
import { getTenants } from '../../../services/tenantService';
import { isMerchantOpen } from '../../../shared/utils/merchant';
import CartHeader from './components/CartHeader';
import CartItemList from './components/CartItemList';
import PaymentMethodCard from './components/PaymentMethodCard';
import CartSummary from './components/CartSummary';
import EmptyCart from './components/EmptyCart';
import OrderInfoModal from './components/OrderInfoModal';
import ScanQrModal from './components/ScanQrModal';

const Cart = () => {
  const items = useCartStore((s) => s.items);
  const totalItems = useCartStore((s) => s.getTotalItems());
  const totalPrice = useCartStore((s) => s.getTotalPrice());
  const tableCode = useTableStore((s) => s.code);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [fee, setFee] = useState({ fee_rate: 0, fee_fixed: 0, is_active: false });
  // Status buka/tutup tiap merchant → cegah checkout bila ada tenant yang tutup.
  const [merchantById, setMerchantById] = useState(null);

  useEffect(() => {
    getPublicFee().then(setFee).catch(() => {});
  }, []);

  useEffect(() => {
    getTenants()
      .then((list) => setMerchantById(new Map(list.map((m) => [m.id, m]))))
      .catch(() => setMerchantById(new Map()));
  }, []);

  const serviceFee = calcServiceFee(totalPrice, fee);
  const grandTotal = totalPrice + serviceFee;

  const isEmpty = items.length === 0;

  // Nama tenant yang sedang tidak menerima pesanan (tutup atau dinonaktifkan)
  // tapi produknya masih ada di keranjang.
  const closedTenantNames = useMemo(() => {
    if (!merchantById) return [];
    const names = new Set();
    for (const it of items) {
      const m = merchantById.get(it.merchant_id);
      if (m && !isMerchantOpen(m)) names.add(m.nama || it.merchant_nama || 'Tenant');
    }
    return [...names];
  }, [items, merchantById]);

  const hasClosedTenant = closedTenantNames.length > 0;

  const handleOrderClick = () => {
    if (hasClosedTenant) return;
    if (!tableCode) {
      setScanModalOpen(true);
      return;
    }
    setOrderModalOpen(true);
  };

  return (
    <div
      className="min-h-screen pb-28"
      style={{ background: '#f9fafb', fontFamily: "'Inter', sans-serif" }}
    >
      <CartHeader />

      {isEmpty ? (
        <EmptyCart />
      ) : (
        <>
          <CartItemList items={items} />

          <div className="px-4 mt-4">
            <PaymentMethodCard />
          </div>

          <CartSummary totalItems={totalItems} subtotal={totalPrice} serviceFee={serviceFee} />
        </>
      )}

      {!isEmpty && (
        <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-3 pointer-events-none">
          <div
            className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
            style={{
              background:
                'linear-gradient(to top, rgba(249,250,251,0.95) 30%, rgba(249,250,251,0))',
            }}
          />
          {hasClosedTenant && (
            <div className="pointer-events-auto relative mb-2 rounded-xl px-3 py-2.5 text-[12px] leading-snug"
                 style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }}>
              {closedTenantNames.join(', ')} sedang tidak menerima pesanan. Hapus
              produk dari tenant tersebut untuk melanjutkan.
            </div>
          )}
          <button
            onClick={handleOrderClick}
            disabled={hasClosedTenant}
            className="pointer-events-auto relative w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-white transition-all active:scale-[0.98] hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:brightness-100"
            style={{
              background:
                'linear-gradient(135deg, #2d5a3d 0%, #1D3A27 50%, #15291c 100%)',
              boxShadow:
                '0 10px 28px -8px rgba(29,58,39,0.45), 0 4px 12px -2px rgba(0,0,0,0.18)',
            }}
          >
            <div className="text-left">
              <p
                className="text-[11px] leading-none opacity-70 mb-1"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Total · {totalItems} item
              </p>
              <p
                className="text-base font-bold leading-none tabular-nums"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {formatRupiah(grandTotal)}
              </p>
            </div>
            <span
              className="text-sm font-bold flex items-center gap-2"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Pesan Sekarang
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 6l6 6-6 6"
                  stroke="white"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        </div>
      )}

      <OrderInfoModal
        open={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
      />

      <ScanQrModal
        open={scanModalOpen}
        onClose={() => setScanModalOpen(false)}
      />
    </div>
  );
};

export default Cart;
