import { useNavigate } from 'react-router-dom';

const MenuAkun = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl mt-4 overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      <button
        onClick={() => navigate('/merchant/profile')}
        className="w-full flex items-center justify-between px-4 py-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#e8f5e4' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="#2d5a27" strokeWidth="1.8" />
              <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" stroke="#2d5a27" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>

          <div className="text-left">
            <p className="text-sm font-semibold text-gray-800">Profil</p>
            <p className="text-xs text-gray-400">Ubah data tenant dan akun</p>
          </div>
        </div>

        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M9 6L15 12L9 18" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
};

export default MenuAkun;