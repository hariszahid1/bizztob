import { getFullUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default async function DistributorLedgersPage() {
  const user = await getFullUser();
  const dist = user?.distributor;
  if (!dist) return null;

  const groups = await prisma.ledgerEntry.groupBy({
    by: ["retailerId"],
    where: { distributorId: dist.id },
  });

  const rows = await Promise.all(
    groups.map(async (g) => {
      const [last, retailer, totals] = await Promise.all([
        prisma.ledgerEntry.findFirst({
          where: { retailerId: g.retailerId, distributorId: dist.id },
          orderBy: { createdAt: "desc" },
        }),
        prisma.retailer.findUnique({
          where: { id: g.retailerId },
          include: { user: true },
        }),
        prisma.ledgerEntry.groupBy({
          by: ["type"],
          where: { retailerId: g.retailerId, distributorId: dist.id },
          _sum: { amount: true },
        }),
      ]);
      const invoiced =
        totals.find((t) => t.type === "INVOICE")?._sum.amount ?? 0;
      const paid = totals.find((t) => t.type === "PAYMENT")?._sum.amount ?? 0;
      return {
        retailer,
        balance: last?.balance ?? 0,
        invoiced,
        paid,
      };
    })
  );

  const totalOutstanding = rows.reduce((s, r) => s + r.balance, 0);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Retailer Ledgers</h2>
        <p className="text-slate-600 text-sm mt-1">
          Track balances and record payments.
        </p>
      </div>

      <div className="card p-5">
        <p className="text-sm text-slate-500">Total outstanding across retailers</p>
        <p className="text-2xl font-semibold mt-1">
          {formatCurrency(totalOutstanding)}
        </p>
      </div>

      <div className="card overflow-hidden">
        {rows.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No ledger data yet. Deliver an order to auto-create an invoice.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-500 bg-slate-50">
                <tr>
                  <th className="px-5 py-3">Retailer</th>
                  <th className="px-5 py-3">Invoiced</th>
                  <th className="px-5 py-3">Paid</th>
                  <th className="px-5 py-3">Balance</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r) => (
                  <tr key={r.retailer!.id}>
                    <td className="px-5 py-3">
                      <p className="font-medium">{r.retailer!.shopName}</p>
                      <p className="text-xs text-slate-500">
                        {r.retailer!.user.email}
                      </p>
                    </td>
                    <td className="px-5 py-3">{formatCurrency(r.invoiced)}</td>
                    <td className="px-5 py-3">{formatCurrency(r.paid)}</td>
                    <td className="px-5 py-3 font-semibold">
                      {formatCurrency(r.balance)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/distributor/ledger/${r.retailer!.id}`}
                        className="text-brand-700 hover:underline text-sm"
                      >
                        View
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
