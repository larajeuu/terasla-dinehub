import { useState } from 'react';
import DashboardHeader from './components/DashboardHeader';
import OrderSearch from './components/OrderSearch';
import OrderTabs from './components/OrderTabs';
import OrderCard from './components/OrderCard';
import OrderDetail from './components/OrderDetail';

export const ordersData = [
  {
    id: 'ORD-0005',
    time: '12:10',
    type: 'Dine In',
    customerName: 'Budi Santoso',
    items: ['2x Nasi Goreng Spesial', '1x Bakmi Jawa'],
    total: 32500,
    payment: 'QRIS',
    status: 'Baru',
  },
  {
    id: 'ORD-0004',
    time: '12:10',
    type: 'Dine In',
    customerName: 'Siti Rahma',
    items: ['2x Nasi Goreng Spesial', '1x Bakmi Jawa'],
    total: 49000,
    payment: 'QRIS',
    status: 'Baru',
  },
  {
    id: 'ORD-0003',
    time: '12:10',
    type: 'Dine In',
    customerName: 'Andi Wijaya',
    items: ['2x Nasi Goreng Spesial', '1x Bakmi Jawa'],
    total: 89000,
    payment: 'QRIS',
    status: 'Diproses',
  },
  {
    id: 'ORD-0002',
    time: '12:10',
    type: 'Dine In',
    customerName: 'Rina Dewi',
    items: ['2x Nasi Goreng Spesial', '1x Bakmi Jawa'],
    total: 55500,
    payment: 'QRIS',
    status: 'Selesai',
  },
  {
    id: 'ORD-0001',
    time: '12:10',
    type: 'Dine In',
    customerName: 'Doni Pratama',
    items: ['2x Nasi Goreng Spesial', '1x Bakmi Jawa'],
    total: 15000,
    payment: 'QRIS',
    status: 'Dibatalkan',
  },
];

const Dashboard = () => {
  const [orders, setOrders] = useState(ordersData);
  const [activeTab, setActiveTab] = useState('Semua');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const updateStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    setSelectedOrder(null);
  };

  const filteredOrders = orders
    .filter((o) => activeTab === 'Semua' || o.status === activeTab)
    .filter((o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase())
    );

  const countByStatus = (status) => orders.filter((o) => o.status === status).length;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f5f5f5' }}>
      <DashboardHeader
        tokoName="Kantin Ea Ea"
        lokasi="Blok E9 · Makanan"
        pendapatan={127500}
        pesananBaru={countByStatus('Baru')}
        diproses={countByStatus('Diproses')}
      />

      <div className="flex-1 px-4 pt-4 pb-6 flex flex-col gap-3">
        <OrderSearch search={search} onSearch={setSearch} />
        <OrderTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={{
            Baru: countByStatus('Baru'),
            Diproses: countByStatus('Diproses'),
            Selesai: countByStatus('Selesai'),
          }}
        />

        <div className="flex flex-col gap-3">
          {filteredOrders.length === 0 ? (
            <p className="text-center text-sm text-gray-400 mt-8" style={{ fontFamily: "'Inter', sans-serif" }}>
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
      </div>

      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={updateStatus}
        />
      )}
    </div>
  );
};

export default Dashboard;