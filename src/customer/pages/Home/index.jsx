import useHomeData from './hooks/useHomeData';
import HomeHeader from './components/HomeHeader';
import HomeBanner from './components/HomeBanner';
import HomeSearch from './components/HomeSearch';
import HomeTabNav from './components/HomeTabNav';
import ProductSection from './components/ProductSection';
import TenantSection from './components/TenantSection';
import CartBar from './components/CartBar';

const Home = () => {
  const {
    banners,
    products,
    tenants,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    activeTab,
    setActiveTab,
  } = useHomeData();

  return (
    <div
      className="min-h-screen pb-24"
      style={{ background: '#f9fafb', fontFamily: "'Inter', sans-serif" }}
    >
      <HomeHeader />

      <HomeBanner banners={banners} />

      <HomeSearch value={searchQuery} onChange={setSearchQuery} />

      <HomeTabNav activeTab={activeTab} onTabChange={setActiveTab} />

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
      ) : activeTab === 'produk' ? (
        <ProductSection
          products={products}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          loading={loading}
        />
      ) : (
        <TenantSection tenants={tenants} loading={loading} />
      )}

      <CartBar />
    </div>
  );
};

export default Home;
