import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../../../store/authStore';
import {
  createWithdrawal,
  getMerchantBalance,
  getBankAccounts,
  saveBankAccount,
  deleteBankAccount,
} from '../../../../services/withdrawalService';
import { formatRupiah } from '../../../../shared/utils/format';

const MIN_WITHDRAWAL = 10000;
const ADMIN_FEE = 2500;
const QUICK_AMOUNTS = [100000, 250000, 500000];

const BankIcon = ({ bank }) => {
  const colors = { BCA: '#0066AE', BNI: '#f77f00', BRI: '#003087', Mandiri: '#003580', BSI: '#016937' };
  const bg = colors[bank] || '#6b7280';
  const label = bank?.slice(0, 3).toUpperCase() || '?';
  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs"
      style={{ background: bg, fontFamily: "'Poppins', sans-serif" }}
    >
      {label}
    </div>
  );
};

const SuccessModal = ({ nominal, onRiwayat, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
    <div className="w-full max-w-md bg-white rounded-t-3xl px-6 pt-6 pb-10 flex flex-col items-center gap-4">
      <div className="w-10 h-1 rounded-full bg-gray-300 mb-1" />
      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1D3A27, #2d5a3d)' }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="text-center">
        <p className="text-lg font-bold" style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}>Pencairan Berhasil!</p>
        <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>Dana sedang diproses ke rekeningmu.</p>
      </div>
      <div className="w-full rounded-2xl p-4 text-center" style={{ background: '#f9fafb', border: '1px solid #f3f4f6' }}>
        <p className="text-xs text-gray-400 mb-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>Nominal Dicairkan</p>
        <p className="text-2xl font-bold" style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}>{formatRupiah(nominal)}</p>
        <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>Estimasi masuk 1×24 jam kerja</p>
      </div>
      <div className="w-full flex flex-col gap-2">
        <button
          onClick={onRiwayat}
          className="w-full py-3.5 rounded-2xl font-semibold text-sm"
          style={{ background: '#1D3A27', color: 'white', fontFamily: "'Poppins', sans-serif" }}
        >
          Lihat Riwayat Keuangan
        </button>
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl font-semibold text-sm"
          style={{ background: '#f3f4f6', color: '#6b7280', fontFamily: "'Poppins', sans-serif" }}
        >
          Kembali
        </button>
      </div>
    </div>
  </div>
);

const ErrorModal = ({ message, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
    <div className="w-full max-w-md bg-white rounded-t-3xl px-6 pt-6 pb-10 flex flex-col items-center gap-4">
      <div className="w-10 h-1 rounded-full bg-gray-300 mb-1" />
      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#fef2f2' }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="text-center">
        <p className="text-lg font-bold text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>Pencairan Gagal</p>
        <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>{message}</p>
      </div>
      <button
        onClick={onClose}
        className="w-full py-3.5 rounded-2xl font-semibold text-sm"
        style={{ background: '#1D3A27', color: 'white', fontFamily: "'Poppins', sans-serif" }}
      >
        Coba Lagi
      </button>
    </div>
  </div>
);

const PencairanDana = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const user = useAuthStore((s) => s.user);
  const merchantId = user?.merchantId;

  const [saldo, setSaldo] = useState(state?.saldo ?? 0);
  const [nominal, setNominal] = useState('');
  const [accounts, setAccounts] = useState(() => getBankAccounts(merchantId));
  const [selectedIdx, setSelectedIdx] = useState(() => {
    const saved = getBankAccounts(merchantId);
    return saved.length > 0 ? 0 : null;
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAccount, setNewAccount] = useState({ bank: '', account_number: '', account_name: '' });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [successModal, setSuccessModal] = useState(null);
  const [errorModal, setErrorModal] = useState(null);

  useEffect(() => {
    getMerchantBalance().then(setSaldo).catch(() => {});
  }, []);


  const numericNominal = Number(String(nominal).replace(/\D/g, '')) || 0;
  const totalPotong = numericNominal + ADMIN_FEE;
  const isValid = numericNominal >= MIN_WITHDRAWAL && numericNominal + ADMIN_FEE <= saldo && selectedIdx !== null;

  const handleNominalChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    setNominal(raw ? Number(raw).toLocaleString('id-ID') : '');
    setFormError('');
  };

  const handleQuick = (amount) => { setNominal(amount.toLocaleString('id-ID')); setFormError(''); };

  const handleAll = () => {
    setNominal(Math.max(0, saldo - ADMIN_FEE).toLocaleString('id-ID'));
    setFormError('');
  };

  const handleAddAccount = () => {
    const { bank, account_number, account_name } = newAccount;
    if (!bank.trim() || !account_number.trim() || !account_name.trim()) {
      setFormError('Lengkapi semua data rekening.');
      return;
    }
    const updated = saveBankAccount(merchantId, {
      bank: bank.trim(),
      account_number: account_number.trim(),
      account_name: account_name.trim(),
    });
    setAccounts(updated);
    setSelectedIdx(updated.length - 1);
    setNewAccount({ bank: '', account_number: '', account_name: '' });
    setShowAddForm(false);
    setFormError('');
  };

  const handleDeleteAccount = (idx) => {
    const updated = deleteBankAccount(merchantId, idx);
    setAccounts(updated);
    setSelectedIdx(updated.length > 0 ? 0 : null);
  };

  const handleSubmit = async () => {
    if (!isValid) return;
    if (numericNominal < MIN_WITHDRAWAL) { setFormError(`Minimal pencairan ${formatRupiah(MIN_WITHDRAWAL)}.`); return; }
    if (numericNominal + ADMIN_FEE > saldo) { setFormError(`Nominal + biaya admin (${formatRupiah(ADMIN_FEE)}) melebihi saldo tersedia.`); return; }
    const acc = accounts[selectedIdx];
    setLoading(true);
    setFormError('');
    try {
      await createWithdrawal({ amount: numericNominal, bank: acc.bank, account_number: acc.account_number, account_name: acc.account_name });
      setNominal('');
      setSuccessModal({ nominal: numericNominal });
      getMerchantBalance().then(setSaldo).catch(() => {
        setSaldo((prev) => Math.max(0, prev - numericNominal - ADMIN_FEE));
      });
    } catch (err) {
      setErrorModal({ message: err?.response?.data?.detail || 'Gagal melakukan pencairan. Coba lagi.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {successModal && (
        <SuccessModal
          nominal={successModal.nominal}
          onRiwayat={() => navigate('/merchant/kontrol/riwayat')}
          onClose={() => setSuccessModal(null)}
        />
      )}
      {errorModal && (
        <ErrorModal
          message={errorModal.message}
          onClose={() => setErrorModal(null)}
        />
      )}

      <div className="min-h-screen flex flex-col" style={{ background: '#f5f5f5' }}>
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-5 pb-4" style={{ background: 'linear-gradient(135deg, #1D3A27 0%, #244830 100%)' }}>
          <button onClick={() => navigate('/merchant/kontrol')} className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 19l-7-7 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <p className="text-white font-bold text-base" style={{ fontFamily: "'Poppins', sans-serif" }}>Pencairan Dana</p>
        </div>

        {/* Gold balance card */}
        <div className="px-4 pt-4">
          <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, #C8961A 0%, #d6a425 100%)', boxShadow: '0 4px 16px rgba(200,150,26,0.3)' }}>
            <p className="text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.75)', fontFamily: "'Inter', sans-serif" }}>Saldo Tersedia</p>
            <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>{formatRupiah(saldo)}</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: "'Inter', sans-serif" }}>Min. pencairan {formatRupiah(MIN_WITHDRAWAL)}</p>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 px-4 pt-4 flex flex-col gap-4 pb-32">
          {/* Nominal input */}
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>
            <p className="text-xs font-semibold text-gray-500 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Masukkan Nominal</p>
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2 mb-3">
              <span className="text-sm font-semibold text-gray-500" style={{ fontFamily: "'Poppins', sans-serif" }}>Rp</span>
              <input
                type="text"
                inputMode="numeric"
                value={nominal}
                onChange={handleNominalChange}
                placeholder="0"
                className="flex-1 text-lg font-bold text-gray-800 outline-none bg-transparent"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {QUICK_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleQuick(amt)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95"
                  style={{ background: numericNominal === amt ? '#1D3A27' : '#f3f4f6', color: numericNominal === amt ? 'white' : '#374151', fontFamily: "'Inter', sans-serif" }}
                >
                  {amt >= 1000000 ? `Rp ${amt / 1000000}jt` : `Rp ${amt / 1000}rb`}
                </button>
              ))}
              <button
                onClick={handleAll}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95"
                style={{ background: '#f3f4f6', color: '#374151', fontFamily: "'Inter', sans-serif" }}
              >
                Semua
              </button>
            </div>
            {numericNominal > 0 && (
              <p className="text-xs text-gray-400 mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                Total dipotong (termasuk admin): <span className="font-semibold text-gray-600">{formatRupiah(totalPotong)}</span>
              </p>
            )}
          </div>

          {/* Bank accounts */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>
            <p className="text-xs font-semibold text-gray-500 px-4 pt-4 pb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Pilih Rekening Tujuan</p>

            {accounts.length === 0 && !showAddForm && (
              <p className="text-xs text-gray-400 px-4 pb-3" style={{ fontFamily: "'Inter', sans-serif" }}>Belum ada rekening tersimpan.</p>
            )}

            {accounts.map((acc, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors"
                style={{ borderTop: '1px solid #f3f4f6', background: selectedIdx === idx ? '#f0fdf4' : 'white' }}
                onClick={() => setSelectedIdx(idx)}
              >
                <BankIcon bank={acc.bank} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>Bank {acc.bank}</p>
                  <p className="text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>{acc.account_name} · ****{acc.account_number.slice(-4)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {selectedIdx === idx ? (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#1D3A27' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteAccount(idx); }}
                    className="w-6 h-6 flex items-center justify-center rounded-lg"
                    style={{ background: '#fef2f2' }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6l12 12" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            {!showAddForm ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-4 py-3 w-full transition-colors"
                style={{ borderTop: accounts.length > 0 ? '1px solid #f3f4f6' : 'none' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#f3f4f6' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-500" style={{ fontFamily: "'Inter', sans-serif" }}>Tambah rekening baru</p>
              </button>
            ) : (
              <div className="px-4 py-3 flex flex-col gap-2" style={{ borderTop: '1px solid #f3f4f6' }}>
                <p className="text-xs font-semibold text-gray-500 mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>Tambah Rekening Baru</p>
                {[
                  { key: 'bank', label: 'Nama Bank', placeholder: 'BCA, BNI, BRI, Mandiri...' },
                  { key: 'account_number', label: 'Nomor Rekening', placeholder: '123456789', type: 'tel' },
                  { key: 'account_name', label: 'Nama Pemilik', placeholder: 'Sesuai buku tabungan' },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key}>
                    <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</p>
                    <input
                      type={type || 'text'}
                      value={newAccount[key]}
                      onChange={(e) => setNewAccount((p) => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>
                ))}
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => { setShowAddForm(false); setFormError(''); }}
                    className="flex-1 py-2 rounded-xl text-sm font-semibold"
                    style={{ background: '#f3f4f6', color: '#6b7280', fontFamily: "'Inter', sans-serif" }}
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleAddAccount}
                    className="flex-1 py-2 rounded-xl text-sm font-semibold text-white"
                    style={{ background: '#1D3A27', fontFamily: "'Inter', sans-serif" }}
                  >
                    Simpan
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Info note */}
          <div className="rounded-2xl px-4 py-3 flex gap-2" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10" stroke="#d97706" strokeWidth="1.8"/>
              <path d="M12 8v4M12 16h.01" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <p className="text-xs text-yellow-800 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Dana akan masuk ke rekening dalam 1×24 jam kerja. Biaya admin {formatRupiah(ADMIN_FEE)} per transaksi.
            </p>
          </div>

          {formError && (
            <p className="text-xs text-red-500 text-center" style={{ fontFamily: "'Inter', sans-serif" }}>{formError}</p>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-3" style={{ background: 'white', borderTop: '1px solid #f3f4f6' }}>
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all active:scale-95"
            style={{ background: isValid && !loading ? '#1D3A27' : '#d1d5db', fontFamily: "'Poppins', sans-serif" }}
          >
            {loading ? 'Memproses...' : 'Cairkan Dana'}
          </button>
        </div>
      </div>
    </>
  );
};

export default PencairanDana;