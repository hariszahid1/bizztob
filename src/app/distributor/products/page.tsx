import Link from "next/link";
import { getFullUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { Search } from "lucide-react";

export default async function DistributorProducts() {
  const user = await getFullUser();
  const dist = user?.distributor;
  if (!dist) return null;

  const products = await prisma.product.findMany({
    where: { distributorId: dist.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="search-box flex-1 max-w-md">
          <Search className="h-4 w-4 search-ico" />
          <input placeholder="Search" />
        </div>
        <Link href="/distributor/products/new" className="btn-primary">
          Add Product
        </Link>
      </div>

      <div className="card">
        <div className="p-5 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Products</h3>
          <button className="filter-pill">Filter</button>
        </div>
        {products.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No products yet.{" "}
            <Link
              href="/distributor/products/new"
              className="text-brand-600 font-medium hover:underline"
            >
              Add your first product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="fg-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Price</th>
                  <th className="text-right">...</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => {
                  const stockStatus =
                    p.stock === 0
                      ? { cls: "status-red", label: "Out" }
                      : p.stock < 20
                        ? { cls: "status-amber", label: "Short" }
                        : { cls: "status-green", label: "Instock" };
                  return (
                    <tr key={p.id}>
                      <td>{i + 1}.</td>
                      <td className="font-medium text-slate-900">{p.name}</td>
                      <td>{p.category || "-"}</td>
                      <td>{p.stock}</td>
                      <td>
                        <span className={stockStatus.cls}>
                          {stockStatus.label}
                        </span>
                      </td>
                      <td>{formatCurrency(p.price)}</td>
                      <td className="text-right">
                        <Link
                          href={`/distributor/products/${p.id}/edit`}
                          className="row-action"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
