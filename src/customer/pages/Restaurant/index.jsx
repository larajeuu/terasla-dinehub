import { useParams } from 'react-router-dom';
import useTenantData from './hooks/useTenantData';
import RestaurantHeader from './components/RestaurantHeader';
import RestaurantInfo from './components/RestaurantInfo';
import SearchBar from '../../components/SearchBar';
import ProductCard from '../../components/ProductCard';
import CartBar from '../../components/CartBar';

const Restaurant = () => {
  const { id } = useParams();
  const {
    tenant,
    products,
    loading,
    error,
    searchQuery,
    setSearchQuery,
  } = useTenantData(id);

  return (
    <div
      className="min-h-screen pb-24"
      style={{ background: '#f9fafb', fontFamily: "'Inter', sans-serif" }}
    >
      <RestaurantHeader title={tenant?.name} />

      {error ? (
        <div className="text-center py-12 px-4">
          <p className="text-red-500 text-sm mb-3">{error}</p>
          <button
            className="text-sm font-semibold px-4 py-2 rounded-lg text-white"
            style={{ background: '#1D3A27' }}
            onClick={() => window.location.reload()}
          >
            Coba Lagi
          </button>
        </div>
      ) : (
        <>
          {loading && !tenant ? (
            <div className="mx-4 mt-4 bg-white rounded-2xl p-4 animate-pulse" style={{ height: 160 }} />
          ) : (
            <RestaurantInfo tenant={tenant} />
          )}

          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={`Cari produk di ${tenant?.name || 'tenant'}...`}
          />

          <div className="mt-5 px-4">
            <h2
              className="text-base font-bold text-gray-900 mb-3"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Menu Produk
            </h2>

            {loading ? (
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-28 bg-gray-200" />
                    <div className="p-2.5 bg-white space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-7 bg-gray-200 rounded-lg mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">
                {searchQuery
                  ? `Tidak ada produk cocok dengan "${searchQuery}"`
                  : 'Tenant ini belum memiliki produk.'}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showTenant={false}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <CartBar />
    </div>
  );
};

export default Restaurant;
