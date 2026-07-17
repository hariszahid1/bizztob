"use client";
import { useEffect, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  unit: string;
  stock: number;
  imageUrl: string | null;
  distributorId: string;
  distributorName: string;
  qty: number;
};

const KEY = "bizztob_cart_v1";

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new StorageEvent("storage", { key: KEY }));
}

export function addToCart(
  p: Omit<CartItem, "qty">,
  qty = 1
): { ok: boolean; error?: string } {
  const items = read();
  const first = items[0];
  if (first && first.distributorId !== p.distributorId) {
    return {
      ok: false,
      error:
        "Your cart has items from another distributor. Clear cart to switch.",
    };
  }
  const existing = items.find((x) => x.id === p.id);
  if (existing) {
    existing.qty = Math.min(existing.qty + qty, p.stock);
  } else {
    items.push({ ...p, qty: Math.min(qty, p.stock) });
  }
  write(items);
  return { ok: true };
}

export function updateQty(id: string, qty: number) {
  const items = read();
  const it = items.find((x) => x.id === id);
  if (!it) return;
  if (qty <= 0) {
    write(items.filter((x) => x.id !== id));
  } else {
    it.qty = Math.min(qty, it.stock);
    write(items);
  }
}

export function removeFromCart(id: string) {
  write(read().filter((x) => x.id !== id));
}

export function clearCart() {
  write([]);
}

export function getCart() {
  return read();
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = () => setCart(read());

  useEffect(() => {
    refresh();
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const bump = () => refresh();

  return { cart, ready, bump };
}
