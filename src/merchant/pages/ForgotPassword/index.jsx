import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../../../services/authService';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!identifier.trim()) {
      setError('Email atau nomor HP wajib diisi');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await forgotPassword(identifier.trim());
      setSent(true);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Gagal mengirim link. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f5f5f5' }}>
      {/* Header */}
      <div
        className="px-4 pt-5 pb-8"
        style={{ background: 'linear-gradient(135deg, #1D3A27 0%, #244830 100%)' }}
      >
        <button
          onClick={() => navigate('/merchant/login')}
          className="w-9 h-9 rounded-full flex items-center justify-center mb-4 transition-all active:scale-90"
          style={{ background: 'rgba(255,255,255,0.12)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <p className="text-white font-bold text-xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Lupa Kata Sandi
        </p>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: "'Inter', sans-serif" }}>
          Kami akan mengirim link atur ulang ke email Anda
        </p>
      </div>

      {/* Form */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          {sent ? (
            <div className="text-center py-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: '#f0fdf4' }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M4 6h16v12H4z" stroke="#16a34a" strokeWidth="1.8" strokeLinejoin="round" />
                  <path d="M4 7l8 6 8-6" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-800 mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Periksa Email Anda
              </p>
              <p className="text-xs text-gray-500 leading-relaxed mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>
                Jika akun terdaftar, kami telah mengirim link untuk mengatur ulang kata sandi.
                Link berlaku selama 1 jam.
              </p>
              <button
                onClick={() => navigate('/merchant/login')}
                className="w-full py-3.5 rounded-2xl font-semibold text-sm text-white transition-all active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #1D3A27 0%, #244830 100%)',
                  fontFamily: "'Poppins', sans-serif",
                  boxShadow: '0 4px 16px rgba(29,58,39,0.3)',
                }}
              >
                Kembali ke Masuk
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mb-1 block" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Email / No. Hp
                </label>
                <input
                  type="text"
                  placeholder="email@contoh.com atau 08xxxxxxxxxx"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{
                    border: `1px solid ${error ? '#ef4444' : '#e5e7eb'}`,
                    fontFamily: "'Inter', sans-serif",
                    color: '#374151',
                  }}
                />
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-3.5 rounded-2xl font-semibold text-sm text-white transition-all active:scale-95 disabled:opacity-60"
                style={{
                  background: 'linear-gradient(135deg, #1D3A27 0%, #244830 100%)',
                  fontFamily: "'Poppins', sans-serif",
                  boxShadow: '0 4px 16px rgba(29,58,39,0.3)',
                }}
              >
                {submitting ? 'Mengirim...' : 'Kirim Link Reset'}
              </button>

              <p className="text-center text-xs text-gray-500 mt-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                Ingat kata sandi?{' '}
                <span
                  className="font-semibold cursor-pointer"
                  style={{ color: '#1D3A27' }}
                  onClick={() => navigate('/merchant/login')}
                >
                  Masuk di sini
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
