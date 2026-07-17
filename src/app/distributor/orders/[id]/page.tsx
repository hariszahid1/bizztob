import Link from "next/link";
import { notFound } from "next/navigation";
import { getFullUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  orderStatusStyle,
} from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { OrderActions } from "./OrderActions";

export default async function DistributorOrderDetail({
  params,
}: {
  params: { id: string };
}) {
  const user = await getFullUser();
  const dist = user?.distributor;
  if (!dist) return null;

  const order = await prisma.order.findFirst({
    where: { id: params.id, distributorId: dist.id },
    include: { items: true, retailer: true, delivery: true },
  });
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/distributor/orders"
        className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to orders
      </Link>

      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Order {order.code}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Placed on {formatDateTime(order.createdAt)} · by{" "}
            <b>{order.retailer.shopName}</b>
          </p>
        </div>
        <span className={`${orderStatusStyle(order.status)} self-start`}>
          {order.status}
        </span>
      </div>

      <OrderActions
        orderId={order.id}
        status={order.status}
        currentAddress={order.delivery?.address || order.retailer.address || ""}
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-semibold">Items</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500 bg-slate-50">
              <tr>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Qty</th>
                <th className="px-5 py-3">Unit Price</th>
                <th className="px-5 py-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((it) => (
                <tr key={it.id}>
                  <td className="px-5 py-3 font-medium">{it.name}</td>
                  <td className="px-5 py-3">{it.quantity}</td>
                  <td className="px-5 py-3">{formatCurrency(it.unitPrice)}</td>
                  <td className="px-5 py-3 text-right">
                    {formatCurrency(it.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-100">
                <td colSpan={3} className="px-5 py-3 text-right font-semibold">
                  Total
                </td>
                <td className="px-5 py-3 text-right font-semibold">
                  {formatCurrency(order.totalAmount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-semibold">Retailer</h3>
            <div className="mt-3 text-sm space-y-1">
              <p className="font-medium">{order.retailer.shopName}</p>
              {order.retailer.city && (
                <p className="text-slate-500">{order.retailer.city}</p>
              )}
            </div>
          </div>
          {order.delivery && (
            <div className="card p-5">
              <h3 className="font-semibold">Delivery</h3>
              <div className="mt-3 text-sm space-y-1">
                <p>
                  <span className="text-slate-500">Address:</span>{" "}
                  {order.delivery.address}
                </p>
                {order.delivery.driverName && (
                  <p>
                    <span className="text-slate-500">Driver:</span>{" "}
                    {order.delivery.driverName}
                  </p>
                )}
                {order.delivery.vehicleNo && (
                  <p>
                    <span className="text-slate-500">Vehicle:</span>{" "}
                    {order.delivery.vehicleNo}
                  </p>
                )}
                {order.delivery.scheduledFor && (
                  <p>
                    <span className="text-slate-500">Scheduled:</span>{" "}
                    {formatDate(order.delivery.scheduledFor)}
                  </p>
                )}
              </div>
            </div>
          )}
          {order.notes && (
            <div className="card p-5">
              <h3 className="font-semibold">Retailer notes</h3>
              <p className="mt-2 text-sm text-slate-600">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
