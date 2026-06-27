import { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../../../../services/productService';
import { getTenants } from '../../../../services/tenantService';
import { getActiveBanners } from '../../../../services/bannerService';
import { dummyBanners } from '../../../../data/dummy/banners';
import { isMerchantOpen, isMerchantActive } from '../../../../shared/utils/merchant';

// Banner dari API memakai snake_case; HomeBanner memakai camelCase.
// Fallback gradien & aksen bila banner (mis. dibuat admin) tidak punya gambar
// maupun gaya gradien — supaya tampilan tetap rapi seperti dummy saat ini.
const DEFAULT_BG = 'linear-gradient(135deg, #1a3325 0%, #2d5a3d 50%, #1a3325 100%)';
const DEFAULT_ACCENT = '#C8961A';

const mapBanner = (b) => ({
  id: b.id,
  badge: b.badge,
  title: b.title,
  subtitle: b.subtitle,
  bg: b.bg || DEFAULT_BG,
  accentColor: b.accent_color || DEFAULT_ACCENT,
  image: b.image_url || null,
});

const useHomeData = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [allTenants, setAllTenants] = useState([]);
  const [banners, setBanners] = useState(dummyBanners);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [activeTab, setActiveTab] = useState('produk');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [productsData, tenantsData, bannersData] = await Promise.all([
        getProducts(),
        getTenants(),
        getActiveBanners().catch(() => []),
      ]);
      // Banner opsional — kalau API kosong/gagal, pakai dummy agar home tetap berisi.
      setBanners(bannersData?.length ? bannersData.map(mapBanner) : dummyBanners);
      // Response /products tidak menyertakan info merchant, jadi join manual
      // dengan daftar merchant untuk dapat nama & kategori tenant (dipakai
      // tampilan kartu produk dan filter kategori).
      const merchantById = new Map(tenantsData.map((t) => [t.id, t]));
      const enrichedProducts = productsData
        // Merchant yang tutup tidak boleh muncul di etalase pelanggan. Backend
        // sudah memfilter, ini lapisan tambahan (mis. mode dummy / data lama).
        // Sembunyikan produk dari merchant yang tutup/suspended dan produk yang
        // diblokir admin (is_banned). Backend sudah memfilter; ini lapisan
        // tambahan (mode dummy / data lama).
        .filter((p) => {
          if (p.is_banned) return false;
          const m = merchantById.get(p.merchant_id);
          // Kalau merchant tak ditemukan di daftar, biarkan tampil (jangan
          // sembunyikan produk hanya karena data merchant gagal dimuat).
          return !m || isMerchantOpen(m);
        })
        .map((p) => {
          const m = merchantById.get(p.merchant_id);
          return {
            ...p,
            merchant_nama: p.merchant_nama ?? m?.nama ?? null,
            merchant_category: p.merchant_category ?? m?.category ?? null,
          };
        });
      setAllProducts(enrichedProducts);
      setAllTenants(tenantsData);
    } catch (err) {
      setError(err.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const products = allProducts.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      (p.nama || '').toLowerCase().includes(q) ||
      (p.merchant_nama || '').toLowerCase().includes(q);
    const matchesCategory =
      activeCategory === 'Semua' || p.merchant_category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const tenants = allTenants
    // Merchant suspended/pending tidak boleh muncul sama sekali di etalase.
    .filter((t) => isMerchantActive(t))
    .filter((t) => {
      const q = searchQuery.toLowerCase();
      return (
        !q ||
        (t.nama || '').toLowerCase().includes(q) ||
        (t.category || '').toLowerCase().includes(q)
      );
    });

  return {
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
    refetch: fetchData,
  };
};

export default useHomeData;
