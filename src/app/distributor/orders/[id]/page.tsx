import Link from "next/link";
import { notFound } from "next/navigation";
import { getFullUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  formatCurrency,
  formatDate,
  orderStatusLabel,
  orderStatusStyle,
} from "@/lib/utils";
import { ArrowLeft, MessageSquare } from "lucide-react";
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
    include: {
      items: true,
      retailer: { include: { user: true } },
      delivery: true,
      ledger: true,
    },
  });
  if (!order) notFound();

  const orderNumeric = order.code.replace(/\D/g, "").slice(-5);
  const invoiceNumeric = order.ledger?.id
    ? order.ledger.id.slice(-5).toUpperCase()
    : "-";

  return (
    <div className="space-y-6">
      <Link
        href="/distributor/orders"
        className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to orders
      </Link>

      <div className="card p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <h1 className="text-xl font-bold text-slate-900">Order Details</h1>
          <span className={orderStatusStyle(order.status)}>
            {orderStatusLabel(order.status)}
          </span>
        </div>

        <div className="mt-6">
          <p className="text-slate-900 font-semibold">Customer</p>
          <div className="mt-3 flex items-center gap-4 border-b border-slate-100 pb-4 max-w-2xl">
            <div className="h-12 w-12 rounded-full bg-brand-100 grid place-items-center text-brand-600 font-bold text-lg">
              {order.retailer.user.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900">
                {order.retailer.user.name}
              </p>
              <p className="text-red-500 font-medium text-sm">
                {order.retailer.shopName}
              </p>
            </div>
            <button
              className="h-9 w-9 rounded-md bg-brand-gradient text-white grid place-items-center"
              aria-label="Message"
            >
              <MessageSquare className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 max-w-2xl">
          <Row label="Order ID:" value={`#${orderNumeric}`} />
          <Row label="Invoice ID:" value={`#${invoiceNumeric}`} />
          <Row label="Date:" value={formatDate(order.createdAt)} />
          <Row
            label="Customer Phone:"
            value={order.retailer.user.phone || "-"}
          />
          <Row
            label="Customer Address:"
            value={order.retailer.address || order.retailer.city || "-"}
          />
          <Row
            label="Items:"
            value={order.items.reduce((s, i) => s + i.quantity, 0)}
          />
          <Row
            label="Total:"
            value={
              <span className="font-semibold">
                {formatCurrency(order.totalAmount)}
              </span>
            }
          />
          <Row
            label="Paid:"
            value={formatCurrency(
              Math.max(
                0,
                order.totalAmount - (order.ledger?.balance ?? 0)
              )
            )}
          />
          <Row
            label="Pending:"
            value={
              <span className="text-red-500 font-semibold">
                {formatCurrency(order.ledger?.balance ?? 0)}
              </span>
            }
          />
        </div>

        <div className="mt-6">
          <OrderActions
            orderId={order.id}
            status={order.status}
            currentAddress={
              order.delivery?.address || order.retailer.address || ""
            }
          />
        </div>

        <div className="mt-8">
          <p className="text-slate-900 font-semibold mb-3">Items</p>
          <div className="overflow-x-auto">
            <table className="fg-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Picture</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>Items</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((it, i) => (
                  <tr key={it.id}>
                    <td>{i + 1}.</td>
                    <td>
                      <div className="h-10 w-10 rounded-md bg-orange-100 grid place-items-center text-orange-500 font-bold">
                        {it.name.charAt(0)}
                      </div>
                    </td>
                    <td>{it.name}</td>
                    <td>{formatCurrency(it.unitPrice)}</td>
                    <td>{formatCurrency(it.subtotal)}</td>
                    <td>{it.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 items-center gap-4">
      <div className="text-brand-600 font-semibold">{label}</div>
      <div className="text-slate-800 text-right sm:text-left">{value}</div>
    </div>
  );
}
