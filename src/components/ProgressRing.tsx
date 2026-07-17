export function ProgressRing({
  value,
  total,
  color = "green",
  label,
}: {
  value: number;
  total: number;
  color?: "green" | "yellow" | "red";
  label: string;
}) {
  const pct = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;
  const size = 120;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (pct / 100) * c;

  const trackColor = "#F3F4F6";
  const bar =
    color === "green" ? "#22c55e" : color === "yellow" ? "#eab308" : "#ef4444";
  const rest = "#ef4444";

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={rest}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={bar}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={off}
          strokeLinecap="round"
        />
      </svg>
      <div className="-mt-[76px] flex flex-col items-center relative">
        <span className="text-brand-600 font-extrabold text-2xl">
          {pct}
          <span className="text-sm font-bold">%</span>
        </span>
        <span className="text-[10px] text-slate-500">
          {value}/{total}
        </span>
        <a className="text-[10px] text-brand-600 mt-0.5 cursor-pointer">
          View
        </a>
      </div>
      <p className="mt-3 font-bold text-slate-900">{label}</p>
    </div>
  );
}
