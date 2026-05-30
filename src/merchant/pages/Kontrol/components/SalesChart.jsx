import { useState } from 'react';
import { formatRupiah } from '../../../../shared/utils/format';

const monthlyData = [
  { day: '1', value: 120000 },
  { day: '5', value: 85000 },
  { day: '10', value: 175000 },
  { day: '15', value: 95000 },
  { day: '20', value: 210000 },
  { day: '25', value: 320000 },
  { day: '30', value: 245000 },
];

const SalesChart = ({ data }) => {
  const [period, setPeriod] = useState('Mingguan');
  const [tooltip, setTooltip] = useState(null);

  const chartData = period === 'Mingguan' ? data : monthlyData;
  const maxValue = Math.max(...chartData.map((d) => d.value));
  const chartHeight = 140;
  const chartWidth = 300;
  const barWidth = 28;
  const gap = (chartWidth - barWidth * chartData.length) / (chartData.length + 1);

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
      <div className="relative w-full overflow-x-auto">
        <svg
          width="100%"
          viewBox={`0 0 ${chartWidth} ${chartHeight + 24}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {chartData.map((item, index) => {
            const barHeight = (item.value / maxValue) * chartHeight;
            const x = gap + index * (barWidth + gap);
            const y = chartHeight - barHeight;

            return (
              <g key={index}>
                {/* Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx={6}
                  fill={index === chartData.length - 1 ? '#1D3A27' : '#C8961A'}
                  opacity={index === chartData.length - 1 ? 1 : 0.75}
                  onMouseEnter={() => setTooltip({ index, value: item.value, x, y })}
                  onMouseLeave={() => setTooltip(null)}
                  style={{ cursor: 'pointer' }}
                />

                {/* Label hari */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 16}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#9ca3af"
                  fontFamily="Inter"
                >
                  {item.day}
                </text>

                {/* Tooltip */}
                {tooltip?.index === index && (
                  <g>
                    <rect
                      x={x - 10}
                      y={y - 30}
                      width={barWidth + 20}
                      height={22}
                      rx={6}
                      fill="#1D3A27"
                    />
                    <text
                      x={x + barWidth / 2}
                      y={y - 14}
                      textAnchor="middle"
                      fontSize={9}
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