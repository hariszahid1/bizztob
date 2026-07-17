import { getFullUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function DistributorLedgerPage() {
  const user = await getFullUser();
  const dist = user?.distributor;
  if (!dist) return null;

  const [entries, invoiced, paid] = await Promise.all([
    prisma.ledgerEntry.findMany({
      where: { distributorId: dist.id },
      orderBy: { createdAt: "asc" },
      include: { retailer: true, order: true },
    }),
    prisma.ledgerEntry.aggregate({
      where: { distributorId: dist.id, type: "INVOICE" },
      _sum: { amount: true },
    }),
    prisma.ledgerEntry.aggregate({
      where: { distributorId: dist.id, type: "PAYMENT" },
      _sum: { amount: true },
    }),
  ]);

  const invoiceTotal = invoiced._sum.amount || 0;
  const paidTotal = paid._sum.amount || 0;
  const receivable = invoiceTotal - paidTotal;

  const invoices = entries.filter((e) => e.type === "INVOICE");
  const payments = entries.filter((e) => e.type === "PAYMENT");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <BigStat label="Total Invoice Amount" value={invoiceTotal} />
        <BigStat label="Total Received" value={paidTotal} />
        <BigStat label="Total Receivable" value={receivable} />
      </div>

      <div className="card">
        <div className="p-5">
          <h3 className="font-bold text-slate-900">General Ledger</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="fg-table">
            <thead>
              <tr>
                <th>Invoice Date</th>
                <th>Invoice ID</th>
                <th>Retailer Name</th>
                <th>Total Amount</th>
                <th>Paid</th>
                <th className="text-white">
                  <span className="inline-block bg-brand-gradient rounded px-2 py-1">
                    Balance Due
                  </span>
                </th>
                <th>Due Date</th>
                <th>
                  Payment 1 <span className="italic text-slate-400">Date</span>
                </th>
                <th>
                  Payment 2 <span className="italic text-slate-400">Date</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => {
                const relatedPayments = payments.filter(
                  (p) => p.retailerId === inv.retailerId
                );
                const p1 = relatedPayments[0];
                const p2 = relatedPayments[1];
                const invId = inv.id.slice(-5).toUpperCase();
                return (
                  <tr key={inv.id}>
                    <td>{formatDate(inv.createdAt)}</td>
                    <td className="text-slate-700">#{invId}</td>
                    <td>{inv.retailer.shopName}</td>
                    <td>{formatCurrency(inv.amount)}</td>
                    <td>
                      {formatCurrency(
                        relatedPayments.reduce((s, x) => s + x.amount, 0)
                      )}
                    </td>
                    <td className="font-semibold text-brand-600">
                      {formatCurrency(inv.balance)}
                    </td>
                    <td>
                      {formatDate(
                        new Date(
                          inv.createdAt.getTime() + 30 * 24 * 3600 * 1000
                        )
                      )}
                    </td>
                    <td>
                      {p1 ? (
                        <>
                          {formatCurrency(p1.amount)}{" "}
                          <span className="text-slate-400 italic ml-1">
                            {formatDate(p1.createdAt)}
                          </span>
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {p2 ? (
                        <>
                          {formatCurrency(p2.amount)}{" "}
                          <span className="text-slate-400 italic ml-1">
                            {formatDate(p2.createdAt)}
                          </span>
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                );
              })}
              {invoices.length > 0 && (
                <tr className="font-semibold">
                  <td className="text-brand-600">TOTAL</td>
                  <td>{invoices.length}</td>
                  <td></td>
                  <td>{formatCurrency(invoiceTotal)}</td>
                  <td>{formatCurrency(paidTotal)}</td>
                  <td className="text-brand-600 bg-brand-50 rounded-md">
                    {formatCurrency(receivable)}
                  </td>
                  <td colSpan={3}></td>
                </tr>
              )}
            </tbody>
          </table>
          {invoices.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-sm">
              No ledger entries yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BigStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-6 text-center">
      <p className="font-semibold text-slate-900">{label}</p>
      <p className="text-3xl font-extrabold mt-2">{formatCurrency(value)}</p>
    </div>
  );
}
