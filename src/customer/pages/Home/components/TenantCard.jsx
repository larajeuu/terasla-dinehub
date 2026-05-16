import { useNavigate } from 'react-router-dom';
import TenantIllustration from './TenantIllustration';

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const ClockIcon = ({ color = '#9ca3af', size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <path d="M12 7v5l3 2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TenantCard = ({ tenant }) => {
  const navigate = useNavigate();
  const accentColor = tenant.color || '#1D3A27';

  return (
    <button
      onClick={() => navigate(`/restaurant/${tenant.id}`)}
      className="w-full bg-white rounded-2xl p-4 text-left transition-all active:scale-[0.98]"
      style={{
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        border: '1px solid #f3f4f6',
      }}
    >
      <div className="flex gap-3">
        {/* Left: Info */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Name */}
          <h3
            className="text-base font-bold leading-tight mb-0.5 truncate"
            style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
            title={tenant.name}
          >
            {tenant.name}
          </h3>

          {/* Category */}
          <p
            className="text-xs text-gray-500 mb-2 truncate"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {tenant.category}
          </p>

          {/* Rating + Hours */}
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <div className="flex items-center gap-1">
              <StarIcon />
              <span
                className="text-sm font-bold text-gray-800"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {tenant.rating}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon />
              <span
                className="text-xs text-gray-500"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {tenant.openHours} WIB
              </span>
            </div>
          </div>

          {/* Featured product */}
          {tenant.featuredProduct && (
            <div className="mb-3">
              <p
                className="text-[10px] font-semibold tracking-wider text-gray-400 mb-1"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                PRODUK UNGGULAN
              </p>
              <span
                className="inline-block max-w-full text-xs font-medium px-2.5 py-1 rounded-full truncate"
                style={{
                  background: '#F5EDD9',
                  color: '#7c5a0f',
                  fontFamily: "'Inter', sans-serif",
                  maxWidth: '100%',
                }}
                title={tenant.featuredProduct}
              >
                {tenant.featuredProduct}
              </span>
            </div>
          )}

          {/* Bottom row: Block + Status */}
          <div className="flex items-center gap-2 mt-auto flex-wrap">
            <span
              className="text-white text-xs font-bold px-2.5 py-1 rounded-md shrink-0"
              style={{ background: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
            >
              {tenant.blockCode || tenant.block}
            </span>
            {tenant.isOpen ? (
              <span
                className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                style={{
                  color: '#16a34a',
                  border: '1px solid #86efac',
                  background: 'rgba(134,239,172,0.08)',
                  fontFamily: "'Inter', sans-serif",
                  fontStyle: 'italic',
                }}
              >
                <ClockIcon color="#16a34a" size={11} />
                Buka Sekarang
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                style={{
                  color: '#9ca3af',
                  border: '1px solid #e5e7eb',
                  fontFamily: "'Inter', sans-serif",
                  fontStyle: 'italic',
                }}
              >
                <ClockIcon color="#9ca3af" size={11} />
                Tutup
              </span>
            )}
          </div>
        </div>

        {/* Right: Illustration */}
        <div className="w-24 h-24 shrink-0">
          <TenantIllustration color={accentColor} />
        </div>
      </div>
    </button>
  );
};

export default TenantCard;
