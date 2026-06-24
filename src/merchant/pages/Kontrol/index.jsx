import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/authStore';
import { getMerchantBalance } from '../../../services/withdrawalService';
import { updateStoreOpenStatus } from '../../../services/merchantService';
import { getMerchantDashboard } from '../../../services/merchantOrderService';
import KeuanganHeader from './components/KeuanganHeader';
import StoreStatusCard from './components/StoreStatusCard';
import SalesSummary from './components/SalesSummary';
import SalesChart from './components/SalesChart';
import TransactionList from './components/TransactionList';
import BottomNavbar from '../../components/BottomNavbar';

const formatLastUpdated = () => {
  const now = new Date();
  return now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

const EMPTY_DASH = {
  isOpen: true,
  tokoName: '',
  lokasi: '',
  totalOrder: 0,
  totalPendapatan: 0,
  produkTerlaris: '-',
  weeklyData: [],
  transactions: [],
};

const KontrolPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [saldo, setSaldo] = useState(0);
  const [lastUpdated, setLastUpdated] = useState('');
  // Ringkasan dihitung di backend (/merchant-orders/summary) agar pesanan
  // dibatalkan TIDAK ikut dihitung sebagai pendapatan/transaksi.
  const [dash, setDash] = useState(EMPTY_DASH);
  const [loading, setLoading] = useState(true);

  // Status buka/tutup toko diambil dari backend (merchant.is_open), bukan jadwal lokal.
  const [isOpen, setIsOpen] = useState(true);
  const [togglingOpen, setTogglingOpen] = useState(false);

  useEffect(() => {
    if (!user?.merchantId) return;
    let cancelled = false;

    const load = async () => {
      try {
        const [balanceRes, dashRes] = await Promise.allSettled([
          getMerchantBalance(),
          getMerchantDashboard(),
        ]);
        if (cancelled) return;

        if (dashRes.status === 'fulfilled') {
          const d = dashRes.value;
          setDash(d);
          setIsOpen(d.isOpen);
          // Saldo: utamakan /tenant-balance/me (saldo tersedia), fallback ke ringkasan.
          setSaldo(balanceRes.status === 'fulfilled' ? balanceRes.value : (d.saldo ?? 0));
          setLastUpdated(formatLastUpdated());
        } else if (balanceRes.status === 'fulfilled') {
          setSaldo(balanceRes.value);
          setLastUpdated(formatLastUpdated());
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [user?.merchantId]);

  // Toggle buka/tutup → persist ke backend (PUT /merchants/me). Optimistic + rollback.
  const handleToggleOpen = async () => {
    if (togglingOpen) return;
    const next = !isOpen;
    setIsOpen(next);
    setTogglingOpen(true);
    try {
      await updateStoreOpenStatus(user.merchantId, next);
    } catch {
      setIsOpen(!next); // gagal → kembalikan
    } finally {
      setTogglingOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-20" style={{ background: '#f5f5f5' }}>
      <KeuanganHeader
        saldo={saldo}
        lastUpdated={lastUpdated}
        onCairkan={() => navigate('/merchant/kontrol/pencairan', { state: { saldo } })}
      />

      <div className="flex-1 px-4 pt-4 flex flex-col gap-4">
        <StoreStatusCard
          tokoName={dash.tokoName || user?.name || ''}
          lokasi={dash.lokasi}
          isOpen={isOpen}
          onToggle={handleToggleOpen}
        />
        <SalesSummary
          totalOrder={loading ? '-' : dash.totalOrder}
          totalPendapatan={loading ? 0 : dash.totalPendapatan}
          produkTerlaris={loading ? '-' : dash.produkTerlaris}
        />
        <SalesChart data={dash.weeklyData} />
        <TransactionList
          transactions={dash.transactions}
          onLihatSemua={() => navigate('/merchant/kontrol/riwayat')}
        />
      </div>

      <BottomNavbar />
    </div>
  );
};

export default KontrolPage;
