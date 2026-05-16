import TenantCard from './TenantCard';

const TenantSection = ({ tenants, loading }) => {
  return (
    <div className="mt-4 px-4">
      <h2
        className="text-base font-bold text-gray-900 mb-3"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Semua Tenant
      </h2>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 bg-white rounded-2xl p-3 animate-pulse">
              <div className="w-16 h-16 rounded-xl bg-gray-200 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : tenants.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
          Tenant tidak ditemukan
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {tenants.map((tenant) => (
            <TenantCard key={tenant.id} tenant={tenant} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TenantSection;
