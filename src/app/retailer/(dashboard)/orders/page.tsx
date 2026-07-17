import Link from "next/link";
import { getFullUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  formatCurrency,
  orderStatusLabel,
  orderStatusStyle,
} from "@/lib/utils";

export default async function RetailerOrders() {
  const user = await getFullUser();
  const retailer = user?.retailer;
  if (!retailer) return null;

  const [orders, accepted, rejected, inReview] = await Promise.all([
    prisma.order.findMany({
      where: { retailerId: retailer.id },
      orderBy: { createdAt: "desc" },
      include: { distributor: true, items: true, ledger: true },
    }),
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
  ]);

  const pending = orders.filter((o) =>
    ["PENDING", "CANCELLED"].includes(o.status)
  );
  const active = orders.filter(
    (o) => !["PENDING", "CANCELLED"].includes(o.status)
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4 lg:gap-6 max-w-4xl">
        <Metric label="Accepted" value={accepted} tone="text-green-600" />
        <Metric label="Rejected" value={rejected} tone="text-red-500" />
        <Metric label="In Review" value={inReview} tone="text-slate-500" />
      </div>

      <OrdersTable
        title="Order Request"
        orders={pending}
        emptyText="No pending order requests."
      />
      <OrdersTable
        title="Order Requests"
        orders={active}
        emptyText="No confirmed orders yet."
      />
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
    <div className="card p-4 lg:p-6 text-center">
      <p className="font-semibold text-slate-900">{label}</p>
      <p className={`text-3xl lg:text-4xl font-extrabold mt-2 ${tone}`}>
        {value}
      </p>
    </div>
  );
}

function OrdersTable({
  title,
  orders,
  emptyText,
}: {
  title: string;
  orders: any[];
  emptyText: string;
}) {
  return (
    <div className="card">
      <div className="p-5 flex items-center justify-between">
        <h3 className="font-bold text-slate-900">{title}</h3>
        <button className="filter-pill">Filter</button>
      </div>
      {orders.length === 0 ? (
        <div className="p-8 text-center text-slate-500 text-sm">
          {emptyText}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="fg-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Items</th>
                <th>Status</th>
                <th>Total</th>
                <th>Credit</th>
                <th className="text-right">...</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="font-medium text-slate-900">
                    {o.code.replace("ORD-", "")}
                  </td>
                  <td>{o.items.length}</td>
                  <td>
                    <span className={orderStatusStyle(o.status)}>
                      {orderStatusLabel(o.status)}
                    </span>
                  </td>
                  <td>{formatCurrency(o.totalAmount)}</td>
                  <td>{formatCurrency(o.ledger?.balance ?? 0)}</td>
                  <td className="text-right">
                    <Link
                      href={`/retailer/orders/${o.id}`}
                      className="row-action"
                    >
                      view
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
