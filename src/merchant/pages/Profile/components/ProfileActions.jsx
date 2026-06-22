import { useState, useEffect } from 'react';
import useAuthStore from '../../../../store/authStore';
import { getMerchantById, updateMerchantProfile } from '../../../../services/merchantService';

const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke="#7aaa72" strokeWidth="1.8" />
    <path
      d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6"
      stroke="#7aaa72"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const MapPinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 21s6-5.5 6-11a6 6 0 10-12 0c0 5.5 6 11 6 11z"
      stroke="#7aaa72"
      strokeWidth="1.8"
    />
    <circle cx="12" cy="10" r="2" stroke="#7aaa72" strokeWidth="1.8" />
  </svg>
);

const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M4 6h16v12H4z" stroke="#7aaa72" strokeWidth="1.8" />
    <path d="M4 7l8 6 8-6" stroke="#7aaa72" strokeWidth="1.8" />
  </svg>
);

const LockIcon = ({ color = '#7aaa72' }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="11" width="14" height="9" rx="2" stroke={color} strokeWidth="1.8" />
    <path d="M8 11V8a4 4 0 118 0v3" stroke={color} strokeWidth="1.8" />
  </svg>
);

const EyeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path
      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
      stroke="#7aaa72"
      strokeWidth="1.8"
    />
    <circle cx="12" cy="12" r="3" stroke="#7aaa72" strokeWidth="1.8" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path
      d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"
      stroke="#7aaa72"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"
      stroke="#7aaa72"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <line x1="1" y1="1" x2="23" y2="23" stroke="#7aaa72" strokeWidth="1.8" />
  </svg>
);

const InputField = ({ label, icon, type = 'text', value, onChange, placeholder, hint }) => {
  const [showPass, setShowPass] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPass ? 'text' : 'password') : type;

  return (
    <div className="mb-4">
      {label && (
        <label
          className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
          style={{ color: '#4a6e45' }}
        >
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            {icon}
          </span>
        )}

        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-xl text-sm outline-none transition-colors"
          style={{
            padding: icon ? '10px 38px 10px 36px' : '10px 14px',
            border: '1.5px solid #d8e8d5',
            background: '#f8fbf7',
            color: '#1a3a14',
            fontFamily: "'Poppins', sans-serif",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#2d5a27';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#d8e8d5';
          }}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPass((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPass ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>

      {hint && (
        <p className="text-xs mt-1" style={{ color: '#9ab095' }}>
          {hint}
        </p>
      )}
    </div>
  );
};

const ProfileActions = ({ onSave }) => {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const [form, setForm] = useState({
    nama: '',
    lokasi: '',
    email: '',
    password: '',
    konfirmasi: '',
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.merchantId) return;
    getMerchantById(user.merchantId)
      .then((data) => {
        setForm((prev) => ({
          ...prev,
          nama: data.name || '',
          lokasi: data.block || '',
          email: data.email || '',
        }));
      })
      .catch(() => {});
  }, [user?.merchantId]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    if (form.password && form.password !== form.konfirmasi) {
      setError('Password dan konfirmasi tidak cocok.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await updateMerchantProfile(user.merchantId, {
        nama: form.nama,
        block: form.lokasi,
        email: form.email,
        password: form.password || undefined,
      });
      updateUser({ name: form.nama });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      setForm((prev) => ({ ...prev, password: '', konfirmasi: '' }));
      if (onSave) onSave(form);
    } catch {
      setError('Gagal menyimpan perubahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-5 pb-7">
      <div className="border-t border-gray-100 mb-4" />

      <InputField
        label="Nama Tenant"
        icon={<UserIcon />}
        value={form.nama}
        onChange={handleChange('nama')}
        placeholder="Nama yang ditampilkan kepada pelanggan"
        hint="Nama yang ditampilkan kepada pelanggan"
      />

      <InputField
        label="Lokasi Tenant"
        icon={<MapPinIcon />}
        value={form.lokasi}
        onChange={handleChange('lokasi')}
        placeholder="Blok, area, atau lantai tempat tenant berada"
        hint="Blok, area, atau lantai tempat tenant berada"
      />

      <InputField
        label="Email"
        icon={<MailIcon />}
        type="email"
        value={form.email}
        onChange={handleChange('email')}
        placeholder="Email untuk notifikasi & login akun"
        hint="Email untuk notifikasi & login akun"
      />

      <label
        className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
        style={{ color: '#4a6e45' }}
      >
        Password
      </label>

      <InputField
        icon={<LockIcon color="#c0392b" />}
        type="password"
        value={form.password}
        onChange={handleChange('password')}
        placeholder="Password Baru"
      />

      <InputField
        icon={<LockIcon />}
        type="password"
        value={form.konfirmasi}
        onChange={handleChange('konfirmasi')}
        placeholder="Konfirmasi Password"
        hint="Minimal 8 karakter, kombinasi huruf & angka"
      />

      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full py-3.5 rounded-xl text-white font-bold text-base mt-2 transition-opacity"
        style={{
          background: loading ? '#6fa866' : 'linear-gradient(135deg, #2d5a27 0%, #4a8a3f 100%)',
          fontFamily: "'Poppins', serif",
          boxShadow: '0 4px 16px rgba(45,90,39,0.25)',
          opacity: loading ? 0.8 : 1,
        }}
      >
        {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
      </button>

      {error && (
        <div
          className="mt-3 text-center text-sm font-semibold rounded-xl py-2.5"
          style={{ background: '#fef2f2', color: '#b91c1c' }}
        >
          {error}
        </div>
      )}

      {saved && (
        <div
          className="mt-3 text-center text-sm font-semibold rounded-xl py-2.5"
          style={{ background: '#e8f5e4', color: '#2d5a27' }}
        >
          ✓ Perubahan berhasil disimpan!
        </div>
      )}
    </div>
  );
};

export default ProfileActions;