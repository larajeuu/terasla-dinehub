import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/authStore';
import { getMerchantBalance } from '../../../services/withdrawalService';
import { getMerchantById } from '../../../services/merchantService';
import { getMerchantOrders } from '../../../services/merchantOrderService';
import KeuanganHeader from './components/KeuanganHeader';
import StoreStatusCard from './components/StoreStatusCard';
import SalesSummary from './components/SalesSummary';
import SalesChart from './components/SalesChart';
import TransactionList from './components/TransactionList';
import BottomNavbar from '../../components/BottomNavbar';

// Jam operasional otomatis: 08.00–22.00 weekday, 08.00–23.59 weekend
const autoIsOpen = () => {
  const now = new Date();
  const day = now.getDay(); // 0 = Minggu, 6 = Sabtu
  const totalMinutes = now.getHours() * 60 + now.getMinutes();
  const openTime = 8 * 60;
  const closeTime = (day === 0 || day === 6) ? 23 * 60 + 59 : 22 * 60;
  return totalMinutes >= openTime && totalMinutes <= closeTime;
};

const formatLastUpdated = () => {
  const now = new Date();
  return now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

const KontrolPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [saldo, setSaldo] = useState(0);
  const [lastUpdated, setLastUpdated] = useState('');
  const [merchantInfo, setMerchantInfo] = useState({ nama: user?.name || '', block: '', category: '' });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toggle buka/tutup: default dari jadwal otomatis, bisa di-override manual
  const [isOpen, setIsOpen] = useState(autoIsOpen);

  useEffect(() => {
    if (!user?.merchantId) return;
    let cancelled = false;

    const load = async () => {
      try {
        const [balanceRes, merchantRes, ordersRes] = await Promise.allSettled([
          getMerchantBalance(),
          getMerchantById(user.merchantId),
          getMerchantOrders(user.merchantId),
        ]);
        if (cancelled) return;

        if (merchantRes.status === 'fulfilled') {
          const m = merchantRes.value;
          // Prioritaskan /tenant-balance/me, fallback ke merchant.balance
          const saldoValue = balanceRes.status === 'fulfilled'
            ? balanceRes.value
            : (m?.balance ?? 0);
          setSaldo(saldoValue);
          setLastUpdated(formatLastUpdated());
          setMerchantInfo({
            nama: m?.name || user?.name || '',
            block: m?.block || '',
            category: m?.category || '',
          });
        }
        if (ordersRes.status === 'fulfilled') {
          setOrders(ordersRes.value);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [user?.merchantId]);

  // Hitung ringkasan hari ini dari order
  const todayOrders = orders.filter((o) => {
    if (!o.date) return false;
    const d = new Date(o.date);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  });

  const totalOrder = todayOrders.length || orders.length;
  const totalPendapatan = (todayOrders.length ? todayOrders : orders)
    .reduce((sum, o) => sum + (o.total || 0), 0);

  // Produk terlaris dari semua order (parse item strings seperti "2x Nasi Goreng")
  const itemCount = {};
  orders.forEach((o) => {
    (o.items || []).forEach((item) => {
      const name = String(item).replace(/^\d+x\s*/i, '').trim();
      if (name) itemCount[name] = (itemCount[name] || 0) + 1;
    });
  });
  const produkTerlaris = Object.entries(itemCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

  // Chart: 7 hari terakhir dari orders
  const weeklyData = (() => {
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const buckets = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      buckets[d.toDateString()] = { day: days[d.getDay()], value: 0 };
    }
    orders.forEach((o) => {
      const key = o.date ? new Date(o.date).toDateString() : null;
      if (key && buckets[key]) buckets[key].value += o.total || 0;
    });
    return Object.values(buckets);
  })();

  // Riwayat transaksi (masuk saja, dari orders) untuk preview di dashboard
  const transactionData = orders.slice(0, 10).map((o) => ({
    id: o.orderCode || o.id,
    name: o.customerName || 'Pelanggan',
    amount: o.total || 0,
    type: 'masuk',
    time: o.time || '-',
    date: o.date
      ? (() => {
          const d = new Date(o.date);
          const today = new Date();
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          if (d.toDateString() === today.toDateString()) return 'Hari ini';
          if (d.toDateString() === yesterday.toDateString()) return 'Kemarin';
          return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        })()
      : '-',
  }));

  const tokoName = merchantInfo.nama;
  const lokasi = [merchantInfo.block, merchantInfo.category].filter(Boolean).join(' · ');

  return (
    <div className="min-h-screen flex flex-col pb-20" style={{ background: '#f5f5f5' }}>
      <KeuanganHeader
        saldo={saldo}
        lastUpdated={lastUpdated}
        onCairkan={() => navigate('/merchant/kontrol/pencairan', { state: { saldo } })}
      />

      <div className="flex-1 px-4 pt-4 flex flex-col gap-4">
        <StoreStatusCard
          tokoName={tokoName}
          lokasi={lokasi}
          isOpen={isOpen}
          onToggle={() => setIsOpen((prev) => !prev)}
        />
        <SalesSummary
          totalOrder={loading ? '-' : totalOrder}
          totalPendapatan={loading ? 0 : totalPendapatan}
          produkTerlaris={loading ? '-' : produkTerlaris}
        />
        <SalesChart data={weeklyData} />
        <TransactionList
          transactions={transactionData}
          onLihatSemua={() => navigate('/merchant/kontrol/riwayat')}
        />
      </div>

      <BottomNavbar />
    </div>
  );
};

export default KontrolPage;