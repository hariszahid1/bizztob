"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { Pencil, Plus, Trash2, X } from "lucide-react";

type Product = {
  id: string;
  name: string;
  sku: string | null;
  category: string | null;
  price: number;
  unit: string;
  stock: number;
  imageUrl: string | null;
  isActive: boolean;
};

export function ProductsView({ products }: { products: Product[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  function newProduct() {
    setEditing(null);
    setOpen(true);
  }

  function editProduct(p: Product) {
    setEditing(p);
    setOpen(true);
  }

  async function del(id: string) {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/distributor/products/${id}`, {
      method: "DELETE",
    });
    if (res.ok) router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Products</h2>
          <p className="text-slate-600 text-sm mt-1">
            Manage your catalog, prices, and stock.
          </p>
        </div>
        <button onClick={newProduct} className="btn-primary">
          <Plus className="h-4 w-4" /> Add product
        </button>
      </div>

      <div className="card overflow-hidden">
        {products.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No products yet.{" "}
            <button
              onClick={newProduct}
              className="text-brand-700 font-medium hover:underline"
            >
              Add your first product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-500 bg-slate-50">
                <tr>
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Stock</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-slate-100 grid place-items-center text-slate-400 overflow-hidden">
                          {p.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />
                          ) : (
                            p.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{p.name}</p>
                          {p.sku && (
                            <p className="text-xs text-slate-500">
                              SKU: {p.sku}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">{p.category || "-"}</td>
                    <td className="px-5 py-3">
                      {formatCurrency(p.price)}{" "}
                      <span className="text-xs text-slate-500">/ {p.unit}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={
                          p.stock === 0
                            ? "badge-red"
                            : p.stock < 10
                              ? "badge-amber"
                              : "badge-green"
                        }
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={p.isActive ? "badge-green" : "badge-slate"}
                      >
                        {p.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => editProduct(p)}
                          className="p-2 rounded-lg hover:bg-slate-100"
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => del(p.id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {open && (
        <ProductModal
          product={editing}
          onClose={() => setOpen(false)}
          onSaved={() => {
            setOpen(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function ProductModal({
  product,
  onClose,
  onSaved,
}: {
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(product?.name || "");
  const [sku, setSku] = useState(product?.sku || "");
  const [category, setCategory] = useState(product?.category || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [unit, setUnit] = useState(product?.unit || "pcs");
  const [stock, setStock] = useState(product?.stock?.toString() || "0");
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || "");
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const body = {
      name,
      sku: sku || null,
      category: category || null,
      price: parseFloat(price),
      unit,
      stock: parseInt(stock, 10),
      imageUrl: imageUrl || null,
      isActive,
    };
    const url = product
      ? `/api/distributor/products/${product.id}`
      : "/api/distributor/products";
    const method = product ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Save failed");
      return;
    }
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <form
          onSubmit={save}
          className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold">
              {product ? "Edit product" : "Add product"}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="label">Name</label>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">SKU</label>
                <input
                  className="input"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                />
              </div>
              <div>
                <label className="label">Category</label>
                <input
                  className="input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="label">Price</label>
                <input
                  type="number"
                  step="0.01"
                  className="input"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label">Unit</label>
                <input
                  className="input"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                />
              </div>
              <div>
                <label className="label">Stock</label>
                <input
                  type="number"
                  className="input"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="label">Image URL (optional)</label>
              <input
                className="input"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="active"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              <label htmlFor="active" className="text-sm text-slate-700">
                Active (visible in retailer catalog)
              </label>
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
          </div>
          <div className="p-5 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
