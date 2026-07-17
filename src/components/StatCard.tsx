import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon,
  hint,
  tone = "brand",
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  hint?: string;
  tone?: "brand" | "green" | "amber" | "slate";
}) {
  const toneMap = {
    brand: "bg-brand-50 text-brand-700",
    green: "bg-green-50 text-green-700",
    amber: "bg-amber-50 text-amber-700",
    slate: "bg-slate-100 text-slate-700",
  } as const;

  return (
    <div className="card p-5 flex items-start gap-4">
      {icon && (
        <div
          className={cn(
            "h-10 w-10 rounded-lg grid place-items-center",
            toneMap[tone]
          )}
        >
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-semibold text-slate-900 mt-0.5 truncate">
          {value}
        </p>
        {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
      </div>
    </div>
  );
}
