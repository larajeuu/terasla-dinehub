import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import {
  DashboardIcon,
  TransactionIcon,
  MerchantIcon,
  WithdrawIcon,
  UsersIcon,
  ReportIcon,
  SystemIcon,
  LogIcon,
  LogoutIcon,
} from './icons';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { to: '/admin/transactions', label: 'Transaksi', icon: TransactionIcon },
  { to: '/admin/merchants', label: 'Merchant', icon: MerchantIcon },
  { to: '/admin/withdrawals', label: 'Withdrawal', icon: WithdrawIcon },
  { to: '/admin/customers', label: 'Customer', icon: UsersIcon },
  { to: '/admin/reports', label: 'Laporan', icon: ReportIcon },
  { to: '/admin/system', label: 'Sistem', icon: SystemIcon },
  { to: '/admin/logs', label: 'Activity Logs', icon: LogIcon },
];

const AdminSidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 z-40 transform transition-transform lg:transform-none ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{
          background: 'linear-gradient(180deg, #1D3A27 0%, #16291c 100%)',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-6 py-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-2.5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: '#C8961A' }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9.5L12 3L21 9.5V21H15V15H9V21H3V9.5Z" fill="white" />
                </svg>
              </div>
              <div>
                <div className="text-white font-bold text-base leading-none tracking-wide">
                  TerasLA
                </div>
                <div
                  className="text-[10px] tracking-[0.2em] mt-1 font-semibold"
                  style={{ color: '#C8961A' }}
                >
                  ADMIN PANEL
                </div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`
                }
                style={({ isActive }) => ({
                  background: isActive ? 'rgba(200, 150, 26, 0.15)' : 'transparent',
                  borderLeft: isActive ? '3px solid #C8961A' : '3px solid transparent',
                })}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User */}
          <div className="px-3 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                style={{ background: '#C8961A' }}
              >
                {(user?.name || 'A').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-white text-sm font-semibold truncate">
                  {user?.name || 'Admin'}
                </div>
                <div className="text-white/50 text-[11px] truncate">
                  {user?.email || 'admin@terasla.id'}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            >
              <LogoutIcon size={16} />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
