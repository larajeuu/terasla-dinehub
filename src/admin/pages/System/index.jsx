import { useState, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';
import PageContainer from '../../components/PageContainer';
import FormModal from '../../components/FormModal';
import { PlusIcon, EditIcon, TrashIcon } from '../../components/icons';
import {
  getPaymentMethods, createPaymentMethod, updatePaymentMethod, deletePaymentMethod,
} from '../../../services/paymentMethodService';
import {
  getDiningTables, createDiningTable, updateDiningTable, deleteDiningTable, buildScanUrl,
} from '../../../services/diningTableService';
import {
  getAllCategories, createCategory, updateCategory, deleteCategory,
} from '../../../services/adminCategoryService';
import {
  getAllBanners, createBanner, updateBanner, deleteBanner, uploadBannerImage,
} from '../../../services/bannerService';
import {
  getPlatformSettings, updatePlatformSettings, calcServiceFee,
} from '../../../services/platformSettingService';
import { formatRupiah } from '../../../shared/utils/format';

const TABS = [
  { id: 'banner', label: 'Banner Promo' },
  { id: 'payment', label: 'Metode Pembayaran' },
  { id: 'qr', label: 'QR Meja' },
  { id: 'category', label: 'Kategori Produk' },
  { id: 'revenue', label: 'Biaya Layanan' },
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

const upsert = (setList, item) =>
  setList((prev) => (prev.some((x) => x.id === item.id)
    ? prev.map((x) => (x.id === item.id ? item : x))
    : [...prev, item]));

const System = () => {
  const [activeTab, setActiveTab] = useState('banner');
  const [banners, setBanners] = useState([]);
  const [payments, setPayments] = useState([]);
  const [tables, setTables] = useState([]);
  const [categories, setCategories] = useState([]);
  const [revenue, setRevenue] = useState(null);
  const [revenueDraft, setRevenueDraft] = useState({ fee_rate: 0, fee_fixed: 0, is_active: true });
  const [savingRevenue, setSavingRevenue] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null); // konfigurasi FormModal aktif

  const loadAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [b, p, t, c, r] = await Promise.all([
        getAllBanners(),
        getPaymentMethods(),
        getDiningTables(),
        getAllCategories(),
        getPlatformSettings(),
      ]);
      setBanners(b);
      setPayments(p);
      setTables(t);
      setCategories(c);
      setRevenue(r);
      setRevenueDraft({ fee_rate: r.fee_rate, fee_fixed: r.fee_fixed, is_active: r.is_active });
    } catch (err) {
      setError(err?.response?.data?.detail || 'Gagal memuat data pengaturan');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveRevenue = async () => {
    try {
      setSavingRevenue(true);
      const updated = await updatePlatformSettings({
        fee_rate: parseFloat(revenueDraft.fee_rate) || 0,
        fee_fixed: parseFloat(revenueDraft.fee_fixed) || 0,
        is_active: revenueDraft.is_active,
      });
      setRevenue(updated);
      setRevenueDraft({ fee_rate: updated.fee_rate, fee_fixed: updated.fee_fixed, is_active: updated.is_active });
      alert('Biaya layanan berhasil disimpan');
    } catch (err) {
      apiError(err, 'Gagal menyimpan biaya layanan');
    } finally {
      setSavingRevenue(false);
    }
  };

  useEffect(() => { loadAll(); }, [loadAll]);

  // ── Banner ──────────────────────────────────────────────────────────────
  const BANNER_FIELDS = [
    { name: 'title', label: 'Judul', required: true },
    { name: 'subtitle', label: 'Subjudul', type: 'textarea' },
    { name: 'badge', label: 'Badge', placeholder: 'mis. Promo Spesial!' },
    { name: 'image_url', label: 'Gambar Banner', type: 'image', upload: uploadBannerImage, placeholder: 'Opsional — tanpa gambar memakai gaya gradien' },
  ];
  const addBanner = () => setModal({
    title: 'Tambah Banner', fields: BANNER_FIELDS, submitLabel: 'Tambah',
    onSubmit: async (v) => upsert(setBanners, await createBanner(v)),
  });
  const editBanner = (b) => setModal({
    title: 'Edit Banner', fields: BANNER_FIELDS, initialValues: b, submitLabel: 'Simpan',
    onSubmit: async (v) => upsert(setBanners, await updateBanner(b.id, v)),
  });
  const toggleBanner = async (b) => {
    try { upsert(setBanners, await updateBanner(b.id, { is_active: !b.is_active })); }
    catch (err) { apiError(err, 'Gagal mengubah status banner'); }
  };
  const removeBanner = async (b) => {
    if (!confirm(`Hapus banner "${b.title}"?`)) return;
    try { await deleteBanner(b.id); setBanners((prev) => prev.filter((x) => x.id !== b.id)); }
    catch (err) { apiError(err, 'Gagal menghapus banner'); }
  };

  // ── Payment ─────────────────────────────────────────────────────────────
  const PAYMENT_FIELDS = [
    { name: 'nama_metode', label: 'Nama Metode', required: true },
    { name: 'fee', label: 'Fee', placeholder: 'mis. 0.7% atau Rp 2.000' },
  ];
  const addPayment = () => setModal({
    title: 'Tambah Metode Pembayaran', fields: PAYMENT_FIELDS, submitLabel: 'Tambah',
    onSubmit: async (v) => upsert(setPayments, await createPaymentMethod(v)),
  });
  const editPayment = (p) => setModal({
    title: 'Edit Metode Pembayaran', fields: PAYMENT_FIELDS, initialValues: p, submitLabel: 'Simpan',
    onSubmit: async (v) => upsert(setPayments, await updatePaymentMethod(p.id, v)),
  });
  const togglePayment = async (p) => {
    try { upsert(setPayments, await updatePaymentMethod(p.id, { is_active: !p.is_active })); }
    catch (err) { apiError(err, 'Gagal mengubah status metode'); }
  };
  const removePayment = async (p) => {
    if (!confirm(`Hapus metode "${p.nama_metode}"?`)) return;
    try { await deletePaymentMethod(p.id); setPayments((prev) => prev.filter((x) => x.id !== p.id)); }
    catch (err) { apiError(err, 'Gagal menghapus metode'); }
  };

  // ── QR Meja ─────────────────────────────────────────────────────────────
  const TABLE_FIELDS = [{ name: 'label', label: 'Label Meja', required: true, placeholder: 'mis. T-06' }];
  const addTable = () => setModal({
    title: 'Tambah Meja', fields: TABLE_FIELDS, submitLabel: 'Tambah',
    onSubmit: async (v) => upsert(setTables, await createDiningTable(v)),
  });
  const editTable = (t) => setModal({
    title: 'Edit Meja', fields: TABLE_FIELDS, initialValues: t, submitLabel: 'Simpan',
    onSubmit: async (v) => upsert(setTables, await updateDiningTable(t.id, v)),
  });
  const toggleTable = async (t) => {
    try { upsert(setTables, await updateDiningTable(t.id, { is_active: !t.is_active })); }
    catch (err) { apiError(err, 'Gagal mengubah status meja'); }
  };
  const removeTable = async (t) => {
    if (!confirm(`Hapus meja "${t.label}"?`)) return;
    try { await deleteDiningTable(t.id); setTables((prev) => prev.filter((x) => x.id !== t.id)); }
    catch (err) { apiError(err, 'Gagal menghapus meja'); }
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

  // ── Kategori Produk (global) ──────────────────────────────────────────────
  const CATEGORY_FIELDS = [{ name: 'nama_kategori', label: 'Nama Kategori', required: true, placeholder: 'mis. Minuman' }];
  const addCategory = () => setModal({
    title: 'Tambah Kategori', fields: CATEGORY_FIELDS, submitLabel: 'Tambah',
    onSubmit: async (v) => upsert(setCategories, await createCategory(v)),
  });
  const editCategory = (c) => setModal({
    title: 'Edit Kategori', fields: CATEGORY_FIELDS, initialValues: c, submitLabel: 'Simpan',
    onSubmit: async (v) => upsert(setCategories, await updateCategory(c.id, v)),
  });
  const removeCategory = async (c) => {
    const extra = c.jumlah_produk ? ` ${c.jumlah_produk} produk akan kehilangan kategori ini.` : '';
    if (!confirm(`Hapus kategori "${c.nama_kategori}"?${extra}`)) return;
    try { await deleteCategory(c.id); setCategories((prev) => prev.filter((x) => x.id !== c.id)); }
    catch (err) { apiError(err, 'Gagal menghapus kategori'); }
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
              <PlusIcon size={14} /> Tambah Banner
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
                  <div className="text-[11px] text-gray-500">Fee: {p.fee || '—'}</div>
                </div>
              </div>
              <Toggle big checked={p.is_active} onChange={() => togglePayment(p)} />
              <button onClick={() => editPayment(p)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"><EditIcon size={14} /></button>
              <button onClick={() => removePayment(p)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500"><TrashIcon size={14} /></button>
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
                        <button onClick={() => editTable(t)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"><EditIcon size={13} /></button>
                        <button onClick={() => removeTable(t)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500"><TrashIcon size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Category (global, CRUD) */}
      {activeTab === 'category' && (
        <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: '#e5e7eb', fontFamily: "'Inter', sans-serif" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold" style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}>Kategori Produk</h3>
              <p className="text-xs text-gray-500 mt-0.5">Kategori global dipakai semua tenant untuk mengelompokkan produk</p>
            </div>
            <button onClick={addCategory} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: '#C8961A' }}>
              <PlusIcon size={14} /> Tambah Kategori
            </button>
          </div>
          {categories.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">Belum ada kategori.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <div key={c.id} className="flex items-center gap-2 px-3 py-2 rounded-xl border" style={{ borderColor: '#e5e7eb' }}>
                  <span className="text-sm font-semibold text-gray-800">{c.nama_kategori}</span>
                  <span className="text-[11px] text-gray-400">({c.jumlah_produk} produk)</span>
                  <button onClick={() => editCategory(c)} className="text-gray-400 hover:text-gray-700"><EditIcon size={12} /></button>
                  <button onClick={() => removeCategory(c)} className="text-gray-400 hover:text-red-500"><TrashIcon size={12} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Revenue / Biaya Layanan */}
      {activeTab === 'revenue' && (
        <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: '#e5e7eb', fontFamily: "'Inter', sans-serif" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold" style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}>Biaya Layanan Platform</h3>
              <p className="text-xs text-gray-500 mt-0.5">Pendapatan platform per transaksi — dibebankan ke customer (ditambahkan ke total bayar)</p>
            </div>
            <Toggle big checked={revenueDraft.is_active} onChange={() => setRevenueDraft((d) => ({ ...d, is_active: !d.is_active }))} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Persentase (%)</label>
              <input
                type="number" step="0.1" min="0" max="100"
                value={revenueDraft.fee_rate}
                onChange={(e) => setRevenueDraft((d) => ({ ...d, fee_rate: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:border-green-600"
                style={{ borderColor: '#e5e7eb' }}
                placeholder="mis. 5"
              />
              <p className="text-[11px] text-gray-400 mt-1">Persen dari subtotal produk</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nominal Tetap (Rp)</label>
              <input
                type="number" step="100" min="0"
                value={revenueDraft.fee_fixed}
                onChange={(e) => setRevenueDraft((d) => ({ ...d, fee_fixed: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:border-green-600"
                style={{ borderColor: '#e5e7eb' }}
                placeholder="mis. 1000"
              />
              <p className="text-[11px] text-gray-400 mt-1">Biaya tetap per transaksi</p>
            </div>
          </div>

          {/* Pratinjau perhitungan */}
          <div className="mt-5 p-4 rounded-xl max-w-xl" style={{ background: '#f9fafb', border: '1px solid #f1f5f9' }}>
            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-2">Simulasi (subtotal Rp 50.000)</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Biaya layanan</span>
              <span className="font-bold tabular-nums" style={{ color: '#1D3A27' }}>
                {formatRupiah(calcServiceFee(50000, {
                  fee_rate: parseFloat(revenueDraft.fee_rate) || 0,
                  fee_fixed: parseFloat(revenueDraft.fee_fixed) || 0,
                  is_active: revenueDraft.is_active,
                }))}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-600">Total bayar customer</span>
              <span className="font-bold tabular-nums" style={{ color: '#1D3A27' }}>
                {formatRupiah(50000 + calcServiceFee(50000, {
                  fee_rate: parseFloat(revenueDraft.fee_rate) || 0,
                  fee_fixed: parseFloat(revenueDraft.fee_fixed) || 0,
                  is_active: revenueDraft.is_active,
                }))}
              </span>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={saveRevenue}
              disabled={savingRevenue}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
              style={{ background: '#1D3A27' }}
            >
              {savingRevenue ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
            {revenue && (
              <span className="text-[11px] text-gray-400">
                Aktif sekarang: {revenue.is_active ? `${revenue.fee_rate}% + ${formatRupiah(revenue.fee_fixed)}` : 'Nonaktif'}
              </span>
            )}
          </div>
        </div>
      )}

      {modal && <FormModal {...modal} onClose={() => setModal(null)} />}
    </PageContainer>
  );
};

export default System;
