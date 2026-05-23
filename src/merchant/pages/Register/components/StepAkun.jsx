import { useState } from 'react';

const StepAkun = ({ onNext }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      <p className="font-bold text-base text-gray-800 mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
        Data Akun
      </p>
      <p className="text-xs text-gray-400 mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>
        Lengkapi informasi akun Anda
      </p>

      {/* Nama Lengkap */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-1 block" style={{ fontFamily: "'Inter', sans-serif" }}>
          Nama Lengkap
        </label>
        <input
          type="text"
          placeholder="Nama sesuai KTP"
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={{
            border: '1px solid #e5e7eb',
            fontFamily: "'Inter', sans-serif",
            color: '#374151',
          }}
        />
      </div>

      {/* No HP */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-1 block" style={{ fontFamily: "'Inter', sans-serif" }}>
          No Hp / WhatsApp
        </label>
        <input
          type="tel"
          placeholder="08xxxxxxxxxx"
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={{
            border: '1px solid #e5e7eb',
            fontFamily: "'Inter', sans-serif",
            color: '#374151',
          }}
        />
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-1 block" style={{ fontFamily: "'Inter', sans-serif" }}>
          Email
        </label>
        <input
          type="email"
          placeholder="email@contoh.com"
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={{
            border: '1px solid #e5e7eb',
            fontFamily: "'Inter', sans-serif",
            color: '#374151',
          }}
        />
      </div>

      {/* Kata Sandi */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-1 block" style={{ fontFamily: "'Inter', sans-serif" }}>
          Kata Sandi
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Min. 8 karakter"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none pr-11"
            style={{
              border: '1px solid #e5e7eb',
              fontFamily: "'Inter', sans-serif",
              color: '#374151',
            }}
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
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
      </div>

      {/* Konfirmasi Kata Sandi */}
      <div className="mb-5">
        <label className="text-sm font-medium text-gray-700 mb-1 block" style={{ fontFamily: "'Inter', sans-serif" }}>
          Konfirmasi Kata Sandi
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Min. 8 karakter"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none pr-11"
            style={{
              border: '1px solid #e5e7eb',
              fontFamily: "'Inter', sans-serif",
              color: '#374151',
            }}
          />
          <button
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showConfirmPassword ? (
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
      </div>

      {/* Checkbox */}
      <div className="flex items-start gap-2 mb-6">
        <input
          type="checkbox"
          id="agree"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 accent-[#1D3A27]"
        />
        <label htmlFor="agree" className="text-xs text-gray-500 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
          Saya menyetujui{' '}
          <span style={{ color: '#C8961A' }} className="font-medium">Syarat & Ketentuan</span>
          {' '}serta{' '}
          <span style={{ color: '#C8961A' }} className="font-medium">Kebijakan Privasi</span>
          {' '}Teras LA
        </label>
      </div>

      {/* Tombol Lanjut */}
      <button
        onClick={onNext}
        className="w-full py-3.5 rounded-2xl font-semibold text-sm text-white transition-all active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #1D3A27 0%, #244830 100%)',
          fontFamily: "'Poppins', sans-serif",
          boxShadow: '0 4px 16px rgba(29,58,39,0.3)',
        }}
      >
        Lanjut
      </button>

      {/* Link masuk */}
      <p className="text-center text-xs text-gray-500 mt-4" style={{ fontFamily: "'Inter', sans-serif" }}>
        Sudah punya akun?{' '}
        <span
          className="font-semibold cursor-pointer"
          style={{ color: '#1D3A27' }}
          onClick={() => window.history.back()}
        >
          Masuk di sini
        </span>
      </p>
    </div>
  );
};

export default StepAkun;