import { useState } from 'react';
import KeuanganHeader from './components/KeuanganHeader';
import StoreStatusCard from './components/StoreStatusCard';
import SalesSummary from './components/SalesSummary';
import SalesChart from './components/SalesChart';
import TransactionList from './components/TransactionList';
import BottomNavbar from '../../components/BottomNavbar';

const transactionData = [
  { id: 'ORD-0005', name: 'Budi Santoso', amount: 32500, type: 'masuk', time: '12:10', date: 'Hari ini' },
  { id: 'ORD-0004', name: 'Siti Rahma', amount: 49000, type: 'masuk', time: '11:45', date: 'Hari ini' },
  { id: 'ORD-0003', name: 'Andi Wijaya', amount: 89000, type: 'masuk', time: '10:20', date: 'Hari ini' },
  { id: 'TRF-001', name: 'Pencairan Dana', amount: 500000, type: 'keluar', time: '09:00', date: 'Kemarin' },
  { id: 'ORD-0002', name: 'Rina Dewi', amount: 55500, type: 'masuk', time: '08:30', date: 'Kemarin' },
  { id: 'ORD-0001', name: 'Doni Pratama', amount: 15000, type: 'masuk', time: '08:00', date: 'Kemarin' },
];

const weeklyData = [
  { day: 'Sen', value: 120000 },
  { day: 'Sel', value: 85000 },
  { day: 'Rab', value: 175000 },
  { day: 'Kam', value: 95000 },
  { day: 'Jum', value: 210000 },
  { day: 'Sab', value: 320000 },
  { day: 'Min', value: 245000 },
];

const KontrolPage = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col pb-20" style={{ background: '#f5f5f5' }}>
      <KeuanganHeader saldo={1247500} />

      <div className="flex-1 px-4 pt-4 flex flex-col gap-4">
        <StoreStatusCard
          tokoName="Gorengan Bu Ami"
          lokasi="Blok A3 · Makanan"
          isOpen={isOpen}
          onToggle={() => setIsOpen((prev) => !prev)}
        />
        <SalesSummary
          totalOrder={24}
          totalPendapatan={1247500}
          produkTerlaris="Thai Tea Original"
        />
        <SalesChart data={weeklyData} />
        <TransactionList transactions={transactionData} />
      </div>

      <BottomNavbar />
    </div>
  );
};

export default KontrolPage;