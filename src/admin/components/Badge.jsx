const STATUS_STYLES = {
  // Customer order lifecycle (VERIFYING → OPEN → PROCESS → WAITING CONFIRMATION → DONE)
  verifying: { bg: '#fef9c3', color: '#a16207', label: 'Verifying' },
  open: { bg: '#dbeafe', color: '#1e40af', label: 'Open' },
  process: { bg: '#fef3c7', color: '#a16207', label: 'Process' },
  waiting_confirmation: { bg: '#e0e7ff', color: '#4338ca', label: 'Waiting Confirm' },
  done: { bg: '#dcfce7', color: '#15803d', label: 'Done' },
  cancelled: { bg: '#fee2e2', color: '#b91c1c', label: 'Cancelled' },
  // Tenant order lifecycle (BARU → TERBUKA → DIPROSES → SELESAI / DIBATALKAN)
  new: { bg: '#f1f5f9', color: '#475569', label: 'Baru' },
  refunded: { bg: '#ede9fe', color: '#6d28d9', label: 'Refunded' },
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
