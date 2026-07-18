import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getPaymentStatus, simulatePaid } from '../../../services/paymentService';
import PendingPayment from './components/PendingPayment';
import SuccessView from './components/SuccessView';

const PaymentStatus = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [charge, setCharge] = useState(location.state?.charge || null);
  const [loading, setLoading] = useState(!location.state?.charge);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const data = await getPaymentStatus(token);
      setCharge(data);
      setError(null);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Gagal memuat status pembayaran');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Muat awal jika tidak ada state dari navigasi.
  useEffect(() => {
    if (!charge) refresh();
  }, [charge, refresh]);

  // Auto-poll selama masih pending (di gateway asli, webhook yang men-trigger;
  // polling ini sekaligus rekonsiliasi bila webhook gagal).
  useEffect(() => {
    if (!charge || charge.status === 'lunas' || charge.status === 'gagal') return undefined;
    const t = setInterval(refresh, 3000);
    return () => clearInterval(t);
  }, [charge, refresh]);

  const handleSimulate = async () => {
    try {
      const data = await simulatePaid(token);
      setCharge(data);
    } catch (err) {
      alert(err?.response?.data?.detail || 'Gagal menandai pembayaran');
    }
  };

  const wrap = (children) => (
    <div className="min-h-screen flex flex-col" style={{ background: '#1f2421', fontFamily: "'Inter', sans-serif" }}>
      <div className="px-5 pt-6 pb-3">
        <h1 className="text-sm font-semibold text-gray-300" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Metode Pembayaran
        </h1>
      </div>
      <div className="flex-1 px-4 pb-6">{children}</div>
    </div>
  );

  if (loading) {
    return wrap(<p className="text-center text-gray-400 text-sm py-16">Memuat status pembayaran...</p>);
  }

  if (error && !charge) {
    return wrap(
      <div className="text-center py-16">
        <p className="text-red-400 text-sm mb-3">{error}</p>
        <button onClick={refresh} className="text-sm font-semibold px-4 py-2 rounded-lg text-white" style={{ background: '#1D3A27' }}>
          Coba Lagi
        </button>
      </div>
    );
  }

  // Gateway asli: transaksi bisa kedaluwarsa/gagal (EXPIRED/FAILED dari Tripay).
  // Beri jalan keluar: charge ulang order yang sama dengan metode lain.
  if (charge.status === 'gagal') {
    return wrap(
      <div className="bg-white rounded-3xl mx-auto max-w-sm p-6 text-center" style={{ boxShadow: '0 12px 32px -8px rgba(0,0,0,0.3)' }}>
        <p className="text-[11px] uppercase tracking-wider text-red-500 font-semibold mb-1">Status Pembayaran</p>
        <p className="text-base font-bold mb-2" style={{ color: '#dc2626', fontFamily: "'Poppins', sans-serif" }}>
          Pembayaran Gagal / Kedaluwarsa
        </p>
        <p className="text-xs text-gray-500 mb-5 leading-snug">
          Transaksi ini tidak dapat dilanjutkan. Silakan buat pembayaran baru untuk pesanan yang sama.
        </p>
        <button
          onClick={() => navigate('/payment', { state: { rechargeOrderId: charge.order_id } })}
          className="w-full py-3 rounded-xl text-white text-sm font-bold"
          style={{ background: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
        >
          Coba Bayar Lagi
        </button>
      </div>
    );
  }

  if (charge.status === 'lunas') {
    return wrap(
      <SuccessView
        charge={charge}
        onHome={() => navigate('/')}
        onSummary={() => navigate(`/payment/status/${token}/ringkasan`)}
      />
    );
  }

  return wrap(
    <PendingPayment
      charge={charge}
      onCheck={refresh}
      onChangeMethod={() => navigate('/payment', { state: { rechargeOrderId: charge.order_id } })}
      onSimulate={handleSimulate}
    />
  );
};

export default PaymentStatus;
