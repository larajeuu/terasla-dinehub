import { useState, useEffect, useRef } from 'react';
import useHomeData from './hooks/useHomeData';
import useQrLanding from './hooks/useQrLanding';
import HomeHeader from './components/HomeHeader';
import HomeBanner from './components/HomeBanner';
import HomeTabNav from './components/HomeTabNav';
import ProductSection from './components/ProductSection';
import TenantSection from './components/TenantSection';
import SearchBar from '../../components/SearchBar';
import CartBar from '../../components/CartBar';
import ScanQrModal from '../Cart/components/ScanQrModal';

// QR meja bermasalah → tampilkan banner & buka tutorial scan.
const isBadQr = (s) => s === 'invalid' || s === 'expired';

const Home = () => {
  const { status: qrStatus } = useQrLanding();
  const [scanOpen, setScanOpen] = useState(false);
  const autoOpenedRef = useRef(false);

  // Auto-buka tutorial scan sekali saat QR tidak valid/kadaluarsa.
  useEffect(() => {
    if (isBadQr(qrStatus) && !autoOpenedRef.current) {
      autoOpenedRef.current = true;
      setScanOpen(true);
    }
  }, [qrStatus]);
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
              background: isBadQr(qrStatus) ? '#fef2f2' : '#fff7ed',
              color: isBadQr(qrStatus) ? '#b91c1c' : '#9a3412',
              border: `1px solid ${isBadQr(qrStatus) ? '#fecaca' : '#fed7aa'}`,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {isBadQr(qrStatus)
              ? 'Kode QR meja tidak valid atau sudah kadaluarsa. Silakan hubungi admin, atau scan ulang QR yang tertempel di meja.'
              : 'Belum ada meja. Silakan scan QR di meja untuk mulai memesan.'}
            <button
              onClick={() => setScanOpen(true)}
              className="mt-1.5 block font-semibold underline"
              style={{ color: isBadQr(qrStatus) ? '#b91c1c' : '#9a3412' }}
            >
              {isBadQr(qrStatus) ? 'Lihat cara scan / Scan ulang' : 'Cara scan QR'}
            </button>
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

      <ScanQrModal open={scanOpen} onClose={() => setScanOpen(false)} />
    </div>
  );
};

export default Home;
