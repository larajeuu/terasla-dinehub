import { useState } from 'react';
import { User, MapPin, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const InputField = ({ label, icon: Icon, type = 'text', value, onChange, placeholder, hint, iconColor }) => {
  const [showPass, setShowPass] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPass ? 'text' : 'password') : type;

  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#4a6e45' }}>
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            <Icon size={15} color={iconColor || '#7aaa72'} />
          </span>
        )}
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-xl text-sm outline-none transition-colors"
          style={{
            padding: Icon ? '10px 38px 10px 36px' : '10px 14px',
            border: '1.5px solid #d8e8d5',
            background: '#f8fbf7',
            color: '#1a3a14',
            fontFamily: "'DM Sans', sans-serif",
          }}
          onFocus={(e) => (e.target.style.borderColor = '#2d5a27')}
          onBlur={(e) => (e.target.style.borderColor = '#d8e8d5')}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPass ? <EyeOff size={15} color="#7aaa72" /> : <Eye size={15} color="#7aaa72" />}
          </button>
        )}
      </div>
      {hint && <p className="text-xs mt-1" style={{ color: '#9ab095' }}>{hint}</p>}
    </div>
  );
};

const EditProfilActions = ({ onSave }) => {
  const [form, setForm] = useState({
    nama: 'Thai Tea Bossku',
    lokasi: 'Blok E- Teras LA, Depok',
    email: 'tralalataralii@yahoo.com',
    password: '',
    konfirmasi: '',
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    onSave && onSave(form);
  };

  return (
    <div className="px-5 pb-7">
      <div className="border-t border-gray-100 mb-4" />

      <InputField
        label="Nama Tenant"
        icon={User}
        value={form.nama}
        onChange={handleChange('nama')}
        placeholder="Nama yang ditampilkan kepada pelanggan"
        hint="Nama yang ditampilkan kepada pelanggan"
      />
      <InputField
        label="Lokasi Tenant"
        icon={MapPin}
        value={form.lokasi}
        onChange={handleChange('lokasi')}
        placeholder="Blok, area, atau lantai tempat tenant berada"
        hint="Blok, area, atau lantai tempat tenant berada"
      />
      <InputField
        label="Email"
        icon={Mail}
        type="email"
        value={form.email}
        onChange={handleChange('email')}
        placeholder="Email untuk notifikasi & login akun"
        hint="Email untuk notifikasi & login akun"
      />

      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#4a6e45' }}>
        Password
      </label>
      <InputField
        icon={Lock}
        iconColor="#c0392b"
        type="password"
        value={form.password}
        onChange={handleChange('password')}
        placeholder="Password Baru"
      />
      <InputField
        icon={Lock}
        type="password"
        value={form.konfirmasi}
        onChange={handleChange('konfirmasi')}
        placeholder="Konfirmasi Password"
        hint="Minimal 8 karakter, kombinasi huruf & angka"
      />

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full py-3.5 rounded-xl text-white font-bold text-base mt-2 transition-opacity"
        style={{
          background: loading ? '#6fa866' : 'linear-gradient(135deg, #2d5a27 0%, #4a8a3f 100%)',
          fontFamily: "'Playfair Display', serif",
          boxShadow: '0 4px 16px rgba(45,90,39,0.25)',
          opacity: loading ? 0.8 : 1,
        }}
      >
        {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
      </button>

      {/* Toast */}
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

export default EditProfilActions;
