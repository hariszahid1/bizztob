import Link from "next/link";
import { getFullUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export default async function RetailerOverview() {
  const user = await getFullUser();
  const retailer = user?.retailer;
  if (!retailer) return null;

  const [accepted, rejected, inReview, ledger] = await Promise.all([
    prisma.order.count({
      where: {
        retailerId: retailer.id,
        status: { in: ["CONFIRMED", "DISPATCHED", "DELIVERED"] },
      },
    }),
    prisma.order.count({
      where: { retailerId: retailer.id, status: "CANCELLED" },
    }),
    prisma.order.count({
      where: { retailerId: retailer.id, status: "PENDING" },
    }),
    prisma.ledgerEntry.findFirst({
      where: { retailerId: retailer.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl">
        <Metric label="Accepted" value={accepted} tone="text-green-600" />
        <Metric label="Rejected" value={rejected} tone="text-red-500" />
        <Metric label="In Review" value={inReview} tone="text-slate-500" />
      </div>

      <div className="card p-6 max-w-4xl">
        <p className="text-sm text-brand-600 font-semibold">
          Outstanding balance
        </p>
        <p className="text-3xl font-extrabold mt-1">
          {formatCurrency(ledger?.balance ?? 0)}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/retailer/market" className="btn-primary">
            Browse market <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/retailer/orders" className="btn-secondary">
            View orders
          </Link>
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="card p-6 text-center">
      <p className="font-semibold text-slate-900">{label}</p>
      <p className={`text-4xl font-extrabold mt-2 ${tone}`}>{value}</p>
    </div>
  );
}
