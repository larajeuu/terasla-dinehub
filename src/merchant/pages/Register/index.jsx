import { useState } from 'react';
import RegisterHeader from './components/RegisterHeader';
import StepAkun from './components/StepAkun';
import StepToko from './components/StepToko';
import StepKonfirmasi from './components/StepKonfirmasi';

const RegisterPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [dataAkun, setDataAkun] = useState({});
  const [dataToko, setDataToko] = useState({});

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f5f5f5' }}>
      <RegisterHeader currentStep={currentStep} onBack={prevStep} />
      <div className="flex-1 px-4 py-6">
        {currentStep === 1 && (
          <StepAkun
            onNext={(data) => { setDataAkun(data); nextStep(); }}
          />
        )}
        {currentStep === 2 && (
          <StepToko
            onNext={(data) => { setDataToko(data); nextStep(); }}
          />
        )}
        {currentStep === 3 && (
          <StepKonfirmasi dataAkun={dataAkun} dataToko={dataToko} />
        )}
      </div>
    </div>
  );
};

export default RegisterPage;