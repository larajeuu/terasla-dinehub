const stroke = (props = {}) => ({
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  ...props,
});

export const DashboardIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke()}>
    <rect x="3" y="3" width="7" height="9" rx="1.5" />
    <rect x="14" y="3" width="7" height="5" rx="1.5" />
    <rect x="14" y="12" width="7" height="9" rx="1.5" />
    <rect x="3" y="16" width="7" height="5" rx="1.5" />
  </svg>
);

export const TransactionIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke()}>
    <path d="M3 7h13l-3-3M21 17H8l3 3" />
  </svg>
);

export const MerchantIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke()}>
    <path d="M4 7l1-3h14l1 3M4 7v13h16V7M4 7h16M9 13h6" />
  </svg>
);

export const WithdrawIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke()}>
    <rect x="3" y="6" width="18" height="14" rx="2" />
    <path d="M3 10h18M12 14v3M10 15l2 2 2-2" />
  </svg>
);

export const UsersIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke()}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M21.5 18c0-2.5-2-4-4.5-4" />
  </svg>
);

export const ReportIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke()}>
    <path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z" />
    <path d="M14 3v6h6M8 13h8M8 17h5" />
  </svg>
);

export const SystemIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke()}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.6 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.6-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" />
  </svg>
);

export const LogIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke()}>
    <path d="M4 5h16M4 12h16M4 19h10" />
  </svg>
);

export const LogoutIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke()}>
    <path d="M16 17l5-5-5-5M21 12H9M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
  </svg>
);

export const SearchIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke({ strokeWidth: 2 })}>
    <circle cx="11" cy="11" r="7.5" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
);

export const FilterIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke()}>
    <path d="M3 5h18M6 12h12M10 19h4" />
  </svg>
);

export const DownloadIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke()}>
    <path d="M12 4v12M7 11l5 5 5-5M4 20h16" />
  </svg>
);

export const ArrowUpIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke({ strokeWidth: 2.4 })}>
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);

export const ArrowDownIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke({ strokeWidth: 2.4 })}>
    <path d="M12 5v14M5 12l7 7 7-7" />
  </svg>
);

export const CheckIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke({ strokeWidth: 2.5 })}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export const XIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke({ strokeWidth: 2.2 })}>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export const EyeIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke()}>
    <path d="M1.5 12C3.5 7 7.5 4 12 4s8.5 3 10.5 8c-2 5-6 8-10.5 8S3.5 17 1.5 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const FlagIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke()}>
    <path d="M4 21V4M4 4h12l-2 4 2 4H4" />
  </svg>
);

export const BellIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke()}>
    <path d="M6 8a6 6 0 0112 0c0 7 3 7 3 9H3c0-2 3-2 3-9zM10 21a2 2 0 004 0" />
  </svg>
);

export const MenuIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke({ strokeWidth: 2.2 })}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

export const RevenueIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke()}>
    <path d="M12 1v22M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6" />
  </svg>
);

export const ChartIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke()}>
    <path d="M3 3v18h18M7 16l4-5 4 3 5-7" />
  </svg>
);

export const PlusIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke({ strokeWidth: 2.4 })}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const EditIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke()}>
    <path d="M4 20h4l11-11-4-4L4 16v4zM14 6l4 4" />
  </svg>
);

export const TrashIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke()}>
    <path d="M4 7h16M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M10 11v6M14 11v6" />
  </svg>
);

export const ChevronDownIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke({ strokeWidth: 2.2 })}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const ChevronUpIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke({ strokeWidth: 2.2 })}>
    <path d="M6 15l6-6 6 6" />
  </svg>
);

export const ReceiptIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke()}>
    <path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2V3zM8 8h8M8 12h8M8 16h5" />
  </svg>
);

export const BackIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke({ strokeWidth: 2.2 })}>
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

export const MailIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke()}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="M3.5 7l8 6 8.5-6" />
  </svg>
);

export const PhoneIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke()}>
    <path d="M5 4.5C5 3.7 5.7 3 6.5 3h2.2c.7 0 1.3.5 1.5 1.2l.8 3c.2.6 0 1.3-.5 1.7l-1.3 1c1 2 2.6 3.6 4.6 4.6l1-1.3c.4-.5 1.1-.7 1.7-.5l3 .8c.7.2 1.2.8 1.2 1.5v2.2c0 .8-.7 1.5-1.5 1.5C10.7 18.7 5.3 13.3 5 5.5z" />
  </svg>
);
