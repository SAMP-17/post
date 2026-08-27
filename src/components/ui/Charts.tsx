interface BarChartProps {
  data: { label: string; value: number }[];
  max?: number;
  color?: string;
  height?: string;
  unit?: string;
}

export function BarChart({ data, max = 100, color = 'bg-primary-500', height = 'h-32', unit = '%' }: BarChartProps) {
  return (
    <div className="flex items-end justify-between gap-3">
      {data.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-2">
          <div className={`flex w-full ${height} items-end justify-center`}>
            <div
              className={`w-full max-w-[40px] rounded-t-lg ${color} transition-all duration-500 hover:opacity-80`}
              style={{ height: `${(d.value / max) * 100}%` }}
              title={`${d.label}: ${d.value}${unit}`}
            />
          </div>
          <span className="text-xs font-medium text-slate-500">{d.label}</span>
          <span className="text-xs font-bold text-slate-700">{d.value}{unit}</span>
        </div>
      ))}
    </div>
  );
}

interface LineChartProps {
  data: { label: string; value: number }[];
  max?: number;
  height?: string;
  unit?: string;
}

export function LineChart({ data, max = 100, height = 'h-40', unit = '%' }: LineChartProps) {
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: 100 - (d.value / max) * 100,
  }));
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L 100 100 L 0 100 Z`;

  return (
    <div className={`relative w-full ${height}`}>
      <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2473eb" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#2473eb" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#lineGrad)" />
        <path d={pathD} fill="none" stroke="#2473eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#fff" stroke="#2473eb" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <div className="mt-2 flex justify-between">
        {data.map((d, i) => (
          <div key={i} className="text-center">
            <span className="text-xs font-medium text-slate-500">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface DonutChartProps {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  centerLabel?: string;
  centerValue?: string | number;
}

export function DonutChart({ segments, size = 180, centerLabel, centerValue }: DonutChartProps) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          {segments.map((seg, i) => {
            const dash = (seg.value / total) * circumference;
            const circle = (
              <circle
                key={i}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth="10"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
              />
            );
            offset += dash;
            return circle;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {centerValue !== undefined && <span className="text-2xl font-bold text-slate-900">{centerValue}</span>}
          {centerLabel && <span className="text-xs font-medium text-slate-500">{centerLabel}</span>}
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${seg.color}`} />
            <span className="text-xs font-medium text-slate-600">
              {seg.label} <span className="font-bold text-slate-800">({seg.value})</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ProgressRingProps {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  label?: string;
}

export function ProgressRing({ value, size = 120, stroke = 10, color = '#2473eb', label }: ProgressRingProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (value / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-slate-900">{value}%</span>
        {label && <span className="text-[10px] font-medium text-slate-500">{label}</span>}
      </div>
    </div>
  );
}
