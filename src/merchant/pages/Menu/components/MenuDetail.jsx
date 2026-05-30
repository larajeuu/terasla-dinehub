import { useState } from 'react';
import { formatRupiah } from '../../../../shared/utils/format';

const MenuDetail = ({ menu, onBack, onSave }) => {
  const [name, setName] = useState(menu.name);
  const [description, setDescription] = useState(menu.description);
  const [price, setPrice] = useState(menu.price);
  const [stock, setStock] = useState(menu.stock);
  const [available, setAvailable] = useState(menu.available);
  const [image, setImage] = useState(menu.image);

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const handleSave = () => {
    onSave({
      ...menu,
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      available,
      image,
    });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f5f5f5' }}>

      {/* Header */}
      <div
        className="px-4 pt-5 pb-4 flex items-center gap-3"
        style={{ background: 'linear-gradient(135deg, #1D3A27 0%, #244830 100%)' }}
      >
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{ background: 'rgba(255,255,255,0.12)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <p className="text-white font-bold text-base" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Detail Produk
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 px-4 py-5 pb-28 flex flex-col gap-4">
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>

          {/* Foto produk */}
          <div className="flex flex-col items-center mb-5">
            <div
              className="w-28 h-28 rounded-2xl overflow-hidden mb-3 flex items-center justify-center"
              style={{ background: '#f3f4f6' }}
            >
              {image ? (
                <img src={image} alt={name} className="w-full h-full object-cover" />
              ) : (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="#d1d5db" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="13" r="4" stroke="#d1d5db" strokeWidth="1.8"/>
                </svg>
              )}
            </div>
            <label className="cursor-pointer">
              <span
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #1D3A27 0%, #244830 100%)', fontFamily: "'Poppins', sans-serif" }}
              >
                Ubah Foto
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFoto} />
            </label>
          </div>

          <div style={{ borderTop: '1px solid #f3f4f6' }} className="pt-4 flex flex-col gap-4">

            {/* Nama produk */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block" style={{ fontFamily: "'Inter', sans-serif" }}>
                Nama Produk
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ border: '1px solid #e5e7eb', fontFamily: "'Inter', sans-serif", color: '#374151' }}
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block" style={{ fontFamily: "'Inter', sans-serif" }}>
                Deskripsi
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                style={{ border: '1px solid #e5e7eb', fontFamily: "'Inter', sans-serif", color: '#374151' }}
              />
            </div>

            {/* Harga */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block" style={{ fontFamily: "'Inter', sans-serif" }}>
                Harga
              </label>
              <div
                className="flex items-center px-4 py-3 rounded-xl gap-2"
                style={{ border: '1px solid #e5e7eb' }}
              >
                <span className="text-sm text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>Rp</span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="flex-1 text-sm outline-none bg-transparent"
                  style={{ fontFamily: "'Inter', sans-serif", color: '#374151' }}
                />
              </div>
            </div>

            {/* Estimasi stok */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block" style={{ fontFamily: "'Inter', sans-serif" }}>
                Estimasi Stok Hari Ini
              </label>
              <div
                className="flex items-center rounded-xl overflow-hidden"
                style={{ border: '1px solid #e5e7eb' }}
              >
                <button
                  onClick={() => setStock((prev) => Math.max(0, Number(prev) - 1))}
                  className="px-4 py-3 text-gray-500 font-bold text-lg transition-all active:scale-90"
                  style={{ background: '#f9fafb' }}
                >
                  −
                </button>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="flex-1 text-center text-sm outline-none bg-transparent"
                  style={{ fontFamily: "'Inter', sans-serif", color: '#374151' }}
                />
                <button
                  onClick={() => setStock((prev) => Number(prev) + 1)}
                  className="px-4 py-3 text-gray-500 font-bold text-lg transition-all active:scale-90"
                  style={{ background: '#f9fafb' }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Toggle stok tersedia */}
            <div
              className="flex items-center justify-between px-4 py-3 rounded-xl"
              style={{ border: '1px solid #e5e7eb' }}
            >
              <div>
                <p className="text-sm font-medium text-gray-700" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Stok Tersedia
                </p>
                <p className="text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {available ? 'Produk sedang tersedia' : 'Produk tidak tersedia'}
                </p>
              </div>
              <button
                onClick={() => setAvailable(!available)}
                className="relative w-11 h-6 rounded-full transition-all"
                style={{ background: available ? '#1D3A27' : '#d1d5db' }}
              >
                <div
                  className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
                  style={{ left: available ? '22px' : '2px' }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tombol simpan */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-4 bg-white" style={{ boxShadow: '0 -1px 12px rgba(0,0,0,0.08)' }}>
        <button
          onClick={handleSave}
          className="w-full py-3.5 rounded-2xl font-semibold text-sm text-white transition-all active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #1D3A27 0%, #244830 100%)',
            fontFamily: "'Poppins', sans-serif",
            boxShadow: '0 4px 16px rgba(29,58,39,0.3)',
          }}
        >
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
};

export default MenuDetail;