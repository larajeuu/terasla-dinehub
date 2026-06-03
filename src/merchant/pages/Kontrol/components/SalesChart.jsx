import { useState } from 'react';
import { formatRupiah } from '../../../../shared/utils/format';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
const MONTHLY_SAMPLE = [120000, 85000, 175000, 95000, 210000];

const currentMonthIndex = new Date().getMonth(); // 5 = Juni (0-based)

const monthlyData = MONTH_NAMES.map((name, i) => ({
  day: name,
  value: i < currentMonthIndex ? (MONTHLY_SAMPLE[i] ?? 0) : 0,
}));

const SalesChart = ({ data }) => {
  const [period, setPeriod] = useState('Mingguan');
  const [tooltip, setTooltip] = useState(null);

  const isBulanan = period === 'Bulanan';
  const chartData = isBulanan ? monthlyData : data;
  const maxValue = Math.max(...chartData.map((d) => d.value), 1);

  const chartHeight = 140;
  const chartWidth = 340;
  const barWidth = isBulanan ? 18 : 28;
  const gap = (chartWidth - barWidth * chartData.length) / (chartData.length + 1);

  const lastFilledIndex = chartData.reduce((last, item, i) => (item.value > 0 ? i : last), -1);

  const tooltipWidth = 64;

  return (
    <div
      className="bg-white rounded-2xl p-4"
      style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-bold text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Grafik Penjualan
        </p>
        <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid #e5e7eb' }}>
          {['Mingguan', 'Bulanan'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="px-3 py-1.5 text-xs font-medium transition-all"
              style={{
                background: period === p ? '#1D3A27' : 'white',
                color: period === p ? 'white' : '#6b7280',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative w-full">
        <svg
          width="100%"
          viewBox={`0 0 ${chartWidth} ${chartHeight + 24}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {chartData.map((item, index) => {
            const isEmpty = item.value === 0;
            const barHeight = isEmpty ? 0 : (item.value / maxValue) * chartHeight;
            const x = gap + index * (barWidth + gap);
            const y = chartHeight - barHeight;
            const isHighlighted = index === lastFilledIndex;

            const ttX = Math.min(chartWidth - tooltipWidth, Math.max(0, x + barWidth / 2 - tooltipWidth / 2));

            return (
              <g key={index}>
                {isEmpty ? (
                  /* Placeholder tipis untuk bulan kosong */
                  <rect
                    x={x}
                    y={chartHeight - 4}
                    width={barWidth}
                    height={4}
                    rx={2}
                    fill="#e5e7eb"
                  />
                ) : (
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx={6}
                    fill={isHighlighted ? '#1D3A27' : '#C8961A'}
                    opacity={isHighlighted ? 1 : 0.75}
                    onMouseEnter={() => setTooltip({ index, value: item.value, x, y })}
                    onMouseLeave={() => setTooltip(null)}
                    style={{ cursor: 'pointer' }}
                  />
                )}

                {/* Label bulan/hari */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 16}
                  textAnchor="middle"
                  fontSize={isBulanan ? 8 : 10}
                  fill={isEmpty ? '#d1d5db' : '#9ca3af'}
                  fontFamily="Inter"
                >
                  {item.day}
                </text>

                {/* Tooltip */}
                {tooltip?.index === index && !isEmpty && (
                  <g>
                    <rect
                      x={ttX}
                      y={y - 30}
                      width={tooltipWidth}
                      height={22}
                      rx={6}
                      fill="#1D3A27"
                    />
                    <text
                      x={ttX + tooltipWidth / 2}
                      y={y - 14}
                      textAnchor="middle"
                      fontSize={8}
                      fill="white"
                      fontFamily="Inter"
                      fontWeight="600"
                    >
                      {formatRupiah(item.value)}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default SalesChart;
