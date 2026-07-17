"use client";
import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { addToCart, useCart } from "@/lib/cart";

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

export function MarketView({ products }: { products: Product[] }) {
  const router = useRouter();
  const { cart, bump } = useCart();

  const grouped = useMemo(() => {
    const g: Record<string, Product[]> = {};
    for (const p of products) {
      (g[p.distributorName] ||= []).push(p);
    }
    return g;
  }, [products]);

  function order(p: Product) {
    addToCart(p);
    bump();
    router.push("/retailer/cart");
  }

  function addOnly(p: Product) {
    addToCart(p);
    bump();
  }

  return (
    <main className="max-w-[1440px] mx-auto px-4 lg:px-10 py-6 lg:py-10">
      {Object.keys(grouped).length === 0 && (
        <div className="card p-10 text-center text-slate-500">
          No products available yet.
        </div>
      )}
      {Object.entries(grouped).map(([dist, items]) => (
        <section key={dist} className="mb-10">
          <h2 className="text-lg font-bold text-slate-900 mb-4">{dist}</h2>
          <div className="card p-4 lg:p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {items.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl bg-white ring-1 ring-slate-100 shadow-card overflow-hidden flex flex-col"
                >
                  <div className="aspect-[4/3] bg-orange-100 overflow-hidden">
                    {p.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full grid place-items-center text-orange-400 text-4xl font-bold">
                        {p.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex-1 flex flex-col">
                    <h3 className="text-brand-600 font-bold text-base line-clamp-1">
                      {p.name}
                    </h3>
                    <p className="text-green-600 text-sm mt-1">
                      {formatCurrency(p.price)}
                    </p>
                    <p className="text-red-500 text-xs mt-0.5">
                      {p.distributorName}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => order(p)}
                        disabled={p.stock === 0}
                        className="flex-1 btn-primary h-9 rounded-md px-3 text-xs disabled:opacity-40"
                      >
                        {p.stock === 0 ? "Out of stock" : "Order"}
                      </button>
                      <button
                        onClick={() => addOnly(p)}
                        disabled={p.stock === 0}
                        className="h-9 w-9 rounded-md bg-brand-gradient text-white grid place-items-center disabled:opacity-40"
                        aria-label="Add to cart"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6">
          <Link
            href="/retailer/cart"
            className="btn-primary shadow-pill h-12 px-6"
          >
            <ShoppingCart className="h-4 w-4" />
            View cart ({cart.reduce((s, i) => s + i.qty, 0)})
          </Link>
        </div>
      )}
    </main>
  );
}
