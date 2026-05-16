import { useEffect, useState } from 'react';
import {
  CloseIcon,
  MailIcon,
  PhoneIcon,
} from '../../../../shared/components/icons';

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
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);

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
          <button
            type="button"
            className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-all active:scale-[0.98] hover:brightness-110"
            style={{
              background: 'linear-gradient(135deg, #2d5a3d 0%, #1D3A27 100%)',
              boxShadow: '0 6px 16px -4px rgba(29,58,39,0.4)',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Lanjut
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
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
