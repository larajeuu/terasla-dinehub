import { CheckIcon } from '../../../../shared/components/icons';
import PaymentBrandIcon from '../../../components/PaymentBrandIcon';

const PaymentOption = ({ option, selected, onSelect }) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(option)}
      className="w-full text-left flex items-center gap-3 px-3.5 py-3 transition-all active:scale-[0.99]"
      style={{
        background: selected ? 'rgba(29,58,39,0.04)' : 'transparent',
      }}
    >
      <span
        className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden"
        style={{ background: 'white', border: '1px solid #f3f4f6' }}
      >
        <PaymentBrandIcon brand={option.brand} size={28} />
      </span>

      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold text-gray-900 truncate"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {option.label}
        </p>
        <p
          className="text-[11px] text-gray-400 truncate"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {option.description}
        </p>
      </div>

      <span
        className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all"
        style={{
          background: selected ? '#1D3A27' : 'transparent',
          border: selected ? '0' : '1.5px solid #d1d5db',
        }}
      >
        {selected && <CheckIcon size={12} color="white" strokeWidth={3.5} />}
      </span>
    </button>
  );
};

export default PaymentOption;
