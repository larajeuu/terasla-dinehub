import { useState, useEffect, useCallback } from 'react';
import { getTenantById } from '../../../../services/tenantService';
import { getProducts } from '../../../../services/productService';

const useTenantData = (tenantId) => {
  const [tenant, setTenant] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = useCallback(async () => {
    if (!tenantId) return;
    try {
      setLoading(true);
      setError(null);
      const [tenantData, productsData] = await Promise.all([
        getTenantById(tenantId),
        getProducts({ tenantId }),
      ]);
      if (!tenantData) {
        setError('Tenant tidak ditemukan');
      }
      setTenant(tenantData);
      setProducts(productsData);
    } catch (err) {
      setError(err.message || 'Gagal memuat data tenant');
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    return !q || p.name.toLowerCase().includes(q);
  });

  return {
    tenant,
    products: filteredProducts,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    refetch: fetchData,
  };
};

export default useTenantData;
