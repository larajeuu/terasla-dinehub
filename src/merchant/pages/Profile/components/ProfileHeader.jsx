import { useNavigate } from 'react-router-dom';

const ProfileHeader = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center gap-3 px-4 py-4"
      style={{ background: '#1D3A27' }}
    >
      <button
        onClick={() => navigate(-1)}
        className="w-9 h-9 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(255,255,255,0.12)' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M15 18L9 12L15 6"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <h1
        className="text-lg font-bold text-white"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Edit Profil
      </h1>
    </div>
  );
};

export default ProfileHeader;