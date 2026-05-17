import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Header */}
      <div className="flex flex-col items-center gap-1 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">
          <span
            className="text-white"
            style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
          >
            Teras{' '}
          </span>
          <span
            style={{ color: '#C8961A', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
          >
            LA
          </span>
        </h1>
        <p
          className="text-sm font-medium tracking-widest uppercase"
          style={{ color: 'rgba(200, 150, 26, 0.8)', fontFamily: "'Inter', sans-serif" }}
        >
          Merchant
        </p>
      </div>

      {/* Illustration */}
      <div className="flex items-center justify-center mb-8">
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 9.5L12 3L21 9.5V21H15V15H9V21H3V9.5Z"
              fill="none"
              stroke="#C8961A"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <rect x="9" y="10" width="6" height="5" rx="1" fill="#C8961A" opacity="0.4" />
            <path
              d="M4 20h16"
              stroke="#C8961A"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.5"
            />
          </svg>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 w-full">
        <button
          onClick={() => navigate('/merchant/login')}
          className="w-full py-3.5 rounded-2xl font-semibold text-sm transition-all active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #C8961A 0%, #d6a425 100%)',
            color: 'white',
            fontFamily: "'Poppins', sans-serif",
            boxShadow: '0 4px 16px rgba(200, 150, 26, 0.35)',
          }}
        >
          Masuk ke Akun
        </button>

        <button
          onClick={() => navigate('/merchant/register')}
          className="w-full py-3.5 rounded-2xl font-semibold text-sm transition-all active:scale-95"
          style={{
            background: 'rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.85)',
            border: '1px solid rgba(255,255,255,0.15)',
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Daftar
        </button>
      </div>
    </>
  );
};

export default LoginPage;