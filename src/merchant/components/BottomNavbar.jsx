import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  {
    label: 'Order',
    path: '/merchant/dashboard',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke={active ? '#1D3A27' : '#9ca3af'} strokeWidth="1.8" strokeLinecap="round"/>
        <rect x="9" y="3" width="6" height="4" rx="1" stroke={active ? '#1D3A27' : '#9ca3af'} strokeWidth="1.8"/>
        <line x1="9" y1="12" x2="15" y2="12" stroke={active ? '#1D3A27' : '#9ca3af'} strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="9" y1="16" x2="13" y2="16" stroke={active ? '#1D3A27' : '#9ca3af'} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Menu',
    path: '/merchant/menu',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M4 6h16M4 12h16M4 18h16" stroke={active ? '#1D3A27' : '#9ca3af'} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Kontrol',
    path: '/merchant/kontrol',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke={active ? '#1D3A27' : '#9ca3af'} strokeWidth="1.8"/>
        <rect x="14" y="3" width="7" height="7" rx="1" stroke={active ? '#1D3A27' : '#9ca3af'} strokeWidth="1.8"/>
        <rect x="3" y="14" width="7" height="7" rx="1" stroke={active ? '#1D3A27' : '#9ca3af'} strokeWidth="1.8"/>
        <rect x="14" y="14" width="7" height="7" rx="1" stroke={active ? '#1D3A27' : '#9ca3af'} strokeWidth="1.8"/>
      </svg>
    ),
  },
  {
    label: 'Inbox',
    path: '/merchant/inbox',
    hasNotif: true,
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke={active ? '#1D3A27' : '#9ca3af'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Settings',
    path: '/merchant/settings',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke={active ? '#1D3A27' : '#9ca3af'} strokeWidth="1.8"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke={active ? '#1D3A27' : '#9ca3af'} strokeWidth="1.8"/>
      </svg>
    ),
  },
];

const BottomNavbar = ({ notifCount = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-white flex items-center justify-around px-2 py-2"
      style={{ boxShadow: '0 -1px 12px rgba(0,0,0,0.08)', borderTop: '1px solid #f3f4f6' }}
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;

        return (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all active:scale-90 relative"
          >
            <div className="relative">
              {item.icon(isActive)}
              {item.hasNotif && notifCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white flex items-center justify-center"
                  style={{ background: '#ef4444', fontSize: '9px', fontFamily: "'Inter', sans-serif" }}
                >
                  {notifCount}
                </span>
              )}
            </div>
            <p
              className="text-xs font-medium"
              style={{
                color: isActive ? '#1D3A27' : '#9ca3af',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {item.label}
            </p>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNavbar;