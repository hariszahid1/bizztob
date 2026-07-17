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
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Retailers</h2>
        <p className="text-slate-600 text-sm mt-1">
          All retailer accounts on the platform.
        </p>
      </div>
      <div className="card overflow-hidden">
        {retailers.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No retailers yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-500 bg-slate-50">
                <tr>
                  <th className="px-5 py-3">Shop</th>
                  <th className="px-5 py-3">Owner</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">City</th>
                  <th className="px-5 py-3">Orders</th>
                  <th className="px-5 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {retailers.map((r) => (
                  <tr key={r.id}>
                    <td className="px-5 py-3 font-medium">{r.shopName}</td>
                    <td className="px-5 py-3">{r.user.name}</td>
                    <td className="px-5 py-3">{r.user.email}</td>
                    <td className="px-5 py-3">{r.city || "-"}</td>
                    <td className="px-5 py-3">{r._count.orders}</td>
                    <td className="px-5 py-3">{formatDate(r.createdAt)}</td>
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
