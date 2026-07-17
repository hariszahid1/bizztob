"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { Minus, Plus, Search, ShoppingCart, Trash2, X } from "lucide-react";

type Product = {
  id: string;
  name: string;
  category: string | null;
  unit: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  distributorId: string;
  distributorName: string;
};

export function CatalogView({
  products,
  distributors,
}: {
  products: Product[];
  distributors: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [distFilter, setDistFilter] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (distFilter && p.distributorId !== distFilter) return false;
      if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [products, q, distFilter]);

  const cartProducts = useMemo(() => {
    return Object.entries(cart)
      .map(([id, qty]) => {
        const p = products.find((x) => x.id === id);
        return p ? { ...p, qty } : null;
      })
      .filter((x): x is Product & { qty: number } => x !== null);
  }, [cart, products]);

  const distributorInCart = cartProducts[0]?.distributorId;
  const total = cartProducts.reduce((s, p) => s + p.qty * p.price, 0);

  function add(id: string) {
    setError(null);
    const p = products.find((x) => x.id === id)!;
    // enforce single distributor per order
    if (
      distributorInCart &&
      p.distributorId !== distributorInCart
    ) {
      setError(
        "Your cart already has items from another distributor. Clear cart to switch."
      );
      return;
    }
    setCart((c) => ({ ...c, [id]: Math.min((c[id] || 0) + 1, p.stock) }));
  }
  function remove(id: string) {
    setCart((c) => {
      const next = { ...c };
      const v = (next[id] || 0) - 1;
      if (v <= 0) delete next[id];
      else next[id] = v;
      return next;
    });
  }
  function clear() {
    setCart({});
    setError(null);
  }

  async function placeOrder() {
    if (cartProducts.length === 0) return;
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/retailer/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        distributorId: distributorInCart,
        notes,
        items: cartProducts.map((p) => ({ productId: p.id, quantity: p.qty })),
      }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error || "Could not place order");
      return;
    }
    setCart({});
    setNotes("");
    setCartOpen(false);
    router.push(`/retailer/orders/${data.orderId}`);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Catalog</h2>
          <p className="text-slate-600 text-sm mt-1">
            Browse products and place a new order.
          </p>
        </div>
        <button
          onClick={() => setCartOpen(true)}
          className="btn-primary relative"
        >
          <ShoppingCart className="h-4 w-4" /> Cart
          {cartProducts.length > 0 && (
            <span className="ml-1 rounded-full bg-white text-brand-700 text-xs font-semibold px-2 py-0.5">
              {cartProducts.reduce((s, p) => s + p.qty, 0)}
            </span>
          )}
        </button>
      </div>

      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products..."
            className="input pl-9"
          />
        </div>
        <select
          value={distFilter}
          onChange={(e) => setDistFilter(e.target.value)}
          className="input sm:max-w-xs"
        >
          <option value="">All distributors</option>
          {distributors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="card overflow-hidden flex flex-col">
              <div className="aspect-square bg-slate-100 overflow-hidden">
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full grid place-items-center text-slate-400 text-4xl">
                    {p.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="p-3 flex-1 flex flex-col">
                <p className="text-xs text-slate-500">{p.distributorName}</p>
                <p className="text-sm font-medium mt-1 line-clamp-2">
                  {p.name}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-semibold">
                    {formatCurrency(p.price)}
                  </span>
                  <span className="text-xs text-slate-500">per {p.unit}</span>
                </div>
                <div className="mt-2">
                  {cart[p.id] ? (
                    <div className="flex items-center justify-between rounded-lg border border-slate-200 p-1">
                      <button
                        onClick={() => remove(p.id)}
                        className="h-7 w-7 grid place-items-center rounded-md hover:bg-slate-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-medium">
                        {cart[p.id]}
                      </span>
                      <button
                        onClick={() => add(p.id)}
                        className="h-7 w-7 grid place-items-center rounded-md hover:bg-slate-100"
                        disabled={cart[p.id] >= p.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => add(p.id)}
                      className="btn-secondary w-full justify-center"
                      disabled={p.stock === 0}
                    >
                      {p.stock === 0 ? "Out of stock" : "Add to cart"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setCartOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[420px] bg-white flex flex-col shadow-xl">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                <h3 className="font-semibold">Your cart</h3>
              </div>
              <button
                className="p-2 rounded-lg hover:bg-slate-100"
                onClick={() => setCartOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cartProducts.length === 0 && (
                <p className="text-sm text-slate-500 text-center mt-10">
                  Your cart is empty.
                </p>
              )}
              {cartProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 border-b border-slate-100 pb-3"
                >
                  <div className="h-12 w-12 rounded-lg bg-slate-100 grid place-items-center text-slate-400">
                    {p.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-slate-500">
                      {formatCurrency(p.price)} × {p.qty}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => remove(p.id)}
                      className="h-7 w-7 grid place-items-center rounded-md hover:bg-slate-100"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-sm w-6 text-center">{p.qty}</span>
                    <button
                      onClick={() => add(p.id)}
                      className="h-7 w-7 grid place-items-center rounded-md hover:bg-slate-100"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {cartProducts.length > 0 && (
              <div className="p-4 border-t border-slate-200 space-y-3">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Delivery notes (optional)"
                  rows={2}
                  className="input"
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Total</span>
                  <span className="font-semibold text-lg">
                    {formatCurrency(total)}
                  </span>
                </div>
                {error && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={clear} className="btn-secondary">
                    <Trash2 className="h-4 w-4" /> Clear
                  </button>
                  <button
                    onClick={placeOrder}
                    disabled={submitting}
                    className="btn-primary"
                  >
                    {submitting ? "Placing..." : "Place order"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
