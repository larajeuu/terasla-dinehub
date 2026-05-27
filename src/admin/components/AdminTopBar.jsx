import { BellIcon, MenuIcon, SearchIcon } from './icons';

const AdminTopBar = ({ title, subtitle, onMenuClick, actions }) => {
  return (
    <header
      className="sticky top-0 z-20 bg-white border-b px-6 py-4"
      style={{ borderColor: '#e5e7eb', fontFamily: "'Inter', sans-serif" }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100"
          >
            <MenuIcon size={20} />
          </button>
          <div className="min-w-0">
            <h1
              className="text-xl font-bold truncate"
              style={{ color: '#1D3A27', fontFamily: "'Poppins', sans-serif" }}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {actions}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border" style={{ borderColor: '#e5e7eb' }}>
            <SearchIcon size={15} />
            <input
              placeholder="Search..."
              className="bg-transparent outline-none text-sm w-40"
            />
          </div>
          <button
            className="relative p-2.5 rounded-xl border hover:bg-gray-50"
            style={{ borderColor: '#e5e7eb' }}
          >
            <BellIcon size={18} />
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ background: '#ef4444' }}
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminTopBar;
