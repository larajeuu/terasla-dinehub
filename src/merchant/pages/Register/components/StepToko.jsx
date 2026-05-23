import { useState } from 'react';

const kategoriList = ['Minuman', 'Makanan', 'Jajanan', 'Kopi', 'Dessert', 'Lainnya'];

const StepToko = ({ onNext }) => {
  const [kategoriAktif, setKategoriAktif] = useState('Minuman');
  const [foto, setFoto] = useState(null);

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (file) setFoto(URL.createObjectURL(file));
  };

  return (
    <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      <p className="font-bold text-base text-gray-800 mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
        Informasi Toko
      </p>
      <p className="text-xs text-gray-400 mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>
        Lengkapi profil tenant Anda di Teras LA
      </p>

      {/* Upload Foto */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-1 block" style={{ fontFamily: "'Inter', sans-serif" }}>
          Foto / Logo Toko
        </label>
        <label className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer" style={{ border: '1px solid #e5e7eb' }}>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
            style={{ background: '#f3f4f6' }}
          >
            {foto ? (
              <img src={foto} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="13" r="4" stroke="#9ca3af" strokeWidth="1.8"/>
              </svg>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700" style={{ fontFamily: "'Inter', sans-serif" }}>
              Upload Foto Toko
            </p>
            <p className="text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
              Format JPG/PNG, maks. 2 MB
            </p>
            <span
              className="text-xs font-medium mt-1 inline-block px-3 py-1 rounded-lg"
              style={{ background: '#f3f4f6', color: '#374151', fontFamily: "'Inter', sans-serif" }}
            >
              Upload Foto
            </span>
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={handleFoto} />
        </label>
      </div>

      {/* Nama Toko */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-1 block" style={{ fontFamily: "'Inter', sans-serif" }}>
          Nama Toko / Lapak
        </label>
        <input
          type="text"
          placeholder="Nama toko kamu"
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={{ border: '1px solid #e5e7eb', fontFamily: "'Inter', sans-serif", color: '#374151' }}
        />
      </div>

      {/* Kategori */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-2 block" style={{ fontFamily: "'Inter', sans-serif" }}>
          Kategori
        </label>
        <div className="flex flex-wrap gap-2">
          {kategoriList.map((kat) => (
            <button
              key={kat}
              onClick={() => setKategoriAktif(kat)}
              className="px-4 py-1.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: kategoriAktif === kat ? '#e8f5e1' : '#f3f4f6',
                color: kategoriAktif === kat ? '#1D3A27' : '#6b7280',
                border: kategoriAktif === kat ? '1px solid #4A7C40' : '1px solid transparent',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {kat}
            </button>
          ))}
        </div>
      </div>

      {/* No Lapak */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-1 block" style={{ fontFamily: "'Inter', sans-serif" }}>
          No Lapak / Toko
        </label>
        <input
          type="text"
          placeholder="Contoh: No. E/12"
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={{ border: '1px solid #e5e7eb', fontFamily: "'Inter', sans-serif", color: '#374151' }}
        />
      </div>

      {/* Deskripsi */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 mb-1 block" style={{ fontFamily: "'Inter', sans-serif" }}>
          Deskripsi
        </label>
        <textarea
          placeholder="Ceritakan tentang toko kamu..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
          style={{ border: '1px solid #e5e7eb', fontFamily: "'Inter', sans-serif", color: '#374151' }}
        />
      </div>

      {/* Tombol Lanjut */}
      <button
        onClick={onNext}
        className="w-full py-3.5 rounded-2xl font-semibold text-sm text-white transition-all active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #1D3A27 0%, #244830 100%)',
          fontFamily: "'Poppins', sans-serif",
          boxShadow: '0 4px 16px rgba(29,58,39,0.3)',
        }}
      >
        Lanjut
      </button>
    </div>
  );
};

export default StepToko;