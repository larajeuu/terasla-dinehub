import { register } from '../../../../services/authService';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StepKonfirmasi = ({ dataAkun, dataToko }) => {
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDaftar = async () => {
    setError('');

    if (!confirmed) {
      setError('Kamu harus mengonfirmasi data sudah benar');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        nama: dataToko?.namaToko,
        identifier: dataAkun?.email,
        phone: dataAkun?.hp,
        password: dataAkun?.password,
        owner: dataAkun?.nama,
        alamat: dataToko?.noLapak,
        block: dataToko?.noLapak,
        category: dataToko?.kategori,
        deskripsi: dataToko?.deskripsi,
      }
    

      console.log('Register Payload: ', payload);

      const response = await register(payload);
    
      console.log('Register Response: ', response);

      navigate('/merchant/login', {replace: true});

    } catch (error) {
      console.error('Register Gagal: ', error);

      const message =
        error?.response?.data?.detail ||
        'Register Akun Gagal. Silahkan Coba Lagi.';

      setError(message);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Card konfirmasi */}
      <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <p className="font-bold text-base text-gray-800 mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Konfirmasi Pendaftaran
        </p>
        <p className="text-xs text-gray-400 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
          Periksa kembali data Anda sebelum mendaftar
        </p>

        {/* Banner toko */}
        <div
          className="flex items-center gap-3 p-3 rounded-xl mb-4"
          style={{ background: 'linear-gradient(135deg, #1D3A27 0%, #244830 100%)' }}
        >
          <div
            className="w-14 h-14 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
            {dataToko?.foto ? (
              <img src={dataToko.foto} alt="foto toko" className="w-full h-full object-cover" />
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M3 9.5L12 3L21 9.5V21H15V15H9V21H3V9.5Z" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <div>
            <p className="text-white font-bold text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {dataToko?.namaToko || 'Nama Toko'}
            </p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: "'Inter', sans-serif" }}>
              {dataToko?.kategori || 'Kategori'}
            </p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: "'Inter', sans-serif" }}>
              {dataToko?.noLapak || 'No. Lapak'}
            </p>
          </div>
        </div>

        {/* Detail akun */}
        {[
          { label: 'Nama Pemilik', value: dataAkun?.nama || '-' },
          { label: 'Nomor HP', value: dataAkun?.hp || '-' },
          { label: 'Email', value: dataAkun?.email || '-' },
          { label: 'Lokasi', value: dataToko?.noLapak || '-' },
        ].map((item) => (
          <div
            key={item.label}
            className="flex justify-between items-center py-3"
            style={{ borderBottom: '1px solid #f3f4f6' }}
          >
            <p className="text-sm text-gray-500" style={{ fontFamily: "'Inter', sans-serif" }}>
              {item.label}
            </p>
            <p
              className="text-sm font-medium text-gray-800"
              style={{ fontFamily: "'Inter', sans-serif", color: item.label === 'Email' ? '#C8961A' : '#1f2937' }}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Checkbox konfirmasi */}
      <div className="flex items-start gap-2 px-1">
        <input
          type="checkbox"
          id="confirm"
          checked={confirmed}
          onChange={(e) => {
            setConfirmed(e.target.checked);
            setError('');
          }}
          className="mt-0.5 accent-[#1D3A27]"
        />
        <label htmlFor="confirm" className="text-xs text-gray-500 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
          Semua data yang saya isi sudah benar dan sesuai
        </label>
      </div>
      {error && <p className="text-xs text-red-500 px-1">{error}</p>}

      {/* Tombol Daftar */}
      <button
        onClick={handleDaftar}
        disabled={loading}
        className="w-full py-3.5 rounded-2xl font-semibold text-sm text-white transition-all active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #C8961A 0%, #d6a425 100%)',
          fontFamily: "'Poppins', sans-serif",
          boxShadow: '0 4px 16px rgba(200,150,26,0.35)',
        }}
      >
        Daftar
      </button>
    </div>
  );
};

export default StepKonfirmasi;