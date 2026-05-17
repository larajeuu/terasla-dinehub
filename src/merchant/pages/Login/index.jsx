import LoginPage from './components/LoginPage';

const LoginPageWrapper = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #1a3325 0%, #1D3A27 50%, #162b1e 100%)',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, #C8961A 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
          opacity: 0.15,
        }}
      />
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
        style={{ background: '#C8961A', filter: 'blur(80px)', transform: 'translate(30%, -30%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10 pointer-events-none"
        style={{ background: '#4A7C40', filter: 'blur(100px)', transform: 'translate(-30%, 30%)' }}
      />
      <div className="relative z-10 w-full max-w-xs flex flex-col items-center">
        <LoginPage />
      </div>
    </div>
  );
};

export default LoginPageWrapper;