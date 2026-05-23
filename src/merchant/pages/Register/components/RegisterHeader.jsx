import { useNavigate } from 'react-router-dom';

const steps = [
  { number: 1, label: 'Akun' },
  { number: 2, label: 'Toko' },
  { number: 3, label: 'Konfirmasi' },
];

const RegisterHeader = ({ currentStep, onBack }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (currentStep === 1) navigate('/merchant/login');
    else onBack();
  };

  return (
    <div
      className="px-4 pt-5 pb-6"
      style={{
        background: 'linear-gradient(135deg, #1D3A27 0%, #244830 100%)',
      }}
    >
      {/* Tombol back + judul */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={handleBack}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{ background: 'rgba(255,255,255,0.12)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div>
          <p className="text-white text-base font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Daftar Sebagai
          </p>
          <p className="text-sm font-bold italic" style={{ color: '#C8961A', fontFamily: "'Poppins', sans-serif" }}>
            Penjual Baru
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between px-2">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Circle */}
            <div className="flex flex-col items-center">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
                style={{
                  background: currentStep > step.number
                    ? '#4A7C40'
                    : currentStep === step.number
                    ? '#C8961A'
                    : 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {currentStep > step.number ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12L10 17L19 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <p
                className="text-xs mt-1"
                style={{
                  color: currentStep === step.number ? '#C8961A' : 'rgba(255,255,255,0.5)',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {step.label}
              </p>
            </div>

            {/* Garis connector */}
            {index < steps.length - 1 && (
              <div
                className="flex-1 h-px mx-2 mb-4"
                style={{
                  background: currentStep > step.number
                    ? '#4A7C40'
                    : 'rgba(255,255,255,0.2)',
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegisterHeader;