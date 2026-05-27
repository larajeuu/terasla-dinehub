import { ArrowUpIcon, ArrowDownIcon } from './icons';

const StatCard = ({ label, value, icon: Icon, iconBg = '#1D3A27', change, changeLabel, accent = '#1D3A27' }) => {
  const isUp = change !== undefined && change >= 0;

  return (
    <div
      className="bg-white rounded-2xl p-5 border"
      style={{ borderColor: '#e5e7eb', fontFamily: "'Inter', sans-serif" }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
          style={{ background: iconBg }}
        >
          {Icon && <Icon size={20} />}
        </div>
        {change !== undefined && (
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold"
            style={{
              background: isUp ? '#dcfce7' : '#fee2e2',
              color: isUp ? '#15803d' : '#b91c1c',
            }}
          >
            {isUp ? <ArrowUpIcon size={12} /> : <ArrowDownIcon size={12} />}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>
      <div className="text-xs text-gray-500 font-medium mb-1">{label}</div>
      <div className="text-2xl font-bold" style={{ color: accent, fontFamily: "'Poppins', sans-serif" }}>
        {value}
      </div>
      {changeLabel && (
        <div className="text-[11px] text-gray-400 mt-1">{changeLabel}</div>
      )}
    </div>
  );
};

export default StatCard;
