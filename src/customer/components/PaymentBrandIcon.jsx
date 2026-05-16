const QrisIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="9" fill="#1D3A27" />
    <rect x="8" y="8" width="9" height="9" rx="1.5" stroke="white" strokeWidth="1.6" />
    <rect x="23" y="8" width="9" height="9" rx="1.5" stroke="white" strokeWidth="1.6" />
    <rect x="8" y="23" width="9" height="9" rx="1.5" stroke="white" strokeWidth="1.6" />
    <rect x="11" y="11" width="3" height="3" fill="white" />
    <rect x="26" y="11" width="3" height="3" fill="white" />
    <rect x="11" y="26" width="3" height="3" fill="white" />
    <rect x="22" y="22" width="3" height="3" fill="#C8961A" />
    <rect x="28" y="22" width="2" height="2" fill="white" />
    <rect x="22" y="28" width="2" height="2" fill="white" />
    <rect x="27" y="27" width="3" height="3" fill="white" />
  </svg>
);

const BcaIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="9" fill="#0060AF" />
    <text
      x="20"
      y="25"
      textAnchor="middle"
      fill="white"
      fontFamily="'Poppins', sans-serif"
      fontWeight="800"
      fontSize="13"
      letterSpacing="0.5"
    >
      BCA
    </text>
  </svg>
);

const BniIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="9" fill="#F26522" />
    <text
      x="20"
      y="25"
      textAnchor="middle"
      fill="white"
      fontFamily="'Poppins', sans-serif"
      fontWeight="800"
      fontSize="13"
      letterSpacing="0.5"
    >
      BNI
    </text>
  </svg>
);

const MandiriIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="9" fill="#003D79" />
    <path d="M8 18 L20 13 L32 18" stroke="#FFCD00" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <text
      x="20"
      y="30"
      textAnchor="middle"
      fill="white"
      fontFamily="'Poppins', sans-serif"
      fontWeight="800"
      fontSize="7.5"
      letterSpacing="0.5"
    >
      MANDIRI
    </text>
  </svg>
);

const CashIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="9" fill="#16a34a" />
    <rect x="8" y="13" width="24" height="14" rx="2.5" fill="white" />
    <circle cx="20" cy="20" r="3.5" stroke="#16a34a" strokeWidth="1.6" />
    <circle cx="13" cy="20" r="1" fill="#16a34a" />
    <circle cx="27" cy="20" r="1" fill="#16a34a" />
  </svg>
);

const ICONS = {
  qris: QrisIcon,
  bca: BcaIcon,
  bni: BniIcon,
  mandiri: MandiriIcon,
  cash: CashIcon,
};

const PaymentBrandIcon = ({ brand, size = 32 }) => {
  const Icon = ICONS[brand];
  if (!Icon) return null;
  return <Icon size={size} />;
};

export default PaymentBrandIcon;
