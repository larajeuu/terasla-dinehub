import { formatCompactCurrency } from '../../../utils/format';

const RevenueChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const W = 720;
  const H = 220;
  const PAD = { t: 20, r: 20, b: 30, l: 60 };
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;

  const max = Math.max(...data.map((d) => d.revenue));
  const min = Math.min(...data.map((d) => d.revenue));
  const range = max - min || 1;

  const stepX = innerW / (data.length - 1);

  const points = data.map((d, i) => ({
    x: PAD.l + i * stepX,
    y: PAD.t + innerH - ((d.revenue - min) / range) * innerH,
    ...d,
  }));

  const pathD = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(' ');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${PAD.t + innerH} L ${points[0].x} ${PAD.t + innerH} Z`;

  // Y-axis grid lines (4 lines)
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
    y: PAD.t + innerH - t * innerH,
    value: min + range * t,
  }));

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto min-w-[600px]"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <defs>
          <linearGradient id="revAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C8961A" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#C8961A" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yTicks.map((t, i) => (
          <g key={i}>
            <line
              x1={PAD.l}
              x2={W - PAD.r}
              y1={t.y}
              y2={t.y}
              stroke="#f1f5f9"
              strokeWidth="1"
            />
            <text
              x={PAD.l - 8}
              y={t.y + 4}
              fontSize="10"
              fill="#94a3b8"
              textAnchor="end"
            >
              {formatCompactCurrency(t.value)}
            </text>
          </g>
        ))}

        {/* Area */}
        <path d={areaD} fill="url(#revAreaGrad)" />
        {/* Line */}
        <path d={pathD} fill="none" stroke="#C8961A" strokeWidth="2.5" strokeLinejoin="round" />

        {/* Dots + labels */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="white" stroke="#C8961A" strokeWidth="2" />
            <text
              x={p.x}
              y={H - 10}
              fontSize="10"
              fill="#64748b"
              textAnchor="middle"
            >
              {p.date}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default RevenueChart;
