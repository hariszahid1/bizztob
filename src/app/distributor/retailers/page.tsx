import Link from "next/link";
import { getFullUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";

export default async function RetailersPage() {
  const user = await getFullUser();
  const dist = user?.distributor;
  if (!dist) return null;

  const retailerIds = await prisma.order.findMany({
    where: { distributorId: dist.id },
    distinct: ["retailerId"],
    select: { retailerId: true },
  });
  const ids = retailerIds.map((r) => r.retailerId);
  const retailers = await prisma.retailer.findMany({
    where: { id: { in: ids } },
    include: { user: true },
  });

  const rows = await Promise.all(
    retailers.map(async (r) => {
      const [orderCount, last] = await Promise.all([
        prisma.order.count({
          where: { retailerId: r.id, distributorId: dist.id },
        }),
        prisma.ledgerEntry.findFirst({
          where: { retailerId: r.id, distributorId: dist.id },
          orderBy: { createdAt: "desc" },
        }),
      ]);
      return { retailer: r, orderCount, balance: last?.balance ?? 0 };
    })
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Retailers</h2>
        <p className="text-slate-600 text-sm mt-1">
          Retailers who have placed orders with you.
        </p>
      </div>

      <div className="card overflow-hidden">
        {rows.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No retailers yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-500 bg-slate-50">
                <tr>
                  <th className="px-5 py-3">Shop</th>
                  <th className="px-5 py-3">Contact</th>
                  <th className="px-5 py-3">City</th>
                  <th className="px-5 py-3">Orders</th>
                  <th className="px-5 py-3">Balance</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r) => (
                  <tr key={r.retailer.id}>
                    <td className="px-5 py-3 font-medium">
                      {r.retailer.shopName}
                    </td>
                    <td className="px-5 py-3">
                      <p>{r.retailer.user.name}</p>
                      <p className="text-xs text-slate-500">
                        {r.retailer.user.email}
                      </p>
                    </td>
                    <td className="px-5 py-3">{r.retailer.city || "-"}</td>
                    <td className="px-5 py-3">{r.orderCount}</td>
                    <td className="px-5 py-3 font-medium">
                      {formatCurrency(r.balance)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/distributor/ledger/${r.retailer.id}`}
                        className="text-brand-700 hover:underline text-sm"
                      >
                        Ledger
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
