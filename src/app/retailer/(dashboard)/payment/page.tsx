import { getFullUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";

export default async function RetailerPayments() {
  const user = await getFullUser();
  const retailer = user?.retailer;
  if (!retailer) return null;

  const [invoiced, paid, pending] = await Promise.all([
    prisma.ledgerEntry.aggregate({
      where: { retailerId: retailer.id, type: "INVOICE" },
      _sum: { amount: true },
    }),
    prisma.ledgerEntry.aggregate({
      where: { retailerId: retailer.id, type: "PAYMENT" },
      _sum: { amount: true },
    }),
    prisma.ledgerEntry.findFirst({
      where: { retailerId: retailer.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        <div className="card p-6 text-center">
          <p className="font-semibold">Total Purchases</p>
          <p className="text-3xl font-extrabold mt-2">
            {formatCurrency(invoiced._sum.amount || 0)}
          </p>
        </div>
        <div className="card p-6 text-center">
          <p className="font-semibold">Paid</p>
          <p className="text-3xl font-extrabold mt-2">
            {formatCurrency(paid._sum.amount || 0)}
          </p>
        </div>
        <div className="card p-6 text-center">
          <p className="font-semibold">Pending</p>
          <p className="text-3xl font-extrabold mt-2">
            {formatCurrency(pending?.balance ?? 0)}
          </p>
        </div>
      </div>

      <div className="card p-8 text-center text-slate-500">
        Payment integration coming soon.
      </div>
    </div>
  );
}
