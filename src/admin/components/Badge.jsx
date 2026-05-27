const STATUS_STYLES = {
  // Transaction
  completed: { bg: '#dcfce7', color: '#15803d', label: 'Completed' },
  processing: { bg: '#fef3c7', color: '#a16207', label: 'Processing' },
  failed: { bg: '#fee2e2', color: '#b91c1c', label: 'Failed' },
  refunded: { bg: '#e0e7ff', color: '#4338ca', label: 'Refunded' },
  disputed: { bg: '#fed7aa', color: '#9a3412', label: 'Disputed' },
  // Merchant
  active: { bg: '#dcfce7', color: '#15803d', label: 'Active' },
  pending: { bg: '#fef3c7', color: '#a16207', label: 'Pending' },
  suspended: { bg: '#fee2e2', color: '#b91c1c', label: 'Suspended' },
  // Withdrawal
  approved: { bg: '#dcfce7', color: '#15803d', label: 'Approved' },
  rejected: { bg: '#fee2e2', color: '#b91c1c', label: 'Rejected' },
  // Log severity
  info: { bg: '#dbeafe', color: '#1e40af', label: 'Info' },
  warning: { bg: '#fef3c7', color: '#a16207', label: 'Warning' },
  critical: { bg: '#fee2e2', color: '#b91c1c', label: 'Critical' },
};

const Badge = ({ status, label }) => {
  const conf = STATUS_STYLES[status] || { bg: '#f1f5f9', color: '#475569', label: status };
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold"
      style={{ background: conf.bg, color: conf.color, fontFamily: "'Inter', sans-serif" }}
    >
      {label || conf.label}
    </span>
  );
};

export default Badge;
