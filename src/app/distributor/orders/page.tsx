import Link from "next/link";
import { getFullUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  formatCurrency,
  orderStatusLabel,
  orderStatusStyle,
} from "@/lib/utils";
import { Search } from "lucide-react";
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

  const [orders, delivered, pending, rejected, totalAll] = await Promise.all([
    prisma.order.findMany({
      where: {
        distributorId: dist.id,
        ...(status ? { status } : {}),
      },
      include: { retailer: true, items: true, ledger: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.count({
      where: { distributorId: dist.id, status: "DELIVERED" },
    }),
    prisma.order.count({
      where: { distributorId: dist.id, status: "PENDING" },
    }),
    prisma.order.count({
      where: { distributorId: dist.id, status: "CANCELLED" },
    }),
    prisma.order.count({ where: { distributorId: dist.id } }),
  ]);

  const now = new Date();
  const label = now.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <ProgressCard
          date={label}
          title="Delivered"
          count={delivered}
          total={Math.max(totalAll, 1)}
          color="bg-green-500"
        />
        <ProgressCard
          date={label}
          title="In Review"
          count={pending}
          total={Math.max(totalAll, 1)}
          color="bg-yellow-400"
        />
        <ProgressCard
          date={label}
          title="Rejected"
          count={rejected}
          total={Math.max(totalAll, 1)}
          color="bg-red-500"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="search-box flex-1 max-w-md">
          <Search className="h-4 w-4 search-ico" />
          <input placeholder="Search" />
        </div>
        <span
          className="btn-primary opacity-60 cursor-not-allowed"
          title="Counter selling coming soon"
        >
          New Order
        </span>
      </div>

      <div className="card">
        <div className="p-5 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">My Orders</h3>
          <button className="filter-pill">Filter</button>
        </div>
        {orders.length === 0 ? (
          <div className="p-10 text-center text-slate-500">No orders yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="fg-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Retailer Name</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th></th>
                  <th>Total</th>
                  <th>Credits</th>
                  <th className="text-right">...</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr key={o.id}>
                    <td>{i + 1}.</td>
                    <td className="font-medium text-slate-900">
                      {o.retailer.shopName}
                    </td>
                    <td>{o.items.length}</td>
                    <td>
                      <span className={orderStatusStyle(o.status)}>
                        {orderStatusLabel(o.status)}
                      </span>
                    </td>
                    <td>
                      <Link
                        href={`/distributor/orders/${o.id}`}
                        className="row-action"
                      >
                        edit
                      </Link>
                    </td>
                    <td>{formatCurrency(o.totalAmount)}</td>
                    <td>{formatCurrency(o.ledger?.balance ?? 0)}</td>
                    <td className="text-right">
                      <Link
                        href={`/distributor/orders/${o.id}`}
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
    </div>
  );
}

function ProgressCard({
  date,
  title,
  count,
  total,
  color,
}: {
  date: string;
  title: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.min(100, Math.round((count / total) * 100)) : 0;
  return (
    <div className="card p-6">
      <p className="text-xs text-slate-400">{date}</p>
      <p className="text-2xl font-bold text-slate-900 mt-2">{title}</p>
      <div className="mt-6">
        <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
          <div
            className={`h-full rounded-full ${color}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-slate-500">Progress</span>
          <span className="font-semibold text-slate-800">{pct}%</span>
        </div>
      </div>
    </div>
  );
}
