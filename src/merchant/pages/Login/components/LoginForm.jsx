import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginMerchant } from '../../../../services/authService';
import useAuthStore from '../../../../store/authStore';

const LoginForm = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleLogin = async () => {
    const newErrors = {};

    if (!identifier.trim()) {
      newErrors.identifier = 'Email atau nomor HP wajib diisi';
    }

    if (!password.trim()) {
      newErrors.password = 'Kata sandi wajib diisi';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setErrors({});

      const response = await loginMerchant({
        identifier: identifier.trim(),
        password,
      })

      console.log('Login Response', response);

      if (response.role !== 'merchant') {
        setErrors({
          general: 'Akun ini tidak memiliki akses merchant',
        });
        return;
      }

      setAuth({
        user: {
          id: response.user_id,
          name: response.nama,
          identifier: response.email || response.no_hp,
          role: response.role,
          merchantId: response.merchant_id,
          status: response.status,
        },
        token: response.access_token,
      })

      navigate('/merchant/dashboard', {replace: true});
    } catch (error) {
      console.error('Login Gagal',error);

      const message =
        error?.response?.data?.detail ||
        'Email/No HP atau kata sandi salah. Silakan coba lagi.';

        setErrors({
          general: message,
        })
      }
    }
  

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f5f5f5' }}>

      {/* Header */}
      <div
        className="px-4 pt-5 pb-8"
        style={{ background: 'linear-gradient(135deg, #1D3A27 0%, #244830 100%)' }}
      >
        <button
          onClick={() => navigate('/merchant')}
          className="w-9 h-9 rounded-full flex items-center justify-center mb-4 transition-all active:scale-90"
          style={{ background: 'rgba(255,255,255,0.12)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <p className="text-white font-bold text-xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Selamat Datang
        </p>
        <p className="font-bold text-xl italic" style={{ color: '#C8961A', fontFamily: "'Poppins', sans-serif" }}>
          Kembali
        </p>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: "'Inter', sans-serif" }}>
          Masuk untuk kelola toko Anda
        </p>
      </div>

      {/* Form */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>

          {/* Email / No HP */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-1 block" style={{ fontFamily: "'Inter', sans-serif" }}>
              Email / No. Hp
            </label>
            <input
              type="text"
              placeholder="email@contoh.com atau 08xxxxxxxxxx"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{
                border: `1px solid ${errors.identifier ? '#ef4444' : '#e5e7eb'}`,
                fontFamily: "'Inter', sans-serif",
                color: '#374151',
              }}
            />
            {errors.identifier && <p className="text-xs text-red-500 mt-1">{errors.identifier}</p>}
          </div>

          {/* Kata Sandi */}
          <div className="mb-2">
            <label className="text-sm font-medium text-gray-700 mb-1 block" style={{ fontFamily: "'Inter', sans-serif" }}>
              Kata Sandi
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 8 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none pr-11"
                style={{
                  border: `1px solid ${errors.password ? '#ef4444' : '#e5e7eb'}`,
                  fontFamily: "'Inter', sans-serif",
                  color: '#374151',
                }}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round"/>
                    <line x1="1" y1="1" x2="23" y2="23" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round"/>
                    <circle cx="12" cy="12" r="3" stroke="#9ca3af" strokeWidth="1.8"/>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          {/* Lupa kata sandi */}
          <div className="flex justify-end mb-6">
            <span
              className="text-xs font-medium cursor-pointer"
              style={{ color: '#1D3A27', fontFamily: "'Inter', sans-serif" }}
            >
              Lupa kata sandi?
            </span>
          </div>

          {errors.general && (
            <div
              className="text-xs rounded-xl px-3 py-2 mb-3"
              style= {{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.25)',
                color: '#ef4444',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {errors.general}
            </div>
          )}

          {/* Tombol Masuk */}
          <button
            onClick={handleLogin}
            className="w-full py-3.5 rounded-2xl font-semibold text-sm text-white transition-all active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #1D3A27 0%, #244830 100%)',
              fontFamily: "'Poppins', sans-serif",
              boxShadow: '0 4px 16px rgba(29,58,39,0.3)',
            }}
          >
            Masuk
          </button>

          {/* Link daftar */}
          <p className="text-center text-xs text-gray-500 mt-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            Belum punya akun?{' '}
            <span
              className="font-semibold cursor-pointer"
              style={{ color: '#1D3A27' }}
              onClick={() => navigate('/merchant/register')}
            >
              Daftar di sini
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;