import { useState } from 'react';

// Editor daftar item tambahan (add-on) untuk sebuah produk.
// `value` = array [{ name, price, isActive }]. `onChange` mengembalikan array baru.
const AddonEditor = ({ value = [], onChange }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const addAddon = () => {
    const n = name.trim();
    if (!n) return;
    onChange([...value, { name: n, price: Number(price) || 0, isActive: true }]);
    setName('');
    setPrice('');
  };

  const removeAddon = (idx) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block" style={{ fontFamily: "'Inter', sans-serif" }}>
        Item Tambahan
      </label>
      <p className="text-[11px] text-gray-400 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
        Opsi tambahan yang bisa dipilih pelanggan (mis. Extra Keju, Telur).
      </p>

      {/* Daftar add-on yang sudah ada */}
      {value.length > 0 && (
        <div className="flex flex-col gap-2 mb-3">
          {value.map((a, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl"
              style={{ border: '1px solid #e5e7eb', background: '#f9fafb' }}
            >
              <span className="text-sm text-gray-700 truncate" style={{ fontFamily: "'Inter', sans-serif" }}>
                {a.name}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm font-semibold" style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}>
                  + Rp {Number(a.price || 0).toLocaleString('id-ID')}
                </span>
                <button
                  type="button"
                  onClick={() => removeAddon(idx)}
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  aria-label="Hapus"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Input add-on baru */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama tambahan"
          className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none"
          style={{ border: '1px solid #e5e7eb', fontFamily: "'Inter', sans-serif", color: '#374151' }}
        />
        <div className="flex items-center px-3 py-2.5 rounded-xl gap-1" style={{ border: '1px solid #e5e7eb', width: 110 }}>
          <span className="text-xs text-gray-400">Rp</span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0"
            className="w-full text-sm outline-none bg-transparent"
            style={{ fontFamily: "'Inter', sans-serif", color: '#374151' }}
          />
        </div>
        <button
          type="button"
          onClick={addAddon}
          className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all active:scale-90"
          style={{ background: 'linear-gradient(135deg, #1D3A27 0%, #244830 100%)' }}
          aria-label="Tambah item"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AddonEditor;
