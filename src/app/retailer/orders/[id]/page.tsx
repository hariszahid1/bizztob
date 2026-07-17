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

export default async function OrderDetail({
  params,
}: {
  params: { id: string };
}) {
  const user = await getFullUser();
  const retailer = user?.retailer;
  if (!retailer) return null;

  const order = await prisma.order.findFirst({
    where: { id: params.id, retailerId: retailer.id },
    include: { items: true, distributor: true, delivery: true },
  });
  if (!order) notFound();

  const timeline = [
    { key: "PENDING", label: "Order placed" },
    { key: "CONFIRMED", label: "Confirmed by distributor" },
    { key: "DISPATCHED", label: "Dispatched" },
    { key: "DELIVERED", label: "Delivered" },
  ];
  const statusOrder = ["PENDING", "CONFIRMED", "DISPATCHED", "DELIVERED"];
  const currentIdx = statusOrder.indexOf(order.status);

  return (
    <div className="space-y-6">
      <Link
        href="/retailer/orders"
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
            Placed on {formatDateTime(order.createdAt)}
          </p>
        </div>
        <span className={`${orderStatusStyle(order.status)} self-start`}>
          {order.status}
        </span>
      </div>

      {order.status !== "CANCELLED" && (
        <div className="card p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Status timeline</h3>
          <ol className="space-y-3">
            {timeline.map((t, i) => {
              const done = i <= currentIdx;
              return (
                <li key={t.key} className="flex items-center gap-3">
                  <span
                    className={`h-6 w-6 rounded-full grid place-items-center text-xs font-semibold ${
                      done
                        ? "bg-brand-600 text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={
                      done ? "text-slate-900 font-medium" : "text-slate-500"
                    }
                  >
                    {t.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Items</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            From {order.distributor.businessName}
          </p>
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

      {order.delivery && (
        <div className="card p-5">
          <h3 className="font-semibold text-slate-900">Delivery details</h3>
          <div className="grid sm:grid-cols-2 gap-4 mt-3 text-sm">
            <div>
              <p className="text-slate-500">Address</p>
              <p className="font-medium">{order.delivery.address}</p>
            </div>
            {order.delivery.scheduledFor && (
              <div>
                <p className="text-slate-500">Scheduled for</p>
                <p className="font-medium">
                  {formatDate(order.delivery.scheduledFor)}
                </p>
              </div>
            )}
            {order.delivery.driverName && (
              <div>
                <p className="text-slate-500">Driver</p>
                <p className="font-medium">{order.delivery.driverName}</p>
              </div>
            )}
            {order.delivery.vehicleNo && (
              <div>
                <p className="text-slate-500">Vehicle</p>
                <p className="font-medium">{order.delivery.vehicleNo}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {order.notes && (
        <div className="card p-5">
          <h3 className="font-semibold text-slate-900">Notes</h3>
          <p className="text-sm text-slate-600 mt-1">{order.notes}</p>
        </div>
      )}
    </div>
  );
}
