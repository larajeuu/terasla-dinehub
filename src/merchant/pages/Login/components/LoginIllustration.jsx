const LoginIllustration = () => {
  return (
    <div className="flex items-center justify-center mb-8">
      <div
        className="w-24 h-24 rounded-3xl flex items-center justify-center"
        style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}
      >
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 9.5L12 3L21 9.5V21H15V15H9V21H3V9.5Z"
            fill="none"
            stroke="#C8961A"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <rect x="9" y="10" width="6" height="5" rx="1" fill="#C8961A" opacity="0.4" />
          <path
            d="M4 20h16"
            stroke="#C8961A"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      </div>
    </div>
  );
};

export default LoginIllustration;