import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PageContainer from '../../components/PageContainer';
import Badge from '../../components/Badge';
import {
  BackIcon,
  MerchantIcon,
  MailIcon,
  PhoneIcon,
  RevenueIcon,
  ReceiptIcon,
  WithdrawIcon,
  CheckIcon,
  XIcon,
} from '../../components/icons';
import { getMerchantById, updateMerchantStatus } from '../../../services/merchantService';
import { deleteProduct, setProductBan } from '../../../services/productService';
import { getMerchantOrders } from '../../../services/merchantOrderService';
import { getReviews } from '../../../services/reviewService';
import { formatCurrency, formatDate, formatDateShort } from '../../utils/format';

const MerchantDetail = () => {
  const { merchantId } = useParams();
  const navigate = useNavigate();

  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [banningId, setBanningId] = useState(null);
  // Feedback hapus produk: { type: 'blocked' | 'error' | 'ok', text }
  const [productMsg, setProductMsg] = useState(null);

  useEffect(() => {
    let active = true;
    getMerchantById(merchantId)
      .then((data) => { if (active) { setMerchant(data); setError(null); } })
      .catch((err) => {
        if (active) setError(err?.response?.status === 404 ? 'notfound' : 'load');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [merchantId]);

  useEffect(() => {
    let active = true;
    getMerchantOrders(merchantId)
      .then((data) => { if (active) setOrders(data); })
      .catch(() => { if (active) setOrders([]); });
    getReviews(merchantId)
      .then((data) => { if (active) setReviews(data); })
      .catch(() => { if (active) setReviews([]); });
    return () => { active = false; };
  }, [merchantId]);

  const changeStatus = async (status) => {
    const prev = merchant;
    setUpdating(true);
    setMerchant((m) => ({ ...m, status }));
    try {
      await updateMerchantStatus(merchantId, status);
    } catch {
      setMerchant(prev);
      setError('update');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteProduct = async (p) => {
    if (!window.confirm(`Hapus produk "${p.name}" milik ${merchant?.name}?`)) return;
    setDeletingId(p.id);
    setProductMsg(null);
    try {
      await deleteProduct(p.id);
      setMerchant((m) => ({ ...m, products: (m.products || []).filter((x) => x.id !== p.id) }));
      setProductMsg({ type: 'ok', text: `Produk "${p.name}" berhasil dihapus.` });
    } catch (err) {
      const status = err?.response?.status;
      const detail = err?.response?.data?.detail;
      if (status === 409) {
        // Produk sudah dipakai transaksi → tidak boleh dihapus, sarankan nonaktif.
        setProductMsg({
          type: 'blocked',
          text: detail || `Produk "${p.name}" sudah dipakai transaksi sehingga tidak dapat dihapus. Sarankan merchant menonaktifkannya saja.`,
        });
      } else {
        setProductMsg({ type: 'error', text: detail || 'Gagal menghapus produk.' });
      }
    } finally {
      setDeletingId(null);
    }
  };

  // Blokir / buka-blokir produk. Tidak menghapus data — produk hanya
  // disembunyikan dari pelanggan & tak bisa dipesan; merchant tak bisa membuka.
  const handleToggleBan = async (p) => {
    const next = !p.isBanned;
    if (next && !window.confirm(`Blokir produk "${p.name}"? Produk akan disembunyikan dari pelanggan dan merchant tidak bisa membukanya sendiri.`)) return;
    setBanningId(p.id);
    setProductMsg(null);
    const prevProducts = merchant.products;
    // Optimistic update.
    setMerchant((m) => ({
      ...m,
      products: (m.products || []).map((x) => (x.id === p.id ? { ...x, isBanned: next } : x)),
    }));
    try {
      await setProductBan(p.id, next);
      setProductMsg({
        type: 'ok',
        text: next ? `Produk "${p.name}" diblokir.` : `Blokir produk "${p.name}" dibuka.`,
      });
    } catch (err) {
      setMerchant((m) => ({ ...m, products: prevProducts }));
      setProductMsg({ type: 'error', text: err?.response?.data?.detail || 'Gagal mengubah status blokir produk.' });
    } finally {
      setBanningId(null);
    }
  };

  if (loading) {
    return (
      <PageContainer title="Detail Merchant" subtitle={`Merchant ID: ${merchantId}`}>
        <div className="bg-white rounded-2xl border p-10 text-center text-gray-400 text-sm" style={{ borderColor: '#e5e7eb' }}>
          Memuat data merchant...
        </div>
      </PageContainer>
    );
  }

  if (error === 'notfound' || (!merchant && error)) {
    return (
      <PageContainer title="Merchant Tidak Ditemukan" subtitle={`Merchant ID: ${merchantId}`}>
        <div className="bg-white rounded-2xl border p-10 text-center" style={{ borderColor: '#e5e7eb', fontFamily: "'Inter', sans-serif" }}>
          <div className="text-gray-500 mb-4">
            {error === 'notfound'
              ? <>Merchant dengan ID <span className="font-mono">{merchantId}</span> tidak ada di server.</>
              : 'Gagal memuat data merchant dari server.'}
          </div>
          <Link
            to="/admin/merchants"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: '#1D3A27' }}
          >
            <BackIcon size={16} />
            Kembali ke Merchant
          </Link>
        </div>
      </PageContainer>
    );
  }

  const m = merchant;

  return (
    <PageContainer
      title={m.name}
      subtitle="Detail merchant & katalog produk"
      actions={
        <button
          onClick={() => navigate('/admin/merchants')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border bg-white"
          style={{ borderColor: '#e5e7eb', color: '#475569' }}
        >
          <BackIcon size={15} />
          <span className="hidden sm:inline">Kembali</span>
        </button>
      }
    >
      {error === 'update' && (
        <div className="mb-4 rounded-xl px-4 py-3 text-sm" style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' }}>
          Gagal memperbarui status merchant.
        </div>
      )}

      {/* Profile card */}
      <div className="bg-white rounded-2xl border p-6 mb-6" style={{ borderColor: '#e5e7eb', fontFamily: "'Inter', sans-serif" }}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold shrink-0"
              style={{ background: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
            >
              {m.name?.charAt(0) || '?'}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xl font-bold" style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}>
                  {m.name}
                </span>
                <Badge status={m.status} />
              </div>
              <div className="text-sm text-gray-600">
                {m.block} · {m.category} · ⭐ {m.rating?.toFixed(1)}
              </div>
              {m.deskripsi && <div className="text-[13px] text-gray-500 mt-1">{m.deskripsi}</div>}
            </div>
          </div>

          <div className="flex gap-2">
            {m.status === 'pending' && (
              <>
                <ActionButton onClick={() => changeStatus('active')} disabled={updating} bg="#16a34a" icon={CheckIcon}>
                  Approve
                </ActionButton>
                <ActionButton onClick={() => changeStatus('suspended')} disabled={updating} bg="#ef4444" icon={XIcon}>
                  Tolak
                </ActionButton>
              </>
            )}
            {m.status === 'active' && (
              <ActionButton onClick={() => changeStatus('suspended')} disabled={updating} bg="#ef4444" icon={XIcon}>
                Suspend
              </ActionButton>
            )}
            {m.status === 'suspended' && (
              <ActionButton onClick={() => changeStatus('active')} disabled={updating} bg="#16a34a" icon={CheckIcon}>
                Aktifkan
              </ActionButton>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5 mt-5 border-t" style={{ borderColor: '#f1f5f9' }}>
          <Info label="Owner" value={m.owner || '-'} />
          <Info label="Email" value={m.email || '-'} icon={MailIcon} />
          <Info label="Telepon" value={m.phone || '-'} icon={PhoneIcon} />
          <Info label="Bergabung" value={formatDateShort(m.joinedAt)} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat icon={ReceiptIcon} iconBg="#1D3A27" label="Total Pesanan" value={(m.totalOrders ?? 0).toLocaleString('id-ID')} />
        <Stat icon={RevenueIcon} iconBg="#C8961A" label="Total Revenue" value={formatCurrency(m.totalRevenue)} />
        <Stat icon={WithdrawIcon} iconBg="#0891b2" label="Saldo" value={formatCurrency(m.balance)} />
        <Stat icon={MerchantIcon} iconBg="#16a34a" label="Jumlah Produk" value={`${m.products?.length || 0} produk`} />
      </div>

      {/* Products */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e5e7eb', fontFamily: "'Inter', sans-serif" }}>
        <div className="p-5 border-b" style={{ borderColor: '#e5e7eb' }}>
          <h2 className="text-base font-bold" style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}>
            Katalog Produk
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">{m.products?.length || 0} produk dari API backend</p>
        </div>

        {productMsg && (
          <div
            className="mx-5 mt-4 rounded-xl px-4 py-3 text-sm"
            style={
              productMsg.type === 'ok'
                ? { background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0' }
                : productMsg.type === 'blocked'
                ? { background: '#fffbeb', color: '#92400e', border: '1px solid #fde68a' }
                : { background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' }
            }
          >
            {productMsg.text}
          </div>
        )}

        {(!m.products || m.products.length === 0) ? (
          <div className="p-10 text-center text-gray-400 text-sm">Belum ada produk</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ background: '#f9fafb' }}>
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Produk</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Harga</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Stok</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {m.products.map((p) => (
                  <tr key={p.id} className="border-t" style={{ borderColor: '#f1f5f9' }}>
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      <div className="flex items-center gap-2">
                        {p.name}
                        {p.isBanned && (
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
                            style={{ background: '#fee2e2', color: '#b91c1c' }}
                          >
                            Diblokir
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: '#1D3A27' }}>
                      {formatCurrency(p.price)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold"
                        style={{
                          background: p.stock > 0 ? '#dcfce7' : '#fee2e2',
                          color: p.stock > 0 ? '#15803d' : '#b91c1c',
                        }}
                      >
                        {p.stock > 0 ? `${p.stock} tersedia` : 'Habis'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleToggleBan(p)}
                          disabled={banningId === p.id}
                          title={p.isBanned ? 'Buka blokir produk' : 'Blokir produk dari pelanggan'}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-50"
                          style={
                            p.isBanned
                              ? { background: '#16a34a', color: '#fff' }
                              : { background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa' }
                          }
                        >
                          {banningId === p.id
                            ? 'Memproses...'
                            : p.isBanned
                            ? 'Buka Blokir'
                            : 'Blokir'}
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p)}
                          disabled={deletingId === p.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-50"
                          style={{ background: '#fff', color: '#dc2626', border: '1px solid #fecaca' }}
                        >
                          <XIcon size={13} />
                          {deletingId === p.id ? 'Menghapus...' : 'Hapus'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Riwayat Order */}
      <div className="bg-white rounded-2xl border overflow-hidden mt-6" style={{ borderColor: '#e5e7eb', fontFamily: "'Inter', sans-serif" }}>
        <div className="p-5 border-b" style={{ borderColor: '#e5e7eb' }}>
          <h2 className="text-base font-bold" style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}>
            Riwayat Order
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">{orders.length} order tenant dari API</p>
        </div>
        {orders.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">Belum ada order</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ background: '#f9fafb' }}>
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Order</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Meja</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t" style={{ borderColor: '#f1f5f9' }}>
                    <td className="px-4 py-3">
                      <div className="font-mono text-xs font-semibold text-gray-800">{o.orderCode}</div>
                      {o.preview && <div className="text-[11px] text-gray-500 truncate max-w-55">{o.preview}</div>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{o.customer || '-'}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-md text-[11px] font-mono font-semibold bg-gray-100 text-gray-700">
                        {o.table || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3"><Badge status={o.status} /></td>
                    <td className="px-4 py-3 font-bold text-sm whitespace-nowrap" style={{ color: '#1D3A27' }}>
                      {formatCurrency(o.total)}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{formatDate(o.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ulasan */}
      <div className="bg-white rounded-2xl border overflow-hidden mt-6" style={{ borderColor: '#e5e7eb', fontFamily: "'Inter', sans-serif" }}>
        <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: '#e5e7eb' }}>
          <div>
            <h2 className="text-base font-bold" style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}>
              Ulasan
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">{reviews.length} ulasan dari pelanggan</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold" style={{ color: '#C8961A', fontFamily: "'Poppins', sans-serif" }}>
              {(m.rating ?? 0).toFixed(1)}
            </div>
            <Stars value={Math.round(m.rating || 0)} />
          </div>
        </div>
        {reviews.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">Belum ada ulasan</div>
        ) : (
          <div className="divide-y" style={{ borderColor: '#f1f5f9' }}>
            {reviews.map((r) => (
              <div key={r.id} className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-800">{r.author || 'Anonim'}</span>
                    <Stars value={r.rating} />
                  </div>
                  <span className="text-[11px] text-gray-400">{formatDateShort(r.date)}</span>
                </div>
                {r.comment && <p className="text-sm text-gray-600">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
};

const Stars = ({ value = 0 }) => (
  <span style={{ color: '#f59e0b', letterSpacing: '1px' }} aria-label={`${value} dari 5`}>
    {'★'.repeat(value)}<span style={{ color: '#d1d5db' }}>{'★'.repeat(Math.max(0, 5 - value))}</span>
  </span>
);

const ActionButton = ({ onClick, disabled, bg, icon: Icon, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
    style={{ background: bg }}
  >
    <Icon size={14} />
    {children}
  </button>
);

const Info = ({ label, value, icon: Icon }) => (
  <div>
    <div className="text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">{label}</div>
    <div className="text-sm font-semibold text-gray-800 truncate flex items-center gap-1.5">
      {Icon && <Icon size={14} />}
      {value}
    </div>
  </div>
);

const Stat = ({ icon: Icon, iconBg, label, value }) => (
  <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: '#e5e7eb', fontFamily: "'Inter', sans-serif" }}>
    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4" style={{ background: iconBg }}>
      <Icon size={20} />
    </div>
    <div className="text-xs text-gray-500 font-medium mb-1">{label}</div>
    <div className="text-xl font-bold" style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}>
      {value}
    </div>
  </div>
);

export default MerchantDetail;
