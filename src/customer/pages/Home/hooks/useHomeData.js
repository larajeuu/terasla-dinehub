import { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../../../../services/productService';
import { getTenants } from '../../../../services/tenantService';
import { dummyBanners } from '../../../../data/dummy/banners';

const useHomeData = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [allTenants, setAllTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [activeTab, setActiveTab] = useState('produk');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [productsData, tenantsData] = await Promise.all([
        getProducts(),
        getTenants(),
      ]);
      setAllProducts(productsData);
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
      p.name.toLowerCase().includes(q) ||
      p.tenantName.toLowerCase().includes(q);
    const matchesCategory =
      activeCategory === 'Semua' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const tenants = allTenants.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  });

  return {
    banners: dummyBanners,
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
