import { useState, useMemo } from 'react';
import { SearchIcon } from './icons';

const DataTable = ({
  columns,
  data,
  searchKeys = [],
  filters = [],
  rowKey = 'id',
  emptyText = 'Tidak ada data',
  pageSize = 10,
  onRowClick,
}) => {
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let rows = data || [];

    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        rows = rows.filter((r) => r[key] === value);
      }
    });

    if (query && searchKeys.length) {
      const q = query.toLowerCase();
      rows = rows.filter((r) =>
        searchKeys.some((k) => String(r[k] ?? '').toLowerCase().includes(q))
      );
    }

    return rows;
  }, [data, query, activeFilters, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div
      className="bg-white rounded-2xl border overflow-hidden"
      style={{ borderColor: '#e5e7eb', fontFamily: "'Inter', sans-serif" }}
    >
      {/* Toolbar */}
      {(searchKeys.length > 0 || filters.length > 0) && (
        <div className="p-4 border-b flex flex-wrap gap-3 items-center" style={{ borderColor: '#e5e7eb' }}>
          {searchKeys.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border flex-1 min-w-[200px] max-w-sm" style={{ borderColor: '#e5e7eb' }}>
              <SearchIcon size={15} />
              <input
                placeholder="Cari..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
          )}
          {filters.map((f) => (
            <select
              key={f.key}
              value={activeFilters[f.key] || 'all'}
              onChange={(e) => {
                setActiveFilters((p) => ({ ...p, [f.key]: e.target.value }));
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl bg-gray-50 border text-sm outline-none"
              style={{ borderColor: '#e5e7eb' }}
            >
              <option value="all">{f.label} (semua)</option>
              {f.options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap"
                  style={{ width: c.width }}
                >
                  {c.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-gray-400 text-sm">
                  {emptyText}
                </td>
              </tr>
            ) : (
              paged.map((row, i) => (
                <tr
                  key={row[rowKey] ?? i}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={`border-t hover:bg-gray-50/60 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                  style={{ borderColor: '#f1f5f9' }}
                >
                  {columns.map((c) => (
                    <td key={c.key} className="px-4 py-3 text-gray-700 align-middle">
                      {c.render ? c.render(row) : row[c.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filtered.length > pageSize && (
        <div className="px-4 py-3 border-t flex items-center justify-between text-sm" style={{ borderColor: '#e5e7eb' }}>
          <div className="text-gray-500 text-xs">
            Menampilkan {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)} dari {filtered.length}
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

export default DataTable;
