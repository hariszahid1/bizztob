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
import { MessageSquare } from "lucide-react";

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
    include: {
      items: true,
      distributor: { include: { user: true } },
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
      <div className="card p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <h1 className="text-xl font-bold text-slate-900">Order Details</h1>
          {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
            <button className="text-red-600 font-semibold text-sm hover:underline">
              Cancel Request
            </button>
          )}
        </div>

        <div className="mt-6">
          <p className="text-slate-900 font-semibold">User</p>
          <div className="mt-3 flex items-center gap-4 border-b border-slate-100 pb-4 max-w-2xl">
            <div className="h-12 w-12 rounded-full bg-brand-100 grid place-items-center text-brand-600 font-bold text-lg">
              {order.distributor.user.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900">
                {order.distributor.user.name}
              </p>
              <p className="text-red-500 font-medium text-sm">
                {order.distributor.businessName}
              </p>
            </div>
            <div className="text-slate-500 text-sm">Distributor</div>
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
            label="Product Name:"
            value={order.items[0]?.name || "-"}
          />
          <Row
            label="Items:"
            value={order.items.reduce((s, i) => s + i.quantity, 0)}
          />
          <Row
            label="Credit:"
            value={
              <span className="text-red-500 font-semibold">
                {formatCurrency(order.ledger?.balance ?? 0)}
              </span>
            }
          />
          <Row
            label="Total:"
            value={
              <span className="font-semibold">
                {formatCurrency(order.totalAmount)}
              </span>
            }
          />
        </div>

        <div className="mt-6 flex items-center justify-between max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-brand-600 font-semibold">Status:</span>
            <span className={orderStatusStyle(order.status)}>
              {orderStatusLabel(order.status)}
            </span>
          </div>
          <button className="btn-primary">Invoice</button>
        </div>

        <div className="mt-8">
          <p className="text-slate-900 font-semibold mb-3">Items</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {order.items.map((it) => (
              <div
                key={it.id}
                className="rounded-2xl bg-white ring-1 ring-slate-100 overflow-hidden"
              >
                <div className="aspect-[4/3] bg-orange-100 grid place-items-center text-orange-400 text-3xl font-bold">
                  {it.name.charAt(0)}
                </div>
                <div className="p-3">
                  <p className="text-brand-600 font-bold line-clamp-1">
                    {it.name}
                  </p>
                  <p className="text-green-600 text-xs mt-1">
                    {formatCurrency(it.unitPrice)}{" "}
                    <span className="text-slate-500 ml-1">
                      QTY: {it.quantity}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <Link
          href="/retailer/orders"
          className="text-brand-600 hover:underline text-sm"
        >
          ← Back to orders
        </Link>
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
