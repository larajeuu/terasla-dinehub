const TenantIllustration = ({ color = '#1D3A27' }) => {
  return (
    <div
      className="relative w-full h-full rounded-xl flex items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${color}12 0%, ${color}28 100%)`,
      }}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        {/* Awning shadow */}
        <ellipse cx="50" cy="85" rx="38" ry="4" fill={color} opacity="0.1" />

        {/* Roof base */}
        <path d="M14 38 L50 18 L86 38 L80 42 L50 24 L20 42 Z" fill={color} />

        {/* Awning stripes */}
        <path d="M20 42 L80 42 L78 48 L22 48 Z" fill={color} opacity="0.85" />
        <rect x="26" y="42" width="6" height="6" fill="#fef3c7" opacity="0.7" />
        <rect x="40" y="42" width="6" height="6" fill="#fef3c7" opacity="0.7" />
        <rect x="54" y="42" width="6" height="6" fill="#fef3c7" opacity="0.7" />
        <rect x="68" y="42" width="6" height="6" fill="#fef3c7" opacity="0.7" />

        {/* Building body */}
        <rect x="22" y="48" width="56" height="36" fill="#fff" stroke={color} strokeWidth="1.5" />

        {/* Sign circle */}
        <circle cx="50" cy="34" r="9" fill="#C8961A" stroke="#fff" strokeWidth="1.5" />
        {/* Fork */}
        <path
          d="M46.5 30 L46.5 36 M45 30 L48 30"
          stroke="#fff"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        {/* Knife */}
        <path
          d="M53.5 30 L53.5 36 M52.5 30 Q53.5 32 54.5 30"
          stroke="#fff"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Counter window */}
        <rect x="30" y="56" width="40" height="18" fill={color} opacity="0.08" stroke={color} strokeWidth="1" />

        {/* Two figures (customers) */}
        <circle cx="40" cy="64" r="3" fill={color} opacity="0.6" />
        <path d="M36 73 Q36 68 40 68 Q44 68 44 73 Z" fill={color} opacity="0.6" />
        <circle cx="60" cy="64" r="3" fill={color} opacity="0.6" />
        <path d="M56 73 Q56 68 60 68 Q64 68 64 73 Z" fill={color} opacity="0.6" />

        {/* Table */}
        <rect x="44" y="69" width="12" height="2" fill={color} opacity="0.4" />

        {/* Floor base */}
        <rect x="22" y="82" width="56" height="2" fill={color} opacity="0.3" />
      </svg>
    </div>
  );
};

export default TenantIllustration;
