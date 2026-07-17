import { getFullUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

export default async function DeliveriesPage() {
  const user = await getFullUser();
  const dist = user?.distributor;
  if (!dist) return null;

  const deliveries = await prisma.delivery.findMany({
    where: { distributorId: dist.id },
    include: { order: { include: { retailer: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Deliveries</h2>
        <p className="text-slate-600 text-sm mt-1">
          Scheduled and completed deliveries.
        </p>
      </div>

      <div className="card overflow-hidden">
        {deliveries.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No deliveries scheduled yet. Confirm an order to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-500 bg-slate-50">
                <tr>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Retailer</th>
                  <th className="px-5 py-3">Address</th>
                  <th className="px-5 py-3">Scheduled</th>
                  <th className="px-5 py-3">Driver / Vehicle</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deliveries.map((d) => (
                  <tr key={d.id}>
                    <td className="px-5 py-3">
                      <Link
                        href={`/distributor/orders/${d.orderId}`}
                        className="font-medium text-brand-700 hover:underline"
                      >
                        {d.order.code}
                      </Link>
                    </td>
                    <td className="px-5 py-3">{d.order.retailer.shopName}</td>
                    <td className="px-5 py-3 max-w-xs truncate">{d.address}</td>
                    <td className="px-5 py-3">
                      {d.scheduledFor ? formatDate(d.scheduledFor) : "-"}
                    </td>
                    <td className="px-5 py-3">
                      {d.driverName || "-"}
                      {d.vehicleNo ? ` · ${d.vehicleNo}` : ""}
                    </td>
                    <td className="px-5 py-3">
                      {formatCurrency(d.order.totalAmount)}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={
                          d.status === "DELIVERED"
                            ? "badge-green"
                            : d.status === "DISPATCHED"
                              ? "badge-blue"
                              : "badge-amber"
                        }
                      >
                        {d.status}
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
