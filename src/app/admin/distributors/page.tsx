import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function AdminDistributors() {
  const distributors = await prisma.distributor.findMany({
    include: {
      user: true,
      _count: { select: { products: true, orders: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Distributors</h2>
        <p className="text-slate-600 text-sm mt-1">
          All distributor accounts on the platform.
        </p>
      </div>
      <div className="card overflow-hidden">
        {distributors.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No distributors yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-500 bg-slate-50">
                <tr>
                  <th className="px-5 py-3">Business</th>
                  <th className="px-5 py-3">Owner</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">City</th>
                  <th className="px-5 py-3">Products</th>
                  <th className="px-5 py-3">Orders</th>
                  <th className="px-5 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {distributors.map((d) => (
                  <tr key={d.id}>
                    <td className="px-5 py-3 font-medium">{d.businessName}</td>
                    <td className="px-5 py-3">{d.user.name}</td>
                    <td className="px-5 py-3">{d.user.email}</td>
                    <td className="px-5 py-3">{d.city || "-"}</td>
                    <td className="px-5 py-3">{d._count.products}</td>
                    <td className="px-5 py-3">{d._count.orders}</td>
                    <td className="px-5 py-3">{formatDate(d.createdAt)}</td>
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
