import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function AdminRetailers() {
  const retailers = await prisma.retailer.findMany({
    include: {
      user: true,
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900">Retailers</h2>
      <div className="card">
        {retailers.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No retailers yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="fg-table">
              <thead>
                <tr>
                  <th>Shop</th>
                  <th>Owner</th>
                  <th>Email</th>
                  <th>City</th>
                  <th>Orders</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {retailers.map((r) => (
                  <tr key={r.id}>
                    <td className="font-medium text-slate-900">
                      {r.shopName}
                    </td>
                    <td>{r.user.name}</td>
                    <td>{r.user.email}</td>
                    <td>{r.city || "-"}</td>
                    <td>{r._count.orders}</td>
                    <td>{formatDate(r.createdAt)}</td>
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
