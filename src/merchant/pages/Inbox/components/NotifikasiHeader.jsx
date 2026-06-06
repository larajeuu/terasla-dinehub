const NotifikasiHeader = ({
  tokoName,
  lokasi,
  pesanBelumDibaca,
  countPengumuman,
  countPengingat,
  onClickPengumuman,
  onClickPengingat,
  activePanel,
}) => {
  return (
    <div
      className="px-4 pt-5 pb-6"
      style={{ background: 'linear-gradient(135deg, #1D3A27 0%, #244830 100%)' }}
    >
      {/* Nama toko + icon Pengumuman & Pengingat */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-white font-bold text-base" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {tokoName}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8"/>
              <circle cx="12" cy="9" r="2.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8"/>
            </svg>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Inter', sans-serif" }}>
              {lokasi}
            </p>
          </div>
        </div>

        {/* Icon Pengumuman & Pengingat */}
        <div className="flex gap-2">
          <button
            onClick={onClickPengumuman}
            className="relative"
            style={{ background: 'none', border: 'none', padding: 0 }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{
                background: activePanel === 'Pengumuman'
                  ? 'rgba(255,255,255,0.3)'
                  : 'rgba(255,255,255,0.15)',
              }}
            >
              📢
            </div>
            {countPengumuman > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full text-white flex items-center justify-center px-1"
                style={{ background: '#ef4444', fontSize: 10, fontFamily: "'Inter', sans-serif", fontWeight: 700 }}
              >
                {countPengumuman}
              </span>
            )}
          </button>

          <button
            onClick={onClickPengingat}
            className="relative"
            style={{ background: 'none', border: 'none', padding: 0 }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{
                background: activePanel === 'Pengingat'
                  ? 'rgba(255,255,255,0.3)'
                  : 'rgba(255,255,255,0.15)',
              }}
            >
              🔔
            </div>
            {countPengingat > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full text-white flex items-center justify-center px-1"
                style={{ background: '#ef4444', fontSize: 10, fontFamily: "'Inter', sans-serif", fontWeight: 700 }}
              >
                {countPengingat}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Title */}
      <p className="text-white font-bold text-xl mb-0.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
        NOTIFIKASI
      </p>
      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Inter', sans-serif" }}>
        {pesanBelumDibaca} pesan belum dibaca
      </p>
    </div>
  );
};

export default NotifikasiHeader;
