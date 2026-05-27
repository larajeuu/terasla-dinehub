import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/authStore';

const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState('admin@terasla.id');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Bypass auth — accept any input, set dummy admin
    setTimeout(() => {
      setAuth({
        user: {
          id: 'admin-001',
          name: 'Super Admin',
          email: email || 'admin@terasla.id',
          role: 'admin',
        },
        token: 'dummy-admin-token-' + Date.now(),
      });
      navigate('/admin/dashboard');
    }, 400);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #1a3325 0%, #1D3A27 50%, #16291c 100%)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, #C8961A 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
          opacity: 0.12,
        }}
      />
      {/* Decorative blobs */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: '#C8961A', filter: 'blur(120px)', opacity: 0.12, transform: 'translate(30%, -30%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-[28rem] h-[28rem] rounded-full pointer-events-none"
        style={{ background: '#4A7C40', filter: 'blur(140px)', opacity: 0.1, transform: 'translate(-30%, 30%)' }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: 'rgba(200, 150, 26, 0.15)',
              border: '1px solid rgba(200, 150, 26, 0.3)',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 9.5L12 3L21 9.5V21H15V15H9V21H3V9.5Z"
                stroke="#C8961A"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <rect x="9" y="10" width="6" height="5" rx="1" fill="#C8961A" opacity="0.4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-white" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
              Teras{' '}
            </span>
            <span style={{ color: '#C8961A', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
              LA
            </span>
          </h1>
          <p
            className="text-xs font-semibold tracking-[0.3em] uppercase mt-1"
            style={{ color: 'rgba(200, 150, 26, 0.8)' }}
          >
            Admin Panel
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-8"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}
        >
          <h2 className="text-white text-xl font-bold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Selamat Datang
          </h2>
          <p className="text-white/60 text-sm mb-6">
            Masuk untuk mengakses panel admin
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-white/70 text-xs font-semibold uppercase tracking-wider block mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@terasla.id"
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              />
            </div>

            <div>
              <label className="text-white/70 text-xs font-semibold uppercase tracking-wider block mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              />
            </div>

            <div
              className="text-[11px] rounded-xl px-3 py-2.5 leading-relaxed"
              style={{
                background: 'rgba(200, 150, 26, 0.1)',
                border: '1px solid rgba(200, 150, 26, 0.2)',
                color: 'rgba(200, 150, 26, 0.9)',
              }}
            >
              <strong>Mode Dev:</strong> Login di-bypass. Klik <em>Masuk</em> dengan input apapun untuk akses dashboard.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, #C8961A 0%, #d6a425 100%)',
                color: 'white',
                fontFamily: "'Poppins', sans-serif",
                boxShadow: '0 4px 20px rgba(200, 150, 26, 0.35)',
              }}
            >
              {loading ? 'Memuat...' : 'Masuk'}
            </button>
          </form>
        </div>

        <p className="text-white/40 text-[11px] text-center mt-6">
          © 2026 Teras LA Lenteng Agung. Admin Access Only.
        </p>
      </div>
    </div>
  );
};

export default Login;
