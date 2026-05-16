const DesktopOverlay = () => {
  return (
    <div
      className="hidden md:flex fixed inset-0 z-[9999] flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(160deg, #1a3325 0%, #243d2c 50%, #1a3325 100%)',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-0 left-0 w-72 h-72 rounded-full opacity-10"
        style={{ background: '#C8961A', filter: 'blur(80px)', transform: 'translate(-30%, -30%)' }}
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10"
        style={{ background: '#4A7C40', filter: 'blur(100px)', transform: 'translate(30%, 30%)' }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-8 max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#C8961A' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 9.5L12 3L21 9.5V21H15V15H9V21H3V9.5Z" fill="white" />
            </svg>
          </div>
          <div className="text-left">
            <div className="text-white font-bold text-xl leading-none tracking-wide">TerasLA</div>
            <div className="text-xs tracking-widest mt-0.5" style={{ color: '#C8961A' }}>
              LENTENG AGUNG
            </div>
          </div>
        </div>

        {/* Phone illustration */}
        <div className="mb-8 relative">
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center mb-1"
            style={{ background: 'rgba(200, 150, 26, 0.12)' }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(200, 150, 26, 0.2)' }}
            >
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="1" width="14" height="22" rx="3" stroke="#C8961A" strokeWidth="1.8" />
                <circle cx="12" cy="19" r="1" fill="#C8961A" />
                <line x1="9" y1="4" x2="15" y2="4" stroke="#C8961A" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1
          className="text-white text-2xl font-bold leading-snug mb-3"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Buka di Perangkat Mobile
        </h1>

        {/* Subtext */}
        <p
          className="text-sm leading-relaxed mb-6"
          style={{ color: 'rgba(255,255,255,0.6)', fontFamily: "'Inter', sans-serif" }}
        >
          Aplikasi Teras LA dirancang khusus untuk pengalaman mobile. Buka di smartphone kamu untuk menikmati kuliner Teras LA dengan nyaman!
        </p>

        {/* Tip */}
        <div
          className="flex items-start gap-2.5 rounded-2xl px-4 py-3 text-left w-full"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <svg
            className="flex-shrink-0 mt-0.5"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle cx="12" cy="12" r="10" stroke="#C8961A" strokeWidth="1.8" />
            <path d="M12 8v4M12 16h.01" stroke="#C8961A" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Inter', sans-serif" }}>
            Di browser desktop, tekan <span className="text-white font-semibold">F12</span> lalu aktifkan{' '}
            <span className="text-white font-semibold">Toggle Device Toolbar</span> untuk melihat tampilan mobile.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DesktopOverlay;
