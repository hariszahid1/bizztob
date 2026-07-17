import { prisma } from "@/lib/db";
import { StatCard } from "@/components/StatCard";
import { formatCurrency, formatDate, orderStatusStyle } from "@/lib/utils";
import { Package, Store, Truck, Users } from "lucide-react";

export default async function AdminDashboard() {
  const [
    distributors,
    retailers,
    products,
    orders,
    totalRevenue,
    recentOrders,
  ] = await Promise.all([
    prisma.distributor.count(),
    prisma.retailer.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: { in: ["DELIVERED", "DISPATCHED"] } },
    }),
    prisma.order.findMany({
      include: { retailer: true, distributor: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Overview</h2>
        <p className="text-slate-600 mt-1">
          Platform-wide metrics and activity.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Distributors"
          value={distributors}
          icon={<Truck className="h-5 w-5" />}
          tone="brand"
        />
        <StatCard
          label="Retailers"
          value={retailers}
          icon={<Store className="h-5 w-5" />}
          tone="green"
        />
        <StatCard
          label="Products"
          value={products}
          icon={<Package className="h-5 w-5" />}
          tone="slate"
        />
        <StatCard
          label="Total GMV"
          value={formatCurrency(totalRevenue._sum.totalAmount || 0)}
          icon={<Users className="h-5 w-5" />}
          tone="amber"
          hint={`${orders} orders total`}
        />
      </div>

      <div className="card overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-semibold">Recent platform orders</h3>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No orders yet on the platform.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-500 bg-slate-50">
                <tr>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Retailer</th>
                  <th className="px-5 py-3">Distributor</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td className="px-5 py-3 font-medium">{o.code}</td>
                    <td className="px-5 py-3">{o.retailer.shopName}</td>
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
