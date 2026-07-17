import Link from "next/link";
import { getFullUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { StatCard } from "@/components/StatCard";
import { formatCurrency, formatDate, orderStatusStyle } from "@/lib/utils";
import {
  ArrowRight,
  BarChart3,
  ClipboardList,
  Package,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

export default async function DistributorDashboard() {
  const user = await getFullUser();
  const dist = user?.distributor;
  if (!dist) return null;

  const [pending, todayOrders, totalOrders, productCount, recent, topProducts] =
    await Promise.all([
      prisma.order.count({
        where: { distributorId: dist.id, status: "PENDING" },
      }),
      prisma.order.count({
        where: {
          distributorId: dist.id,
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.order.count({ where: { distributorId: dist.id } }),
      prisma.product.count({ where: { distributorId: dist.id } }),
      prisma.order.findMany({
        where: { distributorId: dist.id },
        include: { retailer: true, items: true },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
      prisma.orderItem.groupBy({
        by: ["productId", "name"],
        where: { order: { distributorId: dist.id } },
        _sum: { quantity: true, subtotal: true },
        orderBy: { _sum: { subtotal: "desc" } },
        take: 5,
      }),
    ]);

  const outstanding = await prisma.ledgerEntry.groupBy({
    by: ["retailerId"],
    where: { distributorId: dist.id },
    _max: { createdAt: true },
  });

  const balances = await Promise.all(
    outstanding.map(async (o) => {
      const last = await prisma.ledgerEntry.findFirst({
        where: { retailerId: o.retailerId, distributorId: dist.id },
        orderBy: { createdAt: "desc" },
      });
      return last?.balance ?? 0;
    })
  );
  const totalOutstanding = balances.reduce((s, b) => s + b, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Welcome, {user?.name.split(" ")[0]}
          </h2>
          <p className="text-slate-600 mt-1">{dist.businessName}</p>
        </div>
        <Link href="/distributor/orders" className="btn-primary">
          View orders <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Pending Orders"
          value={pending}
          icon={<ClipboardList className="h-5 w-5" />}
          tone="amber"
        />
        <StatCard
          label="Today's Orders"
          value={todayOrders}
          icon={<ShoppingBag className="h-5 w-5" />}
          tone="brand"
        />
        <StatCard
          label="Products"
          value={productCount}
          icon={<Package className="h-5 w-5" />}
          tone="slate"
        />
        <StatCard
          label="Outstanding"
          value={formatCurrency(totalOutstanding)}
          icon={<BarChart3 className="h-5 w-5" />}
          tone={totalOutstanding > 0 ? "amber" : "green"}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card lg:col-span-2 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold">Recent orders</h3>
            <Link
              href="/distributor/orders"
              className="text-sm text-brand-700 hover:underline"
            >
              View all
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No orders yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-slate-500 bg-slate-50">
                  <tr>
                    <th className="px-5 py-3">Order</th>
                    <th className="px-5 py-3">Retailer</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Total</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recent.map((o) => (
                    <tr key={o.id}>
                      <td className="px-5 py-3">
                        <Link
                          href={`/distributor/orders/${o.id}`}
                          className="font-medium text-brand-700 hover:underline"
                        >
                          {o.code}
                        </Link>
                      </td>
                      <td className="px-5 py-3">{o.retailer.shopName}</td>
                      <td className="px-5 py-3">{formatDate(o.createdAt)}</td>
                      <td className="px-5 py-3">
                        {formatCurrency(o.totalAmount)}
                      </td>
                      <td className="px-5 py-3">
                        <span className={orderStatusStyle(o.status)}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <div className="p-5 border-b border-slate-100 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-600" />
            <h3 className="font-semibold">Top products (demand)</h3>
          </div>
          {topProducts.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-sm">
              No sales yet.
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {topProducts.map((p, i) => (
                <li key={p.productId} className="p-4 flex items-center gap-3">
                  <span className="h-7 w-7 rounded-lg bg-brand-50 text-brand-700 grid place-items-center text-xs font-semibold">
                    #{i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-slate-500">
                      {p._sum.quantity} units ·{" "}
                      {formatCurrency(p._sum.subtotal || 0)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
