import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { validateResetToken, resetPassword } from '../../../services/authService';

const GREEN_GRADIENT = 'linear-gradient(135deg, #1D3A27 0%, #244830 100%)';

const Header = ({ title, subtitle }) => (
  <div className="px-4 pt-5 pb-8" style={{ background: GREEN_GRADIENT }}>
    <p className="text-white font-bold text-xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {title}
    </p>
    <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: "'Inter', sans-serif" }}>
      {subtitle}
    </p>
  </div>
);

const PrimaryButton = ({ onClick, disabled, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-full py-3.5 rounded-2xl font-semibold text-sm text-white transition-all active:scale-95 disabled:opacity-60"
    style={{
      background: GREEN_GRADIENT,
      fontFamily: "'Poppins', sans-serif",
      boxShadow: '0 4px 16px rgba(29,58,39,0.3)',
    }}
  >
    {children}
  </button>
);

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [checking, setChecking] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      if (!token) {
        if (!cancelled) { setTokenValid(false); setChecking(false); }
        return;
      }
      try {
        const valid = await validateResetToken(token);
        if (!cancelled) setTokenValid(valid);
      } catch {
        if (!cancelled) setTokenValid(false);
      } finally {
        if (!cancelled) setChecking(false);
      }
    };
    check();
    return () => { cancelled = true; };
  }, [token]);

  const handleSubmit = async () => {
    if (password.length < 8) {
      setError('Kata sandi minimal 8 karakter');
      return;
    }
    if (password !== confirm) {
      setError('Konfirmasi kata sandi tidak cocok');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Gagal mengubah kata sandi. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading ──
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f5f5f5' }}>
        <p className="text-sm text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>Memuat...</p>
      </div>
    );
  }

  // ── Berhasil ──
  if (done) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#f5f5f5' }}>
        <Header title="Berhasil" subtitle="Kata sandi Anda telah diperbarui" />
        <div className="px-4 mt-4">
          <div className="bg-white rounded-2xl p-5 text-center" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#f0fdf4' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>
              Kata sandi berhasil diatur ulang. Silakan masuk menggunakan kata sandi baru Anda.
            </p>
            <PrimaryButton onClick={() => navigate('/merchant/login')}>Masuk Sekarang</PrimaryButton>
          </div>
        </div>
      </div>
    );
  }

  // ── Token tidak valid / kedaluwarsa ──
  if (!tokenValid) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#f5f5f5' }}>
        <Header title="Tautan Tidak Valid" subtitle="Link reset sudah kedaluwarsa atau tidak benar" />
        <div className="px-4 mt-4">
          <div className="bg-white rounded-2xl p-5 text-center" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#fef2f2' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 8v5M12 16h.01" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="12" r="9" stroke="#dc2626" strokeWidth="1.8" />
              </svg>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>
              Tautan atur ulang kata sandi tidak valid atau sudah kedaluwarsa. Silakan minta tautan baru.
            </p>
            <PrimaryButton onClick={() => navigate('/merchant/forgot-password')}>Minta Tautan Baru</PrimaryButton>
          </div>
        </div>
      </div>
    );
  }

  // ── Form kata sandi baru ──
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f5f5f5' }}>
      <Header title="Atur Ulang Kata Sandi" subtitle="Masukkan kata sandi baru Anda" />
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-1 block" style={{ fontFamily: "'Inter', sans-serif" }}>
              Kata Sandi Baru
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 8 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ border: '1px solid #e5e7eb', fontFamily: "'Inter', sans-serif", color: '#374151' }}
            />
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-1 block" style={{ fontFamily: "'Inter', sans-serif" }}>
              Konfirmasi Kata Sandi
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Ulangi kata sandi"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ border: '1px solid #e5e7eb', fontFamily: "'Inter', sans-serif", color: '#374151' }}
            />
          </div>

          <div className="flex items-center gap-2 mb-4">
            <input id="showpw" type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
            <label htmlFor="showpw" className="text-xs text-gray-500" style={{ fontFamily: "'Inter', sans-serif" }}>
              Tampilkan kata sandi
            </label>
          </div>

          {error && (
            <div
              className="text-xs rounded-xl px-3 py-2 mb-3"
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.25)',
                color: '#ef4444',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {error}
            </div>
          )}

          <PrimaryButton onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Menyimpan...' : 'Simpan Kata Sandi Baru'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
