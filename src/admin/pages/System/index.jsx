import { useState, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';
import PageContainer from '../../components/PageContainer';
import { PlusIcon, EditIcon, TrashIcon } from '../../components/icons';
import {
  getPaymentMethods, createPaymentMethod, updatePaymentMethod, deletePaymentMethod,
} from '../../../services/paymentMethodService';
import {
  getDiningTables, createDiningTable, updateDiningTable, deleteDiningTable, buildScanUrl,
} from '../../../services/diningTableService';
import { getAllCategories } from '../../../services/adminCategoryService';
import {
  getAllBanners, createBanner, updateBanner, deleteBanner,
} from '../../../services/bannerService';

const TABS = [
  { id: 'banner', label: 'Banner Promo' },
  { id: 'payment', label: 'Metode Pembayaran' },
  { id: 'qr', label: 'QR Meja' },
  { id: 'category', label: 'Kategori Produk' },
];

const apiError = (err, fallback) =>
  alert(err?.response?.data?.detail || fallback || 'Terjadi kesalahan');

const Toggle = ({ checked, onChange, big = false }) => (
  <label className="flex items-center cursor-pointer shrink-0">
    <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
    <div className={`${big ? 'w-11 h-6' : 'w-9 h-5'} bg-gray-200 rounded-full peer peer-checked:bg-green-500 relative transition-colors`}>
      <div className={`absolute top-0.5 ${big ? 'w-5 h-5' : 'w-4 h-4'} bg-white rounded-full transition-transform ${checked ? (big ? 'left-5.5' : 'left-4.5') : 'left-0.5'}`} />
    </div>
  </label>
);

const System = () => {
  const [activeTab, setActiveTab] = useState('banner');
  const [banners, setBanners] = useState([]);
  const [payments, setPayments] = useState([]);
  const [tables, setTables] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [b, p, t, c] = await Promise.all([
        getAllBanners(),
        getPaymentMethods(),
        getDiningTables(),
        getAllCategories(),
      ]);
      setBanners(b);
      setPayments(p);
      setTables(t);
      setCategories(c);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Gagal memuat data pengaturan');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  // ── Banner ──────────────────────────────────────────────────────────────
  const addBanner = async () => {
    const title = prompt('Judul banner:');
    if (!title?.trim()) return;
    const image_url = prompt('URL gambar (opsional, kosongkan untuk gaya gradien):') || '';
    try {
      const created = await createBanner({ title: title.trim(), image_url: image_url.trim() });
      setBanners((prev) => [...prev, created]);
    } catch (err) { apiError(err, 'Gagal menambah banner'); }
  };
  const editBanner = async (b) => {
    const title = prompt('Judul banner:', b.title);
    if (title === null) return;
    try {
      const updated = await updateBanner(b.id, { title: title.trim() });
      setBanners((prev) => prev.map((x) => (x.id === b.id ? updated : x)));
    } catch (err) { apiError(err, 'Gagal mengubah banner'); }
  };
  const toggleBanner = async (b) => {
    try {
      const updated = await updateBanner(b.id, { is_active: !b.is_active });
      setBanners((prev) => prev.map((x) => (x.id === b.id ? updated : x)));
    } catch (err) { apiError(err, 'Gagal mengubah status banner'); }
  };
  const removeBanner = async (b) => {
    if (!confirm(`Hapus banner "${b.title}"?`)) return;
    try {
      await deleteBanner(b.id);
      setBanners((prev) => prev.filter((x) => x.id !== b.id));
    } catch (err) { apiError(err, 'Gagal menghapus banner'); }
  };

  // ── Payment ─────────────────────────────────────────────────────────────
  const addPayment = async () => {
    const nama_metode = prompt('Nama metode pembayaran:');
    if (!nama_metode?.trim()) return;
    const fee = prompt('Fee (mis. "0.7%" atau "Rp 2.000"):') || '';
    try {
      const created = await createPaymentMethod({ nama_metode: nama_metode.trim(), fee: fee.trim() });
      setPayments((prev) => [...prev, created]);
    } catch (err) { apiError(err, 'Gagal menambah metode'); }
  };
  const editPaymentFee = async (p) => {
    const fee = prompt(`Fee untuk ${p.nama_metode}:`, p.fee);
    if (fee === null) return;
    try {
      const updated = await updatePaymentMethod(p.id, { fee: fee.trim() });
      setPayments((prev) => prev.map((x) => (x.id === p.id ? updated : x)));
    } catch (err) { apiError(err, 'Gagal mengubah fee'); }
  };
  const togglePayment = async (p) => {
    try {
      const updated = await updatePaymentMethod(p.id, { is_active: !p.is_active });
      setPayments((prev) => prev.map((x) => (x.id === p.id ? updated : x)));
    } catch (err) { apiError(err, 'Gagal mengubah status metode'); }
  };
  const removePayment = async (p) => {
    if (!confirm(`Hapus metode "${p.nama_metode}"?`)) return;
    try {
      await deletePaymentMethod(p.id);
      setPayments((prev) => prev.filter((x) => x.id !== p.id));
    } catch (err) { apiError(err, 'Gagal menghapus metode'); }
  };

  // ── QR Meja ─────────────────────────────────────────────────────────────
  const addTable = async () => {
    const label = prompt('Label meja (mis. "T-06"):');
    if (!label?.trim()) return;
    try {
      const created = await createDiningTable({ label: label.trim() });
      setTables((prev) => [...prev, created]);
    } catch (err) { apiError(err, 'Gagal menambah meja'); }
  };
  const editTable = async (t) => {
    const label = prompt('Label meja:', t.label);
    if (label === null) return;
    try {
      const updated = await updateDiningTable(t.id, { label: label.trim() });
      setTables((prev) => prev.map((x) => (x.id === t.id ? updated : x)));
    } catch (err) { apiError(err, 'Gagal mengubah meja'); }
  };
  const toggleTable = async (t) => {
    try {
      const updated = await updateDiningTable(t.id, { is_active: !t.is_active });
      setTables((prev) => prev.map((x) => (x.id === t.id ? updated : x)));
    } catch (err) { apiError(err, 'Gagal mengubah status meja'); }
  };
  const removeTable = async (t) => {
    if (!confirm(`Hapus meja "${t.label}"?`)) return;
    try {
      await deleteDiningTable(t.id);
      setTables((prev) => prev.filter((x) => x.id !== t.id));
    } catch (err) { apiError(err, 'Gagal menghapus meja'); }
  };
  const downloadQR = async (t) => {
    try {
      const dataUrl = await QRCode.toDataURL(buildScanUrl(t.code), { width: 512, margin: 2 });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `qr-${t.label}.png`;
      a.click();
    } catch (err) { apiError(err, 'Gagal membuat QR'); }
  };

  if (loading) {
    return (
      <PageContainer title="Pengaturan Sistem" subtitle="Konfigurasi banner, pembayaran, QR meja, dan kategori">
        <div className="py-16 text-center text-gray-400 text-sm">Memuat data...</div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Pengaturan Sistem" subtitle="Konfigurasi banner, pembayaran, QR meja, dan kategori">
        <div className="py-16 text-center">
          <p className="text-red-500 text-sm mb-3">{error}</p>
          <button onClick={loadAll} className="text-sm font-semibold px-4 py-2 rounded-lg text-white" style={{ background: '#1D3A27' }}>
            Coba Lagi
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Pengaturan Sistem"
      subtitle="Konfigurasi banner, pembayaran, QR meja, dan kategori"
    >
      {/* Tabs */}
      <div className="bg-white rounded-2xl border p-1.5 flex flex-wrap gap-1 mb-6" style={{ borderColor: '#e5e7eb', fontFamily: "'Inter', sans-serif" }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
            style={{
              background: activeTab === t.id ? '#1D3A27' : 'transparent',
              color: activeTab === t.id ? 'white' : '#475569',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Banner */}
      {activeTab === 'banner' && (
        <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: '#e5e7eb', fontFamily: "'Inter', sans-serif" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold" style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}>Banner Promo</h3>
              <p className="text-xs text-gray-500 mt-0.5">Banner yang muncul di home customer</p>
            </div>
            <button onClick={addBanner} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: '#C8961A' }}>
              <PlusIcon size={14} />
              Tambah Banner
            </button>
          </div>
          {banners.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">Belum ada banner.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {banners.map((b) => (
                <div key={b.id} className="rounded-2xl overflow-hidden border" style={{ borderColor: '#e5e7eb' }}>
                  <div className="w-full h-32 flex items-center justify-center text-white text-sm font-bold p-3 text-center"
                       style={{ background: b.image_url ? `url(${b.image_url}) center/cover` : (b.bg || '#1D3A27'), whiteSpace: 'pre-line' }}>
                    {!b.image_url && b.title}
                  </div>
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="text-sm font-semibold text-gray-800">{b.title}</div>
                      <Toggle checked={b.is_active} onChange={() => toggleBanner(b)} />
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => editBanner(b)} className="flex-1 px-2 py-1.5 rounded-lg text-[11px] font-semibold border flex items-center justify-center gap-1" style={{ borderColor: '#e5e7eb', color: '#475569' }}>
                        <EditIcon size={12} /> Edit
                      </button>
                      <button onClick={() => removeBanner(b)} className="px-2 py-1.5 rounded-lg text-[11px] font-semibold text-white" style={{ background: '#ef4444' }}>
                        <TrashIcon size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Payment */}
      {activeTab === 'payment' && (
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e5e7eb', fontFamily: "'Inter', sans-serif" }}>
          <div className="p-5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold" style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}>Metode Pembayaran</h3>
              <p className="text-xs text-gray-500 mt-0.5">Aktifkan/nonaktifkan dan atur fee per metode</p>
            </div>
            <button onClick={addPayment} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: '#C8961A' }}>
              <PlusIcon size={14} /> Tambah
            </button>
          </div>
          {payments.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-4 px-5 py-3 border-t" style={{ borderColor: '#f1f5f9' }}>
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: '#1D3A27' }}>
                  {p.nama_metode.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">{p.nama_metode}</div>
                  <button onClick={() => editPaymentFee(p)} className="text-[11px] text-gray-500 hover:text-gray-800 underline decoration-dotted">
                    Fee: {p.fee || '—'}
                  </button>
                </div>
              </div>
              <Toggle big checked={p.is_active} onChange={() => togglePayment(p)} />
              <button onClick={() => removePayment(p)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500">
                <TrashIcon size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* QR Tables */}
      {activeTab === 'qr' && (
        <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: '#e5e7eb', fontFamily: "'Inter', sans-serif" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold" style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}>QR Code Meja</h3>
              <p className="text-xs text-gray-500 mt-0.5">Generate QR per meja, dapat di-print untuk ditempel</p>
            </div>
            <button onClick={addTable} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: '#C8961A' }}>
              <PlusIcon size={14} /> Tambah Meja
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ background: '#f9fafb' }}>
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Label</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Kode QR</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Aktif</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {tables.map((t) => (
                  <tr key={t.id} className="border-t" style={{ borderColor: '#f1f5f9' }}>
                    <td className="px-4 py-3 font-mono text-xs">{t.id}</td>
                    <td className="px-4 py-3 font-semibold">{t.label}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{t.code}</td>
                    <td className="px-4 py-3"><Toggle checked={t.is_active} onChange={() => toggleTable(t)} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => downloadQR(t)} className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-white" style={{ background: '#1D3A27' }}>
                          Download QR
                        </button>
                        <button onClick={() => editTable(t)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600">
                          <EditIcon size={13} />
                        </button>
                        <button onClick={() => removeTable(t)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500">
                          <TrashIcon size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Category (read-only overview) */}
      {activeTab === 'category' && (
        <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: '#e5e7eb', fontFamily: "'Inter', sans-serif" }}>
          <div className="mb-4">
            <h3 className="text-base font-bold" style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}>Kategori Produk</h3>
            <p className="text-xs text-gray-500 mt-0.5">Pantauan kategori produk seluruh tenant. Pengelolaan dilakukan tiap merchant di panelnya.</p>
          </div>
          {categories.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">Belum ada kategori.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead style={{ background: '#f9fafb' }}>
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Kategori</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Merchant</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Jumlah Produk</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c.id} className="border-t" style={{ borderColor: '#f1f5f9' }}>
                      <td className="px-4 py-3 font-semibold text-gray-800">{c.nama_kategori}</td>
                      <td className="px-4 py-3 text-gray-600">{c.merchant_nama}</td>
                      <td className="px-4 py-3 text-gray-600">{c.jumlah_produk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </PageContainer>
  );
};

export default System;
