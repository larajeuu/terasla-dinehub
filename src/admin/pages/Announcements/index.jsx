import { useState, useEffect, useCallback } from 'react';
import PageContainer from '../../components/PageContainer';
import { sendAnnouncement, getAnnouncements } from '../../../services/adminAnnouncementService';
import { getMerchants } from '../../../services/merchantService';
import { extractErrorMessage } from '../../../services/withdrawalService';
import { formatDate } from '../../utils/format';

// ── Toast (selaras gaya halaman Withdrawals) ─────────────────────────────────

const TOAST_COLORS = {
  success: { bg: '#dcfce7', color: '#15803d', border: '#bbf7d0' },
  error:   { bg: '#fee2e2', color: '#b91c1c', border: '#fecaca' },
  info:    { bg: '#dbeafe', color: '#1e40af', border: '#bfdbfe' },
};

const ToastList = ({ toasts, onRemove }) => (
  <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50 pointer-events-none">
    {toasts.map((t) => {
      const s = TOAST_COLORS[t.type] || TOAST_COLORS.info;
      return (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium max-w-sm"
          style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
        >
          <span className="flex-1">{t.message}</span>
          <button onClick={() => onRemove(t.id)} className="opacity-60 hover:opacity-100 text-lg leading-none">×</button>
        </div>
      );
    })}
  </div>
);

const TIPE_OPTIONS = [
  { value: 'penting',    label: 'Penting',    desc: 'Masuk kategori Penting di inbox merchant' },
  { value: 'pengumuman', label: 'Pengumuman', desc: 'Masuk kategori Pengumuman biasa' },
];

const Announcements = () => {
  const [judul, setJudul] = useState('');
  const [pesan, setPesan] = useState('');
  const [tipe, setTipe] = useState('penting');
  const [targetAll, setTargetAll] = useState(true);
  const [merchants, setMerchants] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState([]);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const loadHistory = useCallback(() => {
    getAnnouncements().then(setHistory).catch(() => {});
  }, []);

  useEffect(() => {
    getMerchants().then(setMerchants).catch(() => setMerchants([]));
    loadHistory();
  }, [loadHistory]);

  const toggleMerchant = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const canSend = judul.trim() && pesan.trim() && (targetAll || selectedIds.length > 0) && !sending;

  const handleSend = async () => {
    if (!canSend) return;
    setSending(true);
    try {
      const res = await sendAnnouncement({
        judul: judul.trim(),
        pesan: pesan.trim(),
        tipe,
        merchantIds: targetAll ? null : selectedIds,
      });
      addToast(res.message || 'Pengumuman terkirim.', 'success');
      setJudul('');
      setPesan('');
      setSelectedIds([]);
      setTargetAll(true);
      loadHistory();
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setSending(false);
    }
  };

  const inputStyle = { borderColor: '#e5e7eb' };

  return (
    <>
      <PageContainer
        title="Pengumuman Merchant"
        subtitle="Kirim pesan ke inbox merchant sebagai kategori Penting atau Pengumuman"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border p-6" style={inputStyle}>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Judul</label>
            <input
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Mis: Pemeliharaan sistem pembayaran"
              className="w-full border rounded-xl px-3 py-2.5 text-sm outline-none mb-4"
              style={inputStyle}
            />

            <label className="block text-xs font-semibold text-gray-600 mb-1">Isi Pesan</label>
            <textarea
              rows={4}
              value={pesan}
              onChange={(e) => setPesan(e.target.value)}
              placeholder="Tulis isi pengumuman untuk merchant..."
              className="w-full border rounded-xl px-3 py-2.5 text-sm outline-none resize-none mb-4"
              style={inputStyle}
            />

            <label className="block text-xs font-semibold text-gray-600 mb-2">Kategori</label>
            <div className="flex gap-2 mb-5">
              {TIPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTipe(opt.value)}
                  className="flex-1 text-left px-4 py-3 rounded-xl border transition-colors"
                  style={{
                    borderColor: tipe === opt.value ? '#1D3A27' : '#e5e7eb',
                    background: tipe === opt.value ? '#f0fdf4' : 'white',
                  }}
                >
                  <div className="text-sm font-semibold text-gray-800">{opt.label}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>

            <label className="block text-xs font-semibold text-gray-600 mb-2">Tujuan</label>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setTargetAll(true)}
                className="flex-1 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors"
                style={{
                  borderColor: targetAll ? '#1D3A27' : '#e5e7eb',
                  background: targetAll ? '#f0fdf4' : 'white',
                  color: targetAll ? '#1D3A27' : '#6b7280',
                }}
              >
                Semua Merchant
              </button>
              <button
                onClick={() => setTargetAll(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors"
                style={{
                  borderColor: !targetAll ? '#1D3A27' : '#e5e7eb',
                  background: !targetAll ? '#f0fdf4' : 'white',
                  color: !targetAll ? '#1D3A27' : '#6b7280',
                }}
              >
                Pilih Merchant
              </button>
            </div>

            {!targetAll && (
              <div className="border rounded-xl p-2 mb-4 max-h-52 overflow-y-auto" style={inputStyle}>
                {merchants.length === 0 ? (
                  <p className="text-xs text-gray-400 px-2 py-3 text-center">Memuat merchant...</p>
                ) : (
                  merchants.map((m) => (
                    <label key={m.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(m.id)}
                        onChange={() => toggleMerchant(m.id)}
                      />
                      <span className="text-sm text-gray-700">{m.name}</span>
                      <span className="text-[11px] text-gray-400">#{m.id}</span>
                    </label>
                  ))
                )}
              </div>
            )}

            <button
              onClick={handleSend}
              disabled={!canSend}
              className="w-full mt-2 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40"
              style={{ background: '#1D3A27' }}
            >
              {sending ? 'Mengirim...' : 'Kirim Pengumuman'}
            </button>
          </div>

          {/* Riwayat */}
          <div className="bg-white rounded-2xl border p-6" style={inputStyle}>
            <h3 className="font-bold text-gray-800 text-sm mb-4">Riwayat Pengumuman</h3>
            {history.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6">Belum ada pengumuman terkirim.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {history.map((h, i) => (
                  <div key={i} className="border rounded-xl p-3" style={inputStyle}>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase"
                        style={{
                          background: h.tipe === 'penting' ? '#fef2f2' : '#f3f4f6',
                          color: h.tipe === 'penting' ? '#dc2626' : '#374151',
                        }}
                      >
                        {h.tipe}
                      </span>
                      <span className="text-[11px] text-gray-400">{h.penerima} merchant</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 truncate">{h.judul}</p>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{h.pesan}</p>
                    <p className="text-[11px] text-gray-400 mt-1">{formatDate(h.created_at)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </PageContainer>

      <ToastList toasts={toasts} onRemove={removeToast} />
    </>
  );
};

export default Announcements;
