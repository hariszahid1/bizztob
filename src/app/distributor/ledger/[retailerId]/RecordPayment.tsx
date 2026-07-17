"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function RecordPayment({ retailerId }: { retailerId: string }) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/distributor/ledger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        retailerId,
        amount: parseFloat(amount),
        note: note || null,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Could not record payment");
      return;
    }
    setAmount("");
    setNote("");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card p-5 space-y-3">
      <h3 className="font-semibold">Record a payment</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="label">Amount received</label>
          <input
            type="number"
            step="0.01"
            className="input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Note (optional)</label>
          <input
            className="input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Cash, bank transfer, etc."
          />
        </div>
      </div>
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </div>
      )}
      <div className="flex justify-end">
        <button className="btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Record payment"}
        </button>
      </div>
    </form>
  );
}
