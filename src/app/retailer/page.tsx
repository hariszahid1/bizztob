import Link from "next/link";
import { getFullUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { StatCard } from "@/components/StatCard";
import { formatCurrency, formatDate, orderStatusStyle } from "@/lib/utils";
import {
  Package,
  Wallet,
  ShoppingBag,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default async function RetailerOverview() {
  const user = await getFullUser();
  const retailer = user?.retailer;
  if (!retailer) return null;

  const [orders, ledger, topSuggestion] = await Promise.all([
    prisma.order.findMany({
      where: { retailerId: retailer.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { distributor: true },
    }),
    prisma.ledgerEntry.findMany({
      where: { retailerId: retailer.id },
      orderBy: { createdAt: "desc" },
      take: 1,
    }),
    prisma.orderItem.groupBy({
      by: ["productId", "name"],
      where: { order: { retailerId: retailer.id } },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 1,
    }),
  ]);

  const balance = ledger[0]?.balance ?? 0;
  const pending = await prisma.order.count({
    where: { retailerId: retailer.id, status: "PENDING" },
  });
  const totalOrders = await prisma.order.count({
    where: { retailerId: retailer.id },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Welcome, {user?.name.split(" ")[0]}
          </h2>
          <p className="text-slate-600 mt-1">
            {retailer.shopName}
            {retailer.city ? ` · ${retailer.city}` : ""}
          </p>
        </div>
        <Link href="/retailer/catalog" className="btn-primary">
          Browse catalog <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Orders"
          value={totalOrders}
          icon={<Package className="h-5 w-5" />}
          tone="brand"
        />
        <StatCard
          label="Pending Orders"
          value={pending}
          icon={<ShoppingBag className="h-5 w-5" />}
          tone="amber"
        />
        <StatCard
          label="Outstanding Balance"
          value={formatCurrency(balance)}
          icon={<Wallet className="h-5 w-5" />}
          tone={balance > 0 ? "amber" : "green"}
        />
        <StatCard
          label="AI Suggestions"
          value={topSuggestion.length > 0 ? "1 new" : "0"}
          icon={<Sparkles className="h-5 w-5" />}
          tone="green"
        />
      </div>

      {topSuggestion[0] && (
        <div className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-green-50 text-green-700 grid place-items-center">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-slate-900">
              Smart reorder suggestion
            </p>
            <p className="text-sm text-slate-600">
              You often order <b>{topSuggestion[0].name}</b>. Want to reorder?
            </p>
          </div>
          <Link href="/retailer/catalog" className="btn-primary">
            Reorder now
          </Link>
        </div>
      )}

      <div className="card">
        <div className="p-5 flex items-center justify-between border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Recent orders</h3>
          <Link
            href="/retailer/orders"
            className="text-sm text-brand-700 hover:underline"
          >
            View all
          </Link>
        </div>
        {orders.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No orders yet. Browse the catalog to place your first order.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-500">
                <tr>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Distributor</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="px-5 py-3 font-medium">{o.code}</td>
                    <td className="px-5 py-3">{o.distributor.businessName}</td>
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
    </div>
  );
}
