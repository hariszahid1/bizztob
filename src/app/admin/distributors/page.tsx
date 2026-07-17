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
      <h2 className="text-xl font-bold text-slate-900">Distributors</h2>

      <div className="card">
        {distributors.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No distributors yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="fg-table">
              <thead>
                <tr>
                  <th>Business</th>
                  <th>Owner</th>
                  <th>Email</th>
                  <th>City</th>
                  <th>Products</th>
                  <th>Orders</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {distributors.map((d) => (
                  <tr key={d.id}>
                    <td className="font-medium text-slate-900">
                      {d.businessName}
                    </td>
                    <td>{d.user.name}</td>
                    <td>{d.user.email}</td>
                    <td>{d.city || "-"}</td>
                    <td>{d._count.products}</td>
                    <td>{d._count.orders}</td>
                    <td>{formatDate(d.createdAt)}</td>
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
