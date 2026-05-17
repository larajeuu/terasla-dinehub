import { useNavigate } from 'react-router-dom';

const LoginActions = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Tombol Masuk */}
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

      {/* Tombol Daftar */}
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
  );
};

export default LoginActions;