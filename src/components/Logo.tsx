import Link from "next/link";

export function Logo({
  size = "md",
  href = "/",
}: {
  size?: "md" | "lg";
  href?: string;
}) {
  const cls = size === "lg" ? "text-3xl" : "text-2xl";
  return (
    <Link href={href} className={`${cls} font-extrabold tracking-tight text-slate-900`}>
      Bizztob
    </Link>
  );
}
