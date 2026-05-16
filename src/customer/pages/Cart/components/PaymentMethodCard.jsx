import { useNavigate } from 'react-router-dom';
import usePaymentStore from '../../../../store/paymentStore';
import { ChevronRightIcon, WalletIcon } from '../../../../shared/components/icons';
import PaymentBrandIcon from '../../../components/PaymentBrandIcon';

const PaymentMethodCard = () => {
  const navigate = useNavigate();
  const selectedMethod = usePaymentStore((s) => s.selectedMethod);

  return (
    <button
      onClick={() => navigate('/payment')}
      className="w-full text-left px-4 py-3.5 bg-white rounded-2xl flex items-center gap-3 transition-all active:scale-[0.99] hover:shadow-md"
      style={{
        border: '1px solid #f3f4f6',
        boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
      }}
    >
      {selectedMethod ? (
        <span
          className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center overflow-hidden bg-white"
          style={{ border: '1px solid #f3f4f6' }}
        >
          <PaymentBrandIcon brand={selectedMethod.brand} size={28} />
        </span>
      ) : (
        <span
          className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #2d5a3d 0%, #1D3A27 100%)',
          }}
        >
          <WalletIcon size={20} color="white" />
        </span>
      )}

      <div className="flex-1 min-w-0">
        <p
          className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Metode Pembayaran
        </p>
        {selectedMethod ? (
          <>
            <p
              className="text-sm font-bold text-gray-900 truncate mt-0.5"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {selectedMethod.label}
            </p>
            <p
              className="text-[11px] text-gray-400 truncate"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {selectedMethod.groupLabel}
            </p>
          </>
        ) : (
          <p
            className="text-sm font-semibold text-gray-700 mt-0.5"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Pilih metode pembayaran
          </p>
        )}
      </div>

      <ChevronRightIcon size={18} color="#9ca3af" />
    </button>
  );
};

export default PaymentMethodCard;
