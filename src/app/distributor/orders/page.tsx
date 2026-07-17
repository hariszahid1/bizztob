import Link from "next/link";
import { getFullUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDate, orderStatusStyle } from "@/lib/utils";
import { OrderStatus } from "@prisma/client";

const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "DISPATCHED",
  "DELIVERED",
  "CANCELLED",
];

export default async function DistributorOrders({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const user = await getFullUser();
  const dist = user?.distributor;
  if (!dist) return null;

  const status = ORDER_STATUSES.includes(searchParams.status as OrderStatus)
    ? (searchParams.status as OrderStatus)
    : undefined;

  const orders = await prisma.order.findMany({
    where: {
      distributorId: dist.id,
      ...(status ? { status } : {}),
    },
    include: { retailer: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  const tabs = [
    { key: "", label: "All" },
    { key: "PENDING", label: "Pending" },
    { key: "CONFIRMED", label: "Confirmed" },
    { key: "DISPATCHED", label: "Dispatched" },
    { key: "DELIVERED", label: "Delivered" },
    { key: "CANCELLED", label: "Cancelled" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Orders</h2>
        <p className="text-slate-600 text-sm mt-1">
          Confirm, dispatch, and deliver orders.
        </p>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-slate-200">
        {tabs.map((t) => {
          const active = (t.key === "" && !status) || t.key === status;
          return (
            <Link
              key={t.key || "all"}
              href={t.key ? `/distributor/orders?status=${t.key}` : "/distributor/orders"}
              className={`px-3 py-2 text-sm font-medium border-b-2 ${
                active
                  ? "border-brand-600 text-brand-700"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      <div className="card overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No orders in this view.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-500 bg-slate-50">
                <tr>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Retailer</th>
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
                    <td className="px-5 py-3">{o.retailer.shopName}</td>
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
                        href={`/distributor/orders/${o.id}`}
                        className="text-brand-700 hover:underline text-sm"
                      >
                        Manage
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
