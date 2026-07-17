"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const nextStatusMap: Record<
  string,
  { label: string; next: string; tone: string }
> = {
  PENDING: {
    label: "Confirm order",
    next: "CONFIRMED",
    tone: "btn-primary",
  },
  CONFIRMED: {
    label: "Mark dispatched",
    next: "DISPATCHED",
    tone: "btn-primary",
  },
  DISPATCHED: {
    label: "Mark delivered",
    next: "DELIVERED",
    tone: "btn-primary",
  },
};

export function OrderActions({
  orderId,
  status,
  currentAddress,
}: {
  orderId: string;
  status: string;
  currentAddress: string;
}) {
  const router = useRouter();
  const [address, setAddress] = useState(currentAddress);
  const [driverName, setDriverName] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function advance() {
    const info = nextStatusMap[status];
    if (!info) return;
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/distributor/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: info.next,
        delivery:
          info.next === "CONFIRMED"
            ? {
                address,
                driverName,
                vehicleNo,
                scheduledFor: scheduledFor || null,
              }
            : undefined,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Could not update order");
      return;
    }
    router.refresh();
  }

  async function cancel() {
    if (!confirm("Cancel this order? Stock will be restored.")) return;
    setLoading(true);
    const res = await fetch(`/api/distributor/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED" }),
    });
    setLoading(false);
    if (!res.ok) {
      const d = await res.json();
      setError(d.error || "Could not cancel");
      return;
    }
    router.refresh();
  }

  if (status === "DELIVERED" || status === "CANCELLED") {
    return (
      <div className="card p-4 text-sm text-slate-600">
        This order is <b>{status}</b>. No further actions available.
      </div>
    );
  }

  const info = nextStatusMap[status];

  return (
    <div className="card p-5 space-y-4">
      <div className="flex flex-col lg:flex-row justify-between gap-3">
        <div>
          <h3 className="font-semibold">Next action</h3>
          <p className="text-sm text-slate-600 mt-1">
            {status === "PENDING" &&
              "Confirm this order and add delivery details."}
            {status === "CONFIRMED" && "Dispatch the order to the retailer."}
            {status === "DISPATCHED" && "Mark the order as delivered."}
          </p>
        </div>
        <div className="flex gap-2">
          {info && (
            <button
              onClick={advance}
              disabled={loading}
              className={info.tone}
            >
              {loading ? "Working..." : info.label}
            </button>
          )}
          <button onClick={cancel} disabled={loading} className="btn-danger">
            Cancel order
          </button>
        </div>
      </div>

      {status === "PENDING" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="label">Delivery address</label>
            <input
              className="input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Shop address"
            />
          </div>
          <div>
            <label className="label">Scheduled date</label>
            <input
              type="date"
              className="input"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Driver name</label>
            <input
              className="input"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Vehicle no.</label>
            <input
              className="input"
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value)}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </div>
      )}
    </div>
  );
}
