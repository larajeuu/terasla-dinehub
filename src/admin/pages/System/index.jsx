import { useState } from 'react';
import PageContainer from '../../components/PageContainer';
import { PlusIcon, EditIcon, TrashIcon } from '../../components/icons';

const TABS = [
  { id: 'banner', label: 'Banner Promo' },
  { id: 'payment', label: 'Metode Pembayaran' },
  { id: 'qr', label: 'QR Meja' },
  { id: 'category', label: 'Kategori Tenant' },
];

const initialBanners = [
  { id: 'b1', title: 'Diskon 30% Akhir Pekan', image: 'https://placehold.co/400x150/C8961A/ffffff?text=Banner+1', active: true },
  { id: 'b2', title: 'Promo Pelajar', image: 'https://placehold.co/400x150/1D3A27/ffffff?text=Banner+2', active: true },
  { id: 'b3', title: 'Cashback GoPay', image: 'https://placehold.co/400x150/16a34a/ffffff?text=Banner+3', active: false },
];

const initialPayments = [
  { id: 'qris', label: 'QRIS', enabled: true, fee: '0.7%' },
  { id: 'gopay', label: 'GoPay', enabled: true, fee: '2%' },
  { id: 'ovo', label: 'OVO', enabled: true, fee: '2%' },
  { id: 'dana', label: 'Dana', enabled: true, fee: '2%' },
  { id: 'cash', label: 'Cash', enabled: true, fee: '0%' },
  { id: 'cc', label: 'Credit Card', enabled: false, fee: '2.9% + Rp 2.000' },
];

const initialTables = [
  { id: 'T-001', block: 'A', code: 'A-01', tenant: 'Kantin Ea Ea' },
  { id: 'T-002', block: 'A', code: 'A-02', tenant: 'Es Teh Jumbo' },
  { id: 'T-003', block: 'B', code: 'B-01', tenant: 'Seblak Teh Rina' },
  { id: 'T-004', block: 'C', code: 'C-01', tenant: 'Siomay Asoy' },
  { id: 'T-005', block: 'D', code: 'D-01', tenant: 'Gorengan Bu Ami' },
];

const initialCategories = ['Makanan', 'Minuman', 'Camilan', 'Dessert'];

const System = () => {
  const [activeTab, setActiveTab] = useState('banner');
  const [banners, setBanners] = useState(initialBanners);
  const [payments, setPayments] = useState(initialPayments);
  const [tables] = useState(initialTables);
  const [categories, setCategories] = useState(initialCategories);

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
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: '#C8961A' }}>
              <PlusIcon size={14} />
              Tambah Banner
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {banners.map((b) => (
              <div key={b.id} className="rounded-2xl overflow-hidden border" style={{ borderColor: '#e5e7eb' }}>
                <img src={b.image} alt={b.title} className="w-full h-32 object-cover" />
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="text-sm font-semibold text-gray-800">{b.title}</div>
                    <label className="flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={b.active}
                        onChange={() => setBanners((prev) => prev.map((x) => x.id === b.id ? { ...x, active: !x.active } : x))}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-green-500 relative transition-colors">
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${b.active ? 'left-4.5' : 'left-0.5'}`} />
                      </div>
                    </label>
                  </div>
                  <div className="flex gap-1">
                    <button className="flex-1 px-2 py-1.5 rounded-lg text-[11px] font-semibold border" style={{ borderColor: '#e5e7eb', color: '#475569' }}>
                      <EditIcon size={12} /> Edit
                    </button>
                    <button className="px-2 py-1.5 rounded-lg text-[11px] font-semibold text-white" style={{ background: '#ef4444' }}>
                      <TrashIcon size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment */}
      {activeTab === 'payment' && (
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e5e7eb', fontFamily: "'Inter', sans-serif" }}>
          <div className="p-5">
            <h3 className="text-base font-bold" style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}>Metode Pembayaran</h3>
            <p className="text-xs text-gray-500 mt-0.5">Aktifkan/nonaktifkan dan atur fee per metode</p>
          </div>
          {payments.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-4 px-5 py-3 border-t" style={{ borderColor: '#f1f5f9' }}>
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: '#1D3A27' }}>
                  {p.label.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">{p.label}</div>
                  <div className="text-[11px] text-gray-500">Fee: {p.fee}</div>
                </div>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={p.enabled}
                  onChange={() => setPayments((prev) => prev.map((x) => x.id === p.id ? { ...x, enabled: !x.enabled } : x))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 relative transition-colors">
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${p.enabled ? 'left-5.5' : 'left-0.5'}`} />
                </div>
              </label>
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
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: '#C8961A' }}>
              <PlusIcon size={14} />
              Tambah Meja
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ background: '#f9fafb' }}>
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Blok</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Kode</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Tenant Default</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {tables.map((t) => (
                  <tr key={t.id} className="border-t" style={{ borderColor: '#f1f5f9' }}>
                    <td className="px-4 py-3 font-mono text-xs">{t.id}</td>
                    <td className="px-4 py-3">{t.block}</td>
                    <td className="px-4 py-3 font-semibold">{t.code}</td>
                    <td className="px-4 py-3">{t.tenant}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-white" style={{ background: '#1D3A27' }}>
                          Download QR
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600">
                          <EditIcon size={13} />
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

      {/* Category */}
      {activeTab === 'category' && (
        <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: '#e5e7eb', fontFamily: "'Inter', sans-serif" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold" style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}>Kategori Tenant</h3>
              <p className="text-xs text-gray-500 mt-0.5">Kategori untuk mengelompokkan tenant/merchant</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: '#C8961A' }}>
              <PlusIcon size={14} />
              Tambah
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c, i) => (
              <div key={c} className="flex items-center gap-2 px-3 py-2 rounded-xl border" style={{ borderColor: '#e5e7eb' }}>
                <span className="text-sm font-semibold text-gray-800">{c}</span>
                <button
                  onClick={() => setCategories((prev) => prev.filter((_, idx) => idx !== i))}
                  className="text-gray-400 hover:text-red-500"
                >
                  <TrashIcon size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default System;
