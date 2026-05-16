import TenantIllustration from '../../Home/components/TenantIllustration';
import { StarIcon, ClockIcon } from '../../../../shared/components/icons';

const RestaurantInfo = ({ tenant }) => {
  if (!tenant) return null;
  const accentColor = tenant.color || '#1D3A27';

  return (
    <section className="mx-4 mt-4 bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f3f4f6' }}>
      <div className="flex gap-3">
        <div className="flex-1 min-w-0 flex flex-col">
          <h2
            className="text-lg font-bold leading-tight mb-0.5"
            style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
          >
            {tenant.name}
          </h2>
          <p
            className="text-xs text-gray-500 mb-2"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {tenant.category}
          </p>

          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <div className="flex items-center gap-1">
              <StarIcon size={14} />
              <span
                className="text-sm font-bold text-gray-800"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {tenant.rating}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon size={13} />
              <span
                className="text-xs text-gray-500"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {tenant.openHours} WIB
              </span>
            </div>
          </div>
        </div>

        <div className="w-24 h-24 shrink-0">
          <TenantIllustration color={accentColor} />
        </div>
      </div>

      <div className="mt-3 pt-3 flex items-center gap-2 border-t border-gray-100">
        <span
          className="text-white text-xs font-bold px-2.5 py-1 rounded-md shrink-0 tracking-wide"
          style={{ background: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
        >
          {tenant.blockCode || tenant.block}
        </span>
        {tenant.isOpen ? (
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
      </div>
    </section>
  );
};

export default RestaurantInfo;
