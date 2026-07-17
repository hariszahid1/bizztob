import { getFullUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { MoreVertical, Search } from "lucide-react";

export default async function InventoryPage() {
  const user = await getFullUser();
  const dist = user?.distributor;
  if (!dist) return null;

  const products = await prisma.product.findMany({
    where: { distributorId: dist.id },
    orderBy: { name: "asc" },
  });
  const companies = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  );

  return (
    <div className="space-y-6">
      <div className="search-box max-w-md ml-auto">
        <Search className="h-4 w-4 search-ico" />
        <input placeholder="Search" />
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Categories</h3>
          <button className="filter-pill">Filter</button>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {companies.length === 0 && (
            <p className="text-sm text-slate-500">
              No categories yet. Add products to see them here.
            </p>
          )}
          {companies.map((c, i) => (
            <div
              key={c}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ${
                i === 0
                  ? "bg-slate-100 text-slate-700"
                  : "bg-brand-gradient text-white"
              }`}
            >
              {c}
              <MoreVertical className="h-3.5 w-3.5" />
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="p-5 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Products</h3>
          <button className="filter-pill">Filter</button>
        </div>
        <div className="overflow-x-auto">
          <table className="fg-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Category</th>
                <th>Company</th>
                <th>Stock</th>
                <th>Price (Pkr)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const cls =
                  p.stock === 0
                    ? "status-red"
                    : p.stock < 20
                      ? "status-amber"
                      : "status-green";
                const lbl =
                  p.stock === 0
                    ? "Out"
                    : p.stock < 20
                      ? "Short"
                      : "Instock";
                return (
                  <tr key={p.id}>
                    <td>{p.sku || p.id.slice(-4).toUpperCase()}</td>
                    <td>{p.category || "-"}</td>
                    <td>Pepsi Co.</td>
                    <td>{p.stock}</td>
                    <td>{formatCurrency(p.price)}</td>
                    <td>
                      <span className={cls}>{lbl}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-sm">
              No inventory items yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
