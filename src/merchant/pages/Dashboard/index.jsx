import { useState, useEffect, useCallback } from 'react';
import useAuthStore from '../../../store/authStore';
import { getMerchantOrders, updateMerchantOrderStatus } from '../../../services/merchantOrderService';
import { getMerchantById } from '../../../services/merchantService';
import DashboardHeader from './components/DashboardHeader';
import OrderSearch from './components/OrderSearch';
import OrderTabs from './components/OrderTabs';
import OrderCard from './components/OrderCard';
import OrderDetail from './components/OrderDetail';
import BottomNavbar from '../../components/BottomNavbar';

const isToday = (dateStr) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
};

const Dashboard = () => {
  const user = useAuthStore((s) => s.user);
  const merchantId = user?.merchantId;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [merchantInfo, setMerchantInfo] = useState({ block: '', category: '' });
  const [activeTab, setActiveTab] = useState('Semua');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    if (!merchantId) return;
    try {
      const data = await getMerchantOrders(merchantId);
      setOrders(data);
    } catch (err) {
      console.error('Gagal memuat pesanan:', err);
    }
  }, [merchantId]);

  useEffect(() => {
    if (!merchantId) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try { await fetchOrders(); }
      finally { if (!cancelled) setLoading(false); }
    };
    load();
    return () => { cancelled = true; };
  }, [merchantId, fetchOrders]);

  // Polling ringan: pesanan yang baru dibayar (jadi 'terbuka') & pembatalan
  // otomatis akibat timeout muncul tanpa perlu reload manual.
  useEffect(() => {
    if (!merchantId) return undefined;
    const t = setInterval(fetchOrders, 10000);
    return () => clearInterval(t);
  }, [merchantId, fetchOrders]);

  useEffect(() => {
    if (!merchantId) return;
    getMerchantById(merchantId)
      .then((m) => setMerchantInfo({ block: m.block || '', category: m.category || '' }))
      .catch(() => {});
  }, [merchantId]);

  const updateStatus = async (id, newStatus) => {
    const order = orders.find((o) => o.id === id);
    if (!order) return;

    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    setSelectedOrder(null);

    try {
      await updateMerchantOrderStatus(order.dbId, newStatus);
    } catch (err) {
      console.error('Gagal update status:', err);
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: order.status } : o))
      );
    }
  };

  const filteredOrders = orders
    .filter((o) => activeTab === 'Semua' || o.status === activeTab)
    .filter(
      (o) =>
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        (o.customerName || '').toLowerCase().includes(search.toLowerCase())
    );

  const countByStatus = (status) => orders.filter((o) => o.status === status).length;

  const todayOrders = orders.filter((o) => isToday(o.date));
  const todayPesananBaru = todayOrders.filter((o) => o.status === 'Perlu Diproses').length;
  const todayDiproses = todayOrders.filter((o) => o.status === 'Diproses').length;
  const todayPendapatan = todayOrders
    .filter((o) => o.status === 'Selesai')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const tokoName = user?.name || 'Merchant';
  const lokasi = [merchantInfo.block, merchantInfo.category].filter(Boolean).join(' · ') || 'Blok Tenant';

  return (
    <div className="min-h-screen flex flex-col pb-20" style={{ background: '#f5f5f5' }}>
      <DashboardHeader
        tokoName={tokoName}
        lokasi={lokasi}
        pendapatan={todayPendapatan}
        pesananBaru={todayPesananBaru}
        diproses={todayDiproses}
      />

      <div className="flex-1 px-4 pt-4 pb-6 flex flex-col gap-3">
        {loading ? (
          <p
            className="text-center text-sm text-gray-400 mt-8"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Memuat pesanan...
          </p>
        ) : (
          <>
            <OrderSearch search={search} onSearch={setSearch} />

            <OrderTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              counts={{
                'Perlu Diproses': countByStatus('Perlu Diproses'),
                Diproses: countByStatus('Diproses'),
                'Menunggu Konfirmasi': countByStatus('Menunggu Konfirmasi'),
                Selesai: countByStatus('Selesai'),
              }}
            />

            <div className="flex flex-col gap-3">
              {filteredOrders.length === 0 ? (
                <p
                  className="text-center text-sm text-gray-400 mt-8"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Tidak ada pesanan
                </p>
              ) : (
                filteredOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onClick={() => setSelectedOrder(order)}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>

      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={updateStatus}
        />
      )}

      <BottomNavbar notifCount={countByStatus('Perlu Diproses')} />
    </div>
  );
};

export default Dashboard;
