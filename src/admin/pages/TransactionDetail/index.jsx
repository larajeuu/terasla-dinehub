import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PageContainer from '../../components/PageContainer';
import Badge from '../../components/Badge';
import { BackIcon, ReceiptIcon, MerchantIcon } from '../../components/icons';
import { getCustomerOrderById, isItemRefunded } from '../../../services/customerOrderService';
import { formatCurrency, formatDate } from '../../utils/format';

const TransactionDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    getCustomerOrderById(orderId)
      .then((data) => { if (active) { setOrder(data); setError(null); } })
      .catch((err) => {
        if (active) setError(err?.response?.status === 404 ? 'notfound' : 'load');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [orderId]);

  if (loading) {
    return (
      <PageContainer title="Detail Order" subtitle={`Order #${orderId}`}>
        <div className="bg-white rounded-2xl border p-10 text-center text-gray-400 text-sm" style={{ borderColor: '#e5e7eb' }}>
          Memuat detail order...
        </div>
      </PageContainer>
    );
  }

  if (error || !order) {
    return (
      <PageContainer title="Order Tidak Ditemukan" subtitle={`Order #${orderId}`}>
        <div className="bg-white rounded-2xl border p-10 text-center" style={{ borderColor: '#e5e7eb', fontFamily: "'Inter', sans-serif" }}>
          <div className="text-gray-500 mb-4">
            {error === 'notfound'
              ? <>Order <span className="font-mono">#{orderId}</span> tidak ada di server.</>
              : 'Gagal memuat detail order dari server.'}
          </div>
          <Link
            to="/admin/transactions"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: '#1D3A27' }}
          >
            <BackIcon size={16} />
            Kembali ke Transaksi
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={`Order ${order.orderId}`}
      subtitle={formatDate(order.date)}
      actions={
        <button
          onClick={() => navigate('/admin/transactions')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border bg-white"
          style={{ borderColor: '#e5e7eb', color: '#475569' }}
        >
          <BackIcon size={15} />
          <span className="hidden sm:inline">Kembali</span>
        </button>
      }
    >
      {/* Order header info */}
      <div
        className="bg-white rounded-2xl border p-6 mb-6"
        style={{ borderColor: '#e5e7eb', fontFamily: "'Inter', sans-serif" }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span
                className="font-mono text-base font-bold"
                style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
              >
                {order.orderId}
              </span>
              <Badge status={order.status} />
            </div>
            <div className="text-xs text-gray-500">
              Detail order dari kedua sisi: customer & tenant
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-gray-500 uppercase font-bold tracking-wider">
              {order.hasRefund ? 'Total Setelah Refund' : 'Grand Total'}
            </div>
            <div
              className="text-3xl font-bold"
              style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
            >
              {formatCurrency(order.totalAmount)}
            </div>
            {order.hasRefund && (
              <div className="text-[11px] text-gray-500 mt-1">
                <span className="line-through">{formatCurrency(order.grossTotal)}</span>
                <span className="ml-2" style={{ color: '#b91c1c' }}>
                  −{formatCurrency(order.refundedTotal)} dibatalkan
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5 border-t" style={{ borderColor: '#f1f5f9' }}>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Customer</div>
            <div className="text-sm font-semibold text-gray-800 truncate">{order.customer?.name || '-'}</div>
            {order.customer?.email && (
              <div className="text-[11px] text-gray-500 truncate">{order.customer.email}</div>
            )}
          </div>
          <Info label="Meja" value={order.tableCode} sub={order.customer?.phone} />
          <Info label="Waktu Order" value={formatDate(order.date)} />
          <Info
            label="Pembayaran"
            value={order.paymentMethod}
            sub={`${order.tenantCount} tenant${order.tenantCount > 1 ? ' (multi)' : ''}`}
          />
        </div>
      </div>

      {/* Two-column receipts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* LEFT: Customer view */}
        <section
          className="bg-white rounded-2xl border overflow-hidden"
          style={{ borderColor: '#e5e7eb', fontFamily: "'Inter', sans-serif" }}
        >
          <div
            className="px-6 py-4 border-b flex items-center gap-3"
            style={{ borderColor: '#e5e7eb', background: '#f0fdf4' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
              style={{ background: '#16a34a' }}
            >
              <ReceiptIcon size={18} />
            </div>
            <div>
              <h2
                className="text-base font-bold"
                style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
              >
                Transaksi Customer
              </h2>
              <p className="text-xs text-gray-500">Receipt utuh yang dilihat customer</p>
            </div>
          </div>

          <div className="p-6">
            <div
              className="rounded-xl p-5"
              style={{ background: '#fafafa', border: '1px dashed #d1d5db' }}
            >
              <div className="text-center mb-4">
                <div
                  className="text-lg font-bold tracking-wide"
                  style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
                >
                  TERAS LA
                </div>
                <div
                  className="text-[10px] tracking-[0.2em] font-semibold"
                  style={{ color: '#C8961A' }}
                >
                  LENTENG AGUNG
                </div>
                <div className="text-[11px] text-gray-500 mt-1">{formatDate(order.date)}</div>
              </div>

              <div
                className="flex justify-between text-[11px] py-2 border-y border-dashed"
                style={{ borderColor: '#d1d5db', color: '#475569' }}
              >
                <span>Meja: <strong>{order.tableCode}</strong></span>
                <span>Order: <strong className="font-mono">{order.orderId}</strong></span>
              </div>

              <div className="py-3 flex flex-col gap-4">
                {order.items.map((item, i) => {
                  const refunded = isItemRefunded(item);
                  return (
                    <div key={i} style={refunded ? { opacity: 0.6 } : undefined}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#C8961A' }}>
                          {item.tenant}
                        </span>
                        {refunded && (
                          <span
                            className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                            style={{ background: '#fee2e2', color: '#b91c1c' }}
                          >
                            Dibatalkan
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        {item.products.map((p, j) => (
                          <div key={j} className="flex justify-between items-baseline text-sm">
                            <div className="flex-1 min-w-0">
                              <span className={refunded ? 'text-gray-500 line-through' : 'text-gray-800'}>{p.name}</span>
                              {p.qty > 1 && (
                                <span className="text-gray-400 ml-2 text-xs">×{p.qty}</span>
                              )}
                            </div>
                            <span className={`font-semibold whitespace-nowrap ${refunded ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                              {formatCurrency(p.price * p.qty)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between text-xs pt-1.5 mt-1.5 border-t border-dashed" style={{ borderColor: '#d1d5db' }}>
                        <span className="text-gray-500">Subtotal {item.tenant}</span>
                        {refunded ? (
                          <span className="font-bold" style={{ color: '#b91c1c' }}>
                            <span className="line-through text-gray-400 mr-1.5">{formatCurrency(item.amount)}</span>
                            Rp0
                          </span>
                        ) : (
                          <span className="font-bold" style={{ color: '#1D3A27' }}>
                            {formatCurrency(item.amount)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div
                className="border-t border-dashed pt-3 mt-1 flex flex-col gap-1"
                style={{ borderColor: '#d1d5db' }}
              >
                {order.hasRefund && (
                  <>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Subtotal</span>
                      <span>{formatCurrency(order.grossTotal)}</span>
                    </div>
                    <div className="flex justify-between text-xs" style={{ color: '#b91c1c' }}>
                      <span>Item dibatalkan</span>
                      <span>−{formatCurrency(order.refundedTotal)}</span>
                    </div>
                  </>
                )}
                <div
                  className="flex justify-between text-base font-bold pt-2"
                  style={{ color: '#1D3A27' }}
                >
                  <span>TOTAL</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className="mt-2 text-center text-[11px] text-gray-500">
                  Dibayar via <strong>{order.paymentMethod}</strong> · <Badge status={order.status} />
                </div>
              </div>
            </div>

            <div
              className="mt-4 rounded-xl px-3 py-2.5 text-[11px] leading-relaxed"
              style={{ background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe' }}
            >
              <strong>Catatan:</strong> Customer melihat seluruh produk yang dibeli, dikelompokkan per tenant, dengan total akhir di paling bawah.
            </div>
          </div>
        </section>

        {/* RIGHT: Per-tenant view */}
        <section
          className="bg-white rounded-2xl border overflow-hidden"
          style={{ borderColor: '#e5e7eb', fontFamily: "'Inter', sans-serif" }}
        >
          <div
            className="px-6 py-4 border-b flex items-center gap-3"
            style={{ borderColor: '#e5e7eb', background: '#fffbeb' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
              style={{ background: '#C8961A' }}
            >
              <MerchantIcon size={18} />
            </div>
            <div>
              <h2
                className="text-base font-bold"
                style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
              >
                Transaksi per Tenant
              </h2>
              <p className="text-xs text-gray-500">Tiap tenant hanya melihat kartu mereka sendiri</p>
            </div>
          </div>

          <div className="p-6 flex flex-col gap-4">
            {order.items.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border overflow-hidden"
                style={{ borderColor: '#e5e7eb' }}
              >
                <div
                  className="px-4 py-3 flex items-center justify-between gap-3"
                  style={{ background: '#fafafa' }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ background: '#1D3A27' }}
                    >
                      {item.tenant?.charAt(0) || '?'}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-gray-800 truncate">{item.tenant}</div>
                      <div className="text-[11px] text-gray-500">Tenant #{item.tenantId}</div>
                    </div>
                  </div>
                  <Badge status={item.status} />
                </div>

                <div className="p-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Produk Dipesan ({item.products.length})
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {item.products.map((p, j) => (
                      <div key={j} className="flex justify-between items-baseline">
                        <div className="flex items-baseline gap-2 min-w-0 flex-1">
                          <span className="text-sm text-gray-800 truncate">{p.name}</span>
                          <span className="text-xs text-gray-400 shrink-0">×{p.qty}</span>
                          <span className="text-[11px] text-gray-400 shrink-0">@ {formatCurrency(p.price)}</span>
                        </div>
                        <span className="text-sm font-semibold whitespace-nowrap text-gray-700">
                          {formatCurrency(p.price * p.qty)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div
                    className="flex justify-between text-sm font-bold pt-3 mt-3 border-t"
                    style={{ borderColor: '#f1f5f9' }}
                  >
                    <span className="text-gray-700">Total ke tenant</span>
                    <span style={{ color: isItemRefunded(item) ? '#b91c1c' : '#16a34a' }}>
                      {isItemRefunded(item) ? `−${formatCurrency(item.amount)}` : formatCurrency(item.amount)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Summary footer */}
            <div
              className="rounded-xl p-4 mt-2"
              style={{ background: '#1D3A27', color: 'white', fontFamily: "'Inter', sans-serif" }}
            >
              <div className="text-[11px] uppercase font-bold tracking-wider opacity-70 mb-3">
                Ringkasan Order
              </div>
              <div className="flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>Jumlah tenant</span>
                  <span className="font-semibold">{order.tenantCount}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>Total produk</span>
                  <span className="font-semibold">
                    {order.items.reduce((s, it) => s + it.products.reduce((a, p) => a + p.qty, 0), 0)} item
                  </span>
                </div>
                <div
                  className="flex justify-between font-bold pt-2 border-t"
                  style={{ borderColor: 'rgba(255,255,255,0.15)' }}
                >
                  <span>Total dibayar customer</span>
                  <span style={{ color: '#C8961A' }}>{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            <div
              className="rounded-xl px-3 py-2.5 text-[11px] leading-relaxed"
              style={{ background: '#fffbeb', color: '#9a3412', border: '1px solid #fed7aa' }}
            >
              <strong>Catatan:</strong> Tiap tenant hanya berhak melihat produk dan total miliknya sendiri, tidak tahu pesanan tenant lain dalam order yang sama.
            </div>
          </div>
        </section>
      </div>
    </PageContainer>
  );
};

const Info = ({ label, value, sub }) => (
  <div>
    <div className="text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">{label}</div>
    <div className="text-sm font-semibold text-gray-800 truncate">{value}</div>
    {sub && <div className="text-[11px] text-gray-500 truncate">{sub}</div>}
  </div>
);

export default TransactionDetail;
