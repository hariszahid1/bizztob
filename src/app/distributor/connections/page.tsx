import { getFullUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { MessageSquare, Search, User } from "lucide-react";

export default async function ConnectionsPage() {
  const user = await getFullUser();
  const dist = user?.distributor;
  if (!dist) return null;

  const retailerRows = await prisma.order.findMany({
    where: { distributorId: dist.id },
    distinct: ["retailerId"],
    select: { retailerId: true },
  });
  const ids = retailerRows.map((r) => r.retailerId);
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
    <div className="space-y-6">
      <div className="search-box max-w-md ml-auto">
        <Search className="h-4 w-4 search-ico" />
        <input placeholder="Search" />
      </div>

      <div className="card">
        <div className="p-5 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Connections</h3>
          <button className="filter-pill">Filter</button>
        </div>
        {rows.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No connected retailers yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {rows.map((r) => (
              <div
                key={r.retailer.id}
                className="p-5 flex items-center gap-4"
              >
                <div className="h-12 w-12 rounded-full bg-brand-100 grid place-items-center text-brand-600 font-bold text-lg">
                  {r.retailer.user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900">
                    {r.retailer.shopName}
                  </p>
                  <p className="text-sm text-slate-500 truncate">
                    {r.retailer.user.name} · {r.retailer.city || "—"}
                  </p>
                </div>
                <div className="hidden md:block text-sm">
                  <p className="text-slate-500">Orders</p>
                  <p className="font-semibold">{r.orderCount}</p>
                </div>
                <div className="hidden md:block text-sm">
                  <p className="text-slate-500">Balance</p>
                  <p className="font-semibold">{formatCurrency(r.balance)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="h-9 w-9 rounded-md bg-brand-gradient text-white grid place-items-center"
                    aria-label="Profile"
                  >
                    <User className="h-4 w-4" />
                  </button>
                  <button
                    className="h-9 w-9 rounded-md bg-brand-gradient text-white grid place-items-center"
                    aria-label="Message"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
