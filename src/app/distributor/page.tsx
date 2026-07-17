import { getFullUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Calendar } from "lucide-react";
import { ProgressRing } from "@/components/ProgressRing";

export default async function DistributorDashboard() {
  const user = await getFullUser();
  const dist = user?.distributor;
  if (!dist) return null;

  const [totalOrders, delivered, pending, rejected, revenueAgg, retailerCount] =
    await Promise.all([
      prisma.order.count({ where: { distributorId: dist.id } }),
      prisma.order.count({
        where: { distributorId: dist.id, status: "DELIVERED" },
      }),
      prisma.order.count({
        where: { distributorId: dist.id, status: "PENDING" },
      }),
      prisma.order.count({
        where: { distributorId: dist.id, status: "CANCELLED" },
      }),
      prisma.order.aggregate({
        where: { distributorId: dist.id, status: "DELIVERED" },
        _sum: { totalAmount: true },
      }),
      prisma.order.findMany({
        where: { distributorId: dist.id },
        distinct: ["retailerId"],
        select: { retailerId: true },
      }),
    ]);

  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900">
          {formatDate(start)} — {formatDate(now)}
        </p>
        <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">
          <span className="text-slate-500">Filter</span>
          <Calendar className="h-4 w-4 text-slate-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <MetricCard label="Total Orders" value={totalOrders.toString()} delta="+20%" hint="Previous period" positive />
        <MetricCard
          label="Revenue"
          value={formatCurrency(revenueAgg._sum.totalAmount || 0)}
          delta="+20%"
          hint="Previous period"
          positive={false}
        />
        <MetricCard label="Total Retailers" value={retailerCount.length.toString()} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <div className="card p-6 flex items-center justify-center">
          <ProgressRing
            value={delivered}
            total={Math.max(totalOrders, 1)}
            color="green"
            label="Delivered"
          />
        </div>
        <div className="card p-6 flex items-center justify-center">
          <ProgressRing
            value={pending}
            total={Math.max(totalOrders, 1)}
            color="yellow"
            label="Pending"
          />
        </div>
        <div className="card p-6 flex items-center justify-center">
          <ProgressRing
            value={rejected}
            total={Math.max(totalOrders, 1)}
            color="red"
            label="Rejected"
          />
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  delta,
  hint,
  positive,
}: {
  label: string;
  value: string;
  delta?: string;
  hint?: string;
  positive?: boolean;
}) {
  return (
    <div className="card p-6">
      <p className="text-center font-bold text-slate-900">{label}</p>
      <p className="text-center text-3xl lg:text-4xl font-extrabold mt-3">
        {value}
      </p>
      {delta && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded font-semibold ${
              positive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {delta}
          </span>
          {hint && <span className="text-slate-500">{hint}</span>}
        </div>
      )}
    </div>
  );
}
