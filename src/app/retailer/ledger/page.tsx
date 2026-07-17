import { getFullUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDateTime } from "@/lib/utils";

const typeLabels: Record<string, { label: string; cls: string }> = {
  INVOICE: { label: "Invoice", cls: "badge-amber" },
  PAYMENT: { label: "Payment", cls: "badge-green" },
  CREDIT_NOTE: { label: "Credit", cls: "badge-blue" },
  DEBIT_NOTE: { label: "Debit", cls: "badge-red" },
};

export default async function LedgerPage() {
  const user = await getFullUser();
  const retailer = user?.retailer;
  if (!retailer) return null;

  const entries = await prisma.ledgerEntry.findMany({
    where: { retailerId: retailer.id },
    orderBy: { createdAt: "desc" },
    include: { distributor: true, order: true },
  });

  const balance = entries[0]?.balance ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Ledger</h2>
        <p className="text-slate-600 text-sm mt-1">
          Your invoices, payments, and running balance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5">
          <p className="text-sm text-slate-500">Outstanding balance</p>
          <p className="text-2xl font-semibold mt-1">
            {formatCurrency(balance)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {balance > 0 ? "Amount you owe" : "You are clear!"}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-500">Total invoiced</p>
          <p className="text-2xl font-semibold mt-1">
            {formatCurrency(
              entries
                .filter((e) => e.type === "INVOICE")
                .reduce((s, e) => s + e.amount, 0)
            )}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-500">Total paid</p>
          <p className="text-2xl font-semibold mt-1">
            {formatCurrency(
              entries
                .filter((e) => e.type === "PAYMENT")
                .reduce((s, e) => s + e.amount, 0)
            )}
          </p>
        </div>
      </div>

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
                  <th className="px-5 py-3">Distributor</th>
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
                    <td className="px-5 py-3 text-slate-700">
                      {e.note || (e.order ? `Order ${e.order.code}` : "-")}
                    </td>
                    <td className="px-5 py-3">{e.distributor.businessName}</td>
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
