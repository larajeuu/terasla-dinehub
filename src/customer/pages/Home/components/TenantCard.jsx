import { useNavigate } from 'react-router-dom';
import TenantIllustration from './TenantIllustration';
import { StarIcon, ClockIcon } from '../../../../shared/components/icons';

const TenantCard = ({ tenant }) => {
  const navigate = useNavigate();
  const accentColor = '#1D3A27';
  const isOpen = tenant.status === 'active';

  return (
    <button
      onClick={() => navigate(`/restaurant/${tenant.id}`)}
      className="w-full bg-white rounded-2xl p-4 text-left transition-all active:scale-[0.98] hover:shadow-md"
      style={{
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        border: '1px solid #f3f4f6',
      }}
    >
      {/* Top: Info + Illustration */}
      <div className="flex gap-3">
        {/* Left: Info */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Name */}
          <h3
            className="text-base font-bold leading-tight mb-0.5 truncate"
            style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
            title={tenant.nama}
          >
            {tenant.nama}
          </h3>

          {/* Category */}
          <p
            className="text-xs text-gray-500 mb-2 truncate"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {tenant.category}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <div className="flex items-center gap-1">
              <StarIcon size={14} />
              <span
                className="text-sm font-bold text-gray-800"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {tenant.rating}
              </span>
            </div>
          </div>

          {/* Owner */}
          {tenant.owner && (
            <div>
              <p
                className="text-[10px] font-semibold tracking-wider text-gray-400 mb-1"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                PEMILIK
              </p>
              <span
                className="inline-block max-w-full text-xs font-medium px-2.5 py-1 rounded-full truncate"
                style={{
                  background: '#F5EDD9',
                  color: '#7c5a0f',
                  fontFamily: "'Inter', sans-serif",
                  maxWidth: '100%',
                }}
                title={tenant.owner}
              >
                {tenant.owner}
              </span>
            </div>
          )}
        </div>

        {/* Right: Illustration */}
        <div className="w-24 h-24 shrink-0">
          <TenantIllustration color={accentColor} />
        </div>
      </div>

      {/* Bottom row — full width, always row (does NOT wrap to column) */}
      <div className="mt-3 pt-3 flex items-center gap-2 border-t border-gray-100">
        <span
          className="text-white text-xs font-bold px-2.5 py-1 rounded-md shrink-0 tracking-wide"
          style={{ background: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
        >
          {tenant.block}
        </span>

        {isOpen ? (
          <span
            className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full shrink-0"
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
            className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full shrink-0"
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

        {/* Spacer + chevron, takes remaining space without breaking row */}
        <span className="flex-1" />
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
          <path d="M9 6l6 6-6 6" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </button>
  );
};

export default TenantCard;
