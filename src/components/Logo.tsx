import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="h-8 w-8 rounded-lg bg-brand-600 grid place-items-center text-white font-bold shadow-sm group-hover:bg-brand-700 transition">
        B
      </div>
      {!compact && (
        <span className="text-lg font-semibold tracking-tight text-slate-900">
          Bizztob
        </span>
      )}
    </Link>
  );
}
