import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import usePaymentStore from '../../../store/paymentStore';
import { getPaymentMethods } from '../../../services/paymentMethodService';
import PaymentHeader from './components/PaymentHeader';
import PaymentSection from './components/PaymentSection';

const GROUP_LABEL = 'Metode Pembayaran';

// Petakan nama metode (bebas, dari BE) ke key ikon brand yang tersedia.
const brandFromName = (nama = '') => {
  const n = nama.toLowerCase();
  if (n.includes('qris')) return 'qris';
  if (n.includes('tunai') || n.includes('cash')) return 'cash';
  if (n.includes('bca')) return 'bca';
  if (n.includes('bni')) return 'bni';
  if (n.includes('mandiri')) return 'mandiri';
  return undefined;
};

const Payment = () => {
  const navigate = useNavigate();
  const selectedMethod = usePaymentStore((s) => s.selectedMethod);
  const setSelectedMethod = usePaymentStore((s) => s.setSelectedMethod);

  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draftId, setDraftId] = useState(selectedMethod?.id ?? null);

  const fetchMethods = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPaymentMethods();
      const opts = (data || [])
        .filter((m) => m.is_active)
        .map((m) => ({
          id: m.id,
          label: m.nama_metode,
          description: m.fee ? `Fee ${m.fee}` : 'Tanpa biaya tambahan',
          brand: brandFromName(m.nama_metode),
        }));
      setOptions(opts);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Gagal memuat metode pembayaran');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMethods(); }, [fetchMethods]);

  const handleSelectDraft = (option) => setDraftId(option.id);

  const handleConfirm = () => {
    if (draftId == null) return;
    const found = options.find((o) => o.id === draftId);
    if (found) {
      // id = metode_pembayaran_id yang dikirim ke BE saat membuat order.
      setSelectedMethod({ ...found, groupLabel: GROUP_LABEL });
    }
    navigate(-1);
  };

  const group = { id: 'all', label: GROUP_LABEL, options };

  return (
    <div
      className="min-h-screen pb-28"
      style={{ background: '#f9fafb', fontFamily: "'Inter', sans-serif" }}
    >
      <PaymentHeader />

      <div className="pt-2">
        {loading && (
          <p className="text-center text-gray-400 text-sm py-12">Memuat metode pembayaran...</p>
        )}

        {error && !loading && (
          <div className="text-center py-12 px-4">
            <p className="text-red-500 text-sm mb-3">{error}</p>
            <button
              onClick={fetchMethods}
              className="text-sm font-semibold px-4 py-2 rounded-lg text-white"
              style={{ background: '#1D3A27' }}
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!loading && !error && options.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-12">Belum ada metode pembayaran aktif.</p>
        )}

        {!loading && !error && options.length > 0 && (
          <PaymentSection group={group} selectedId={draftId} onSelect={handleSelectDraft} />
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-3 pointer-events-none">
        <div
          className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(249,250,251,0.95) 30%, rgba(249,250,251,0))',
          }}
        />
        <button
          onClick={handleConfirm}
          disabled={draftId == null}
          className="pointer-events-auto relative w-full py-3.5 rounded-2xl text-white text-sm font-bold transition-all active:scale-[0.98] hover:brightness-110 disabled:opacity-50 disabled:active:scale-100"
          style={{
            background:
              'linear-gradient(135deg, #2d5a3d 0%, #1D3A27 50%, #15291c 100%)',
            boxShadow:
              '0 10px 28px -8px rgba(29,58,39,0.45), 0 4px 12px -2px rgba(0,0,0,0.18)',
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Pilih Metode Ini
        </button>
      </div>
    </div>
  );
};

export default Payment;
