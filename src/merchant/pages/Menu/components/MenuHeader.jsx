const MenuHeader = ({ tokoName, lokasi, totalProduk, totalTersedia }) => {
  return (
    <div
      className="px-4 pt-5 pb-6"
      style={{ background: 'linear-gradient(135deg, #1D3A27 0%, #244830 100%)' }}
    >
      {/* Nama toko */}
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
      </div>

      {/* Title */}
      <p className="text-white font-bold text-xl mb-0.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
        MENU SAYA
      </p>
      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Inter', sans-serif" }}>
        {totalProduk} produk terdaftar · {totalTersedia} tersedia
      </p>
    </div>
  );
};

export default MenuHeader;