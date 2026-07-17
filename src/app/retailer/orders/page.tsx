import Link from "next/link";
import { getFullUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDate, orderStatusStyle } from "@/lib/utils";

export default async function RetailerOrders() {
  const user = await getFullUser();
  const retailer = user?.retailer;
  if (!retailer) return null;

  const orders = await prisma.order.findMany({
    where: { retailerId: retailer.id },
    orderBy: { createdAt: "desc" },
    include: { distributor: true, items: true },
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">My Orders</h2>
        <p className="text-slate-600 text-sm mt-1">
          Track order status from placement to delivery.
        </p>
      </div>

      <div className="card overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            You haven&apos;t placed any orders yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-500 bg-slate-50">
                <tr>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Distributor</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Items</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="px-5 py-3 font-medium">{o.code}</td>
                    <td className="px-5 py-3">{o.distributor.businessName}</td>
                    <td className="px-5 py-3">{formatDate(o.createdAt)}</td>
                    <td className="px-5 py-3">{o.items.length}</td>
                    <td className="px-5 py-3">
                      {formatCurrency(o.totalAmount)}
                    </td>
                    <td className="px-5 py-3">
                      <span className={orderStatusStyle(o.status)}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/retailer/orders/${o.id}`}
                        className="text-brand-700 hover:underline text-sm"
                      >
                        View
                      </Link>
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
