import Link from "next/link";
import { notFound } from "next/navigation";
import { getFullUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { RecordPayment } from "./RecordPayment";

const typeLabels: Record<string, { label: string; cls: string }> = {
  INVOICE: { label: "Invoice", cls: "badge-amber" },
  PAYMENT: { label: "Payment", cls: "badge-green" },
  CREDIT_NOTE: { label: "Credit", cls: "badge-blue" },
  DEBIT_NOTE: { label: "Debit", cls: "badge-red" },
};

export default async function RetailerLedgerDetail({
  params,
}: {
  params: { retailerId: string };
}) {
  const user = await getFullUser();
  const dist = user?.distributor;
  if (!dist) return null;

  const retailer = await prisma.retailer.findUnique({
    where: { id: params.retailerId },
    include: { user: true },
  });
  if (!retailer) notFound();

  const entries = await prisma.ledgerEntry.findMany({
    where: { retailerId: retailer.id, distributorId: dist.id },
    orderBy: { createdAt: "desc" },
    include: { order: true },
  });

  const balance = entries[0]?.balance ?? 0;

  return (
    <div className="space-y-6">
      <Link
        href="/distributor/ledger"
        className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to ledgers
      </Link>

      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            {retailer.shopName}
          </h2>
          <p className="text-sm text-slate-500 mt-1">{retailer.user.email}</p>
        </div>
        <div className="card px-5 py-3">
          <p className="text-xs text-slate-500">Outstanding balance</p>
          <p className="text-xl font-semibold">{formatCurrency(balance)}</p>
        </div>
      </div>

      <RecordPayment retailerId={retailer.id} />

      <div className="card overflow-hidden">
        {entries.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No ledger entries yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-500 bg-slate-50">
                <tr>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Note</th>
                  <th className="px-5 py-3 text-right">Amount</th>
                  <th className="px-5 py-3 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entries.map((e) => (
                  <tr key={e.id}>
                    <td className="px-5 py-3">{formatDateTime(e.createdAt)}</td>
                    <td className="px-5 py-3">
                      <span className={typeLabels[e.type]?.cls || "badge-slate"}>
                        {typeLabels[e.type]?.label || e.type}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {e.note || (e.order ? `Order ${e.order.code}` : "-")}
                    </td>
                    <td className="px-5 py-3 text-right">
                      {e.type === "PAYMENT" ? "-" : "+"}
                      {formatCurrency(e.amount)}
                    </td>
                    <td className="px-5 py-3 text-right font-medium">
                      {formatCurrency(e.balance)}
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
