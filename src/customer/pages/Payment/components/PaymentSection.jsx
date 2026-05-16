import PaymentOption from './PaymentOption';

const PaymentSection = ({ group, selectedId, onSelect }) => {
  return (
    <section className="mx-4 mt-4">
      <h3
        className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-2 px-1"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {group.label}
      </h3>
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          border: '1px solid #f3f4f6',
          boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
        }}
      >
        {group.options.map((option, idx) => (
          <div key={option.id}>
            {idx > 0 && (
              <div className="ml-16 border-t" style={{ borderColor: '#f3f4f6' }} />
            )}
            <PaymentOption
              option={option}
              selected={selectedId === option.id}
              onSelect={onSelect}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PaymentSection;
