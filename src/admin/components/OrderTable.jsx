import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from './Badge';
import { SearchIcon, EyeIcon } from './icons';
import { formatCurrency, formatDate } from '../utils/format';

const OrderTable = ({ orders, pageSize = 10 }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let rows = orders || [];
    if (statusFilter !== 'all') rows = rows.filter((o) => o.status === statusFilter);
    if (methodFilter !== 'all') rows = rows.filter((o) => o.paymentMethod === methodFilter);
    if (query) {
      const q = query.toLowerCase();
      rows = rows.filter((o) =>
        [o.orderId, o.customerId, o.tableCode, o.paymentMethod].some((v) =>
          String(v ?? '').toLowerCase().includes(q)
        )
      );
    }
    return rows;
  }, [orders, query, statusFilter, methodFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const goDetail = (id) => navigate(`/admin/transactions/${id}`);

  return (
    <div
      className="bg-white rounded-2xl border overflow-hidden"
      style={{ borderColor: '#e5e7eb', fontFamily: "'Inter', sans-serif" }}
    >
      {/* Toolbar */}
      <div className="p-4 border-b flex flex-wrap gap-3 items-center" style={{ borderColor: '#e5e7eb' }}>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border flex-1 min-w-50 max-w-sm" style={{ borderColor: '#e5e7eb' }}>
          <SearchIcon size={15} />
          <input
            placeholder="Cari order / customer / meja..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-xl bg-gray-50 border text-sm outline-none"
          style={{ borderColor: '#e5e7eb' }}
        >
          <option value="all">Status (semua)</option>
          <option value="verifying">Verifying</option>
          <option value="open">Open</option>
          <option value="process">Process</option>
          <option value="waiting_confirmation">Waiting Confirm</option>
          <option value="done">Done</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          value={methodFilter}
          onChange={(e) => { setMethodFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-xl bg-gray-50 border text-sm outline-none"
          style={{ borderColor: '#e5e7eb' }}
        >
          <option value="all">Metode (semua)</option>
          <option value="QRIS">QRIS</option>
          <option value="GoPay">GoPay</option>
          <option value="OVO">OVO</option>
          <option value="Dana">Dana</option>
          <option value="Cash">Cash</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Order ID</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Tanggal</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Customer ID</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Meja</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Tenant</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Total</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Metode</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-12 text-gray-400 text-sm">
                  Tidak ada order
                </td>
              </tr>
            ) : (
              paged.map((o) => {
                const isMulti = o.tenantCount > 1;
                return (
                  <tr
                    key={o.id ?? o.orderId}
                    onClick={() => goDetail(o.id ?? o.orderId)}
                    className="border-t hover:bg-gray-50/60 transition-colors cursor-pointer"
                    style={{ borderColor: '#f1f5f9' }}
                  >
                    <td className="px-4 py-3 align-middle">
                      <span className="font-mono text-xs font-semibold text-gray-800">{o.orderId}</span>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <span className="text-xs text-gray-600 whitespace-nowrap">{formatDate(o.date)}</span>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <span className="font-mono text-xs font-semibold text-gray-700">{o.customerId}</span>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <span className="px-2 py-1 rounded-md text-[11px] font-mono font-semibold bg-gray-100 text-gray-700">
                        {o.tableCode}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold"
                        style={{
                          background: isMulti ? '#fef3c7' : '#f1f5f9',
                          color: isMulti ? '#a16207' : '#475569',
                        }}
                      >
                        {o.tenantCount} tenant{isMulti ? ' (multi)' : ''}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <span className="font-bold text-sm whitespace-nowrap" style={{ color: '#1D3A27' }}>
                        {formatCurrency(o.totalAmount)}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <span className="px-2 py-1 rounded-md text-[11px] font-medium bg-gray-100 text-gray-700">
                        {o.paymentMethod}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <Badge status={o.status} />
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <button
                        onClick={(e) => { e.stopPropagation(); goDetail(o.id ?? o.orderId); }}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-white"
                        style={{ background: '#1D3A27' }}
                      >
                        <EyeIcon size={12} />
                        Detail
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > pageSize && (
        <div className="px-4 py-3 border-t flex items-center justify-between text-sm" style={{ borderColor: '#e5e7eb' }}>
          <div className="text-gray-500 text-xs">
            Menampilkan {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)} dari {filtered.length} order
          </div>
          <div className="flex gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border text-xs font-medium disabled:opacity-40 hover:bg-gray-50"
              style={{ borderColor: '#e5e7eb' }}
            >
              Prev
            </button>
            <div className="px-3 py-1.5 text-xs font-medium" style={{ color: '#1D3A27' }}>
              {currentPage} / {totalPages}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg border text-xs font-medium disabled:opacity-40 hover:bg-gray-50"
              style={{ borderColor: '#e5e7eb' }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTable;
