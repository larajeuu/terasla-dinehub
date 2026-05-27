import useHomeData from './hooks/useHomeData';
import useQrLanding from './hooks/useQrLanding';
import HomeHeader from './components/HomeHeader';
import HomeBanner from './components/HomeBanner';
import HomeTabNav from './components/HomeTabNav';
import ProductSection from './components/ProductSection';
import TenantSection from './components/TenantSection';
import SearchBar from '../../components/SearchBar';
import CartBar from '../../components/CartBar';

const Home = () => {
  const { status: qrStatus } = useQrLanding();
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

      {qrStatus !== 'ok' && qrStatus !== 'pending' && (
        <div className="px-4 pt-3">
          <div
            className="rounded-lg px-3 py-2.5 text-[12px] leading-snug"
            style={{
              background: qrStatus === 'invalid' ? '#fef2f2' : '#fff7ed',
              color: qrStatus === 'invalid' ? '#b91c1c' : '#9a3412',
              border: `1px solid ${qrStatus === 'invalid' ? '#fecaca' : '#fed7aa'}`,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {qrStatus === 'invalid'
              ? 'QR meja tidak valid. Silakan scan ulang QR di meja Anda.'
              : 'Belum ada meja. Silakan scan QR di meja untuk mulai memesan.'}
          </div>
        </div>
      )}

      <HomeBanner banners={banners} />

      <SearchBar value={searchQuery} onChange={setSearchQuery} />

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
