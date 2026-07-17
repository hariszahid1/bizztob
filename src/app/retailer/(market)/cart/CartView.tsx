"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { clearCart, removeFromCart, updateQty, useCart } from "@/lib/cart";
import { formatCurrency, formatDate } from "@/lib/utils";

export function CartView({ defaultAddress }: { defaultAddress: string }) {
  const router = useRouter();
  const { cart, ready, bump } = useCart();
  const [address, setAddress] = useState(defaultAddress);
  const [request, setRequest] = useState("0");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalAmount = cart.reduce((s, i) => s + i.qty * i.price, 0);
  const requestPending = Math.max(0, Number(request) || 0);
  const payable = Math.max(0, totalAmount - requestPending);

  async function placeOrder() {
    if (cart.length === 0) return;
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/retailer/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        distributorId: cart[0].distributorId,
        notes: address ? `Deliver to: ${address}` : null,
        items: cart.map((i) => ({ productId: i.id, quantity: i.qty })),
      }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error || "Could not place order");
      return;
    }
    clearCart();
    bump();
    router.push(`/retailer/orders/${data.orderId}`);
  }

  if (!ready) {
    return (
      <main className="max-w-[1440px] mx-auto px-4 lg:px-10 py-6 lg:py-10">
        <div className="card p-10 text-center text-slate-500">Loading...</div>
      </main>
    );
  }

  return (
    <main className="max-w-[1440px] mx-auto px-4 lg:px-10 py-6 lg:py-10">
      <div className="card p-6 lg:p-8">
        <h1 className="text-xl font-bold text-slate-900 mb-6">My Cart</h1>

        {cart.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            Your cart is empty.{" "}
            <Link
              href="/retailer/market"
              className="text-brand-600 font-medium hover:underline"
            >
              Browse market
            </Link>
          </div>
        ) : (
          <>
            <p className="font-semibold text-slate-900 mb-2">Items</p>
            <div className="overflow-x-auto">
              <table className="fg-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Picture</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Items</th>
                    <th className="text-right">...</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((it, i) => (
                    <tr key={it.id}>
                      <td className="text-slate-900">{i + 1}.</td>
                      <td>
                        <div className="h-10 w-10 rounded-md bg-orange-100 grid place-items-center text-orange-500 text-lg font-bold overflow-hidden">
                          {it.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={it.imageUrl}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            it.name.charAt(0)
                          )}
                        </div>
                      </td>
                      <td>{it.name}</td>
                      <td>{formatCurrency(it.price)}</td>
                      <td>{formatCurrency(it.qty * it.price)}</td>
                      <td>
                        <input
                          type="number"
                          min={1}
                          max={it.stock}
                          value={it.qty}
                          onChange={(e) => {
                            updateQty(it.id, parseInt(e.target.value, 10) || 0);
                            bump();
                          }}
                          className="w-24 rounded-md border border-slate-300 px-2 py-1 text-sm text-center"
                        />
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => {
                            removeFromCart(it.id);
                            bump();
                          }}
                          className="text-red-600 font-semibold hover:underline"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 grid gap-4 max-w-3xl">
              <Row label="Date:" right={formatDate(new Date())} />
              <Row
                label="Delivery Address:"
                right={
                  <input
                    className="input max-w-sm"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Delivery address"
                  />
                }
              />
              <Row label="Items:" right={<span>{totalItems}</span>} />
              <Row
                label="Total:"
                right={
                  <span className="font-semibold">
                    {formatCurrency(totalAmount)}
                  </span>
                }
              />
              <Row
                label="Request Pending:"
                right={
                  <div className="flex items-center gap-3 max-w-sm">
                    <input
                      className="input"
                      value={request}
                      onChange={(e) => setRequest(e.target.value)}
                      placeholder="0"
                    />
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      Limit: {formatCurrency(totalAmount)}
                    </span>
                  </div>
                }
              />
              <Row
                label="Payable:"
                right={
                  <span className="font-bold">{formatCurrency(payable)}</span>
                }
              />
            </div>

            {error && (
              <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 max-w-xl">
                {error}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => {
                  clearCart();
                  bump();
                }}
                className="btn-secondary"
              >
                Clear
              </button>
              <button
                onClick={placeOrder}
                disabled={submitting}
                className="btn-success h-11 px-6"
              >
                {submitting ? "Placing..." : "Request Order"}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function Row({
  label,
  right,
}: {
  label: string;
  right: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-2 items-center gap-4">
      <div className="text-brand-600 font-semibold">{label}</div>
      <div className="text-slate-800 text-right sm:text-left">{right}</div>
    </div>
  );
}
