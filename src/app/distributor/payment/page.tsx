import { getFullUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default async function DistributorPayment() {
  const user = await getFullUser();
  const dist = user?.distributor;
  if (!dist) return null;

  const [invoiced, paid, groups] = await Promise.all([
    prisma.ledgerEntry.aggregate({
      where: { distributorId: dist.id, type: "INVOICE" },
      _sum: { amount: true },
    }),
    prisma.ledgerEntry.aggregate({
      where: { distributorId: dist.id, type: "PAYMENT" },
      _sum: { amount: true },
    }),
    prisma.ledgerEntry.groupBy({
      by: ["retailerId"],
      where: { distributorId: dist.id },
    }),
  ]);

  const details = await Promise.all(
    groups.map(async (g) => {
      const [retailer, last] = await Promise.all([
        prisma.retailer.findUnique({
          where: { id: g.retailerId },
          include: { user: true },
        }),
        prisma.ledgerEntry.findFirst({
          where: { retailerId: g.retailerId, distributorId: dist.id },
          orderBy: { createdAt: "desc" },
        }),
      ]);
      return { retailer, balance: last?.balance ?? 0 };
    })
  );

  const pending = details.filter((d) => d.balance > 0);
  const cleared = details.filter((d) => d.balance <= 0);

  const totalSale = invoiced._sum.amount || 0;
  const paidTotal = paid._sum.amount || 0;
  const pendingTotal = totalSale - paidTotal;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <div className="card p-6 text-center">
          <p className="font-bold text-slate-900">Total Sale</p>
          <p className="text-3xl font-extrabold mt-2">
            {formatCurrency(totalSale)}
          </p>
          <div className="mt-3 inline-flex items-center gap-2 rounded bg-green-100 text-green-700 px-2 py-1 text-xs font-semibold">
            +20%{" "}
            <span className="text-slate-500 font-normal">Last month</span>
          </div>
        </div>
        <div className="card p-6 text-center">
          <p className="font-bold text-slate-900">Paid</p>
          <p className="text-3xl font-extrabold mt-2">
            {formatCurrency(paidTotal)}
          </p>
        </div>
        <div className="card p-6 text-center">
          <p className="font-bold text-slate-900">Pending</p>
          <p className="text-3xl font-extrabold mt-2">
            {formatCurrency(pendingTotal)}
          </p>
        </div>
      </div>

      <PaymentSection
        title="Pending Payments"
        rows={pending}
        dotColor="bg-yellow-400"
      />
      <PaymentSection
        title="Paid Payments"
        rows={cleared}
        dotColor="bg-green-500"
      />
    </div>
  );
}

function PaymentSection({
  title,
  rows,
  dotColor,
}: {
  title: string;
  rows: { retailer: any; balance: number }[];
  dotColor: string;
}) {
  return (
    <div className="card">
      <div className="p-5 flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${dotColor}`} />
        <h3 className="font-bold text-slate-900">{title}</h3>
      </div>
      {rows.length === 0 ? (
        <div className="p-8 text-center text-slate-500 text-sm">
          Nothing here yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="fg-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Retailer Name</th>
                <th>City</th>
                <th>Credits</th>
                <th className="text-right">...</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.retailer.id}>
                  <td>{i + 1}.</td>
                  <td>{r.retailer.user.name}</td>
                  <td>{r.retailer.city || "-"}</td>
                  <td>{formatCurrency(r.balance)}</td>
                  <td className="text-right">
                    <Link
                      href={`/distributor/ledger/${r.retailer.id}`}
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
