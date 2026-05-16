export const PlusIcon = ({ size = 14, color = 'currentColor', strokeWidth = 2.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14M5 12h14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);

export const MinusIcon = ({ size = 14, color = 'currentColor', strokeWidth = 2.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M5 12h14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);

export const CartIcon = ({ size = 22, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M3 3h2l2.4 12.4a2 2 0 002 1.6h9.2a2 2 0 002-1.6L22 6H6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="9" cy="20" r="1.5" fill={color} />
    <circle cx="18" cy="20" r="1.5" fill={color} />
  </svg>
);

export const StarIcon = ({ size = 14, color = '#f59e0b' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export const ClockIcon = ({ size = 13, color = '#9ca3af', strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} />
    <path d="M12 7v5l3 2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const SearchIcon = ({ size = 16, color = '#9ca3af' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" />
    <path d="M21 21l-4.35-4.35" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const BackIcon = ({ size = 22, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M15 18l-6-6 6-6" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CloseIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

export const TableIcon = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M3 10h18M5 10v10M19 10v10M9 10V6h6v4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const TrashIcon = ({ size = 16, color = 'currentColor', strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M4 7h16M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 11v6M14 11v6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);

export const ChevronRightIcon = ({ size = 18, color = 'currentColor', strokeWidth = 2.2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M9 6l6 6-6 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const MailIcon = ({ size = 18, color = 'currentColor', strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="5" width="18" height="14" rx="2.5" stroke={color} strokeWidth={strokeWidth} />
    <path d="M3.5 7l8 6 8.5-6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PhoneIcon = ({ size = 18, color = 'currentColor', strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M5 4.5C5 3.7 5.7 3 6.5 3h2.2c.7 0 1.3.5 1.5 1.2l.8 3c.2.6 0 1.3-.5 1.7l-1.3 1c1 2 2.6 3.6 4.6 4.6l1-1.3c.4-.5 1.1-.7 1.7-.5l3 .8c.7.2 1.2.8 1.2 1.5v2.2c0 .8-.7 1.5-1.5 1.5C10.7 18.7 5.3 13.3 5 5.5z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
  </svg>
);

export const CheckIcon = ({ size = 14, color = 'currentColor', strokeWidth = 3 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M5 12.5l4.5 4.5L19 7.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const WalletIcon = ({ size = 18, color = 'currentColor', strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="6" width="18" height="14" rx="2.5" stroke={color} strokeWidth={strokeWidth} />
    <path d="M3 10h18M16 14.5h2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);
