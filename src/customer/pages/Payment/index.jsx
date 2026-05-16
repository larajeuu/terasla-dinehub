import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import usePaymentStore from '../../../store/paymentStore';
import { paymentGroups } from '../../../data/paymentMethods';
import PaymentHeader from './components/PaymentHeader';
import PaymentSection from './components/PaymentSection';

const Payment = () => {
  const navigate = useNavigate();
  const selectedMethod = usePaymentStore((s) => s.selectedMethod);
  const setSelectedMethod = usePaymentStore((s) => s.setSelectedMethod);

  const [draftId, setDraftId] = useState(selectedMethod?.id || null);

  const groupById = useMemo(() => {
    const map = new Map();
    paymentGroups.forEach((g) => map.set(g.id, g));
    return map;
  }, []);

  const handleSelectDraft = (option) => setDraftId(option.id);

  const handleConfirm = () => {
    if (!draftId) return;
    for (const group of paymentGroups) {
      const found = group.options.find((o) => o.id === draftId);
      if (found) {
        setSelectedMethod({ ...found, groupLabel: group.label });
        break;
      }
    }
    navigate(-1);
  };

  return (
    <div
      className="min-h-screen pb-28"
      style={{ background: '#f9fafb', fontFamily: "'Inter', sans-serif" }}
    >
      <PaymentHeader />

      <div className="pt-2">
        {paymentGroups.map((group) => (
          <PaymentSection
            key={group.id}
            group={groupById.get(group.id)}
            selectedId={draftId}
            onSelect={handleSelectDraft}
          />
        ))}
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
          disabled={!draftId}
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
