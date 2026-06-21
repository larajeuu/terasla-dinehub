import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CloseIcon,
  MailIcon,
  PhoneIcon,
} from '../../../../shared/components/icons';
import useCartStore from '../../../../store/cartStore';
import useTableStore from '../../../../store/tableStore';
import usePaymentStore from '../../../../store/paymentStore';
import { createCustomerOrder } from '../../../../services/customerOrderService';
import { chargePayment } from '../../../../services/paymentService';

const Field = ({ icon, label, type, value, onChange, placeholder }) => (
  <label className="block">
    <span
      className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {label}
    </span>
    <div
      className="mt-1.5 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gray-50 focus-within:bg-white focus-within:ring-2 transition-all"
      style={{
        border: '1px solid #e5e7eb',
      }}
    >
      <span className="text-gray-400">{icon}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-sm text-gray-800"
        style={{ fontFamily: "'Inter', sans-serif" }}
      />
    </div>
  </label>
);

const OrderInfoModal = ({ open, onClose }) => {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const tableCode = useTableStore((s) => s.code);
  const selectedMethod = usePaymentStore((s) => s.selectedMethod);

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);

  const handleLanjut = async () => {
    setErrMsg('');
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrMsg('Email wajib diisi (dipakai untuk kirim & pantau pesanan).');
      return;
    }
    if (!selectedMethod?.id) {
      setErrMsg('Pilih metode pembayaran dulu di halaman keranjang.');
      return;
    }
    if (!items.length) {
      setErrMsg('Keranjang masih kosong.');
      return;
    }
    setSubmitting(true);
    try {
      const order = await createCustomerOrder({
        customer: {
          email: cleanEmail,                 // wajib — kunci identitas
          phone: phone.trim() || null,       // pelengkap, boleh berubah
        },
        dining_table_code: tableCode,
        tipe_order: 'dine_in',
        metode_pembayaran_id: selectedMethod.id,
        items: items.map((i) => ({
          product_id: i.id,
          jumlah: i.qty,
          ...(i.selectedAddons?.length
            ? { addon_ids: i.selectedAddons.map((a) => a.id) }
            : {}),
        })),
      });
      const charge = await chargePayment({
        id_pesanan: order.id,
        metode_pembayaran_id: selectedMethod.id,
      });
      clearCart();
      onClose();
      navigate(`/payment/status/${charge.payment_token}`, { state: { charge } });
    } catch (err) {
      setErrMsg(err?.response?.data?.detail || 'Gagal membuat pesanan. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (open) {
      setMounted(true);
    } else if (mounted) {
      setShown(false);
      const t = setTimeout(() => setMounted(false), 220);
      return () => clearTimeout(t);
    }
  }, [open, mounted]);

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

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center px-5"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={onClose}
        className="absolute inset-0 transition-opacity duration-200"
        style={{
          background: 'rgba(0,0,0,0.5)',
          opacity: shown ? 1 : 0,
        }}
      />

      <div
        className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden transition-all duration-200"
        style={{
          transform: shown ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(10px)',
          opacity: shown ? 1 : 0,
          boxShadow: '0 24px 60px -12px rgba(0,0,0,0.35)',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Tutup"
        >
          <CloseIcon size={16} />
        </button>

        <div className="px-6 pt-7 pb-5">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
            style={{
              background: 'linear-gradient(135deg, #2d5a3d 0%, #1D3A27 100%)',
              boxShadow: '0 6px 14px -4px rgba(29,58,39,0.4)',
            }}
          >
            <MailIcon size={22} color="white" />
          </div>
          <h2
            className="text-base font-bold text-gray-900 leading-snug"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Kami akan kirim data pesananmu ke...
          </h2>
          <p
            className="text-xs text-gray-500 mt-1"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Isi data berikut supaya kamu bisa terus pantau pesananmu.
          </p>

          <div className="mt-5 space-y-3">
            <Field
              icon={<MailIcon size={16} />}
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="kamu@email.com"
            />
            <Field
              icon={<PhoneIcon size={16} />}
              label="No. Telepon"
              type="tel"
              value={phone}
              onChange={setPhone}
              placeholder="08xx-xxxx-xxxx"
            />
          </div>
        </div>

        <div className="px-6 pb-6 space-y-2">
          {errMsg && (
            <div className="text-[12px] rounded-xl px-3 py-2.5 leading-snug"
                 style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }}>
              {errMsg}
            </div>
          )}
          <button
            type="button"
            onClick={handleLanjut}
            disabled={submitting}
            className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-all active:scale-[0.98] hover:brightness-110 disabled:opacity-60"
            style={{
              background: 'linear-gradient(135deg, #2d5a3d 0%, #1D3A27 100%)',
              boxShadow: '0 6px 16px -4px rgba(29,58,39,0.4)',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {submitting ? 'Memproses...' : 'Lanjut'}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-60"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderInfoModal;
