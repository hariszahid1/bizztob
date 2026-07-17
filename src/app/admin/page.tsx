import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { Package, Store, Truck, Users } from "lucide-react";

export default async function AdminDashboard() {
  const [
    distributors,
    retailers,
    products,
    orders,
    totalRevenue,
  ] = await Promise.all([
    prisma.distributor.count(),
    prisma.retailer.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: { in: ["DELIVERED", "DISPATCHED"] } },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
        <BigStat label="Distributors" value={distributors.toString()} icon={<Truck className="h-5 w-5" />} />
        <BigStat label="Retailers" value={retailers.toString()} icon={<Store className="h-5 w-5" />} />
        <BigStat label="Products" value={products.toString()} icon={<Package className="h-5 w-5" />} />
        <BigStat
          label="Total GMV"
          value={formatCurrency(totalRevenue._sum.totalAmount || 0)}
          icon={<Users className="h-5 w-5" />}
          hint={`${orders} orders`}
        />
      </div>
    </div>
  );
}

function BigStat({
  label,
  value,
  icon,
  hint,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-brand-100 text-brand-600 grid place-items-center">
          {icon}
        </div>
        <p className="font-semibold text-slate-900">{label}</p>
      </div>
      <p className="text-3xl font-extrabold mt-3">{value}</p>
      {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
    </div>
  );
}
