"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function SignupForm({
  initialRole,
}: {
  initialRole: "RETAILER" | "DISTRIBUTOR";
}) {
  const router = useRouter();
  const [role, setRole] = useState<"RETAILER" | "DISTRIBUTOR">(initialRole);
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Lahore");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role,
        name,
        businessName: businessName || name,
        email,
        city,
        password,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Sign up failed");
      return;
    }
    router.push(role === "RETAILER" ? "/retailer" : "/distributor");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="label">I am registering as:</label>
        <div className="grid grid-cols-2 gap-2 max-w-md">
          <button
            type="button"
            onClick={() => setRole("RETAILER")}
            className={cn(
              "rounded-md border px-3 py-2 text-sm font-medium",
              role === "RETAILER"
                ? "border-brand-500 bg-brand-50 text-brand-600"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            )}
          >
            Retailer / Shopkeeper
          </button>
          <button
            type="button"
            onClick={() => setRole("DISTRIBUTOR")}
            className={cn(
              "rounded-md border px-3 py-2 text-sm font-medium",
              role === "DISTRIBUTOR"
                ? "border-brand-500 bg-brand-50 text-brand-600"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            )}
          >
            Distributor
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="label">Full Name</label>
          <input
            className="input"
            placeholder="Enter fullname"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label">Password:</label>
          <input
            type="password"
            className="input"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label">Confirm Password:</label>
          <input
            type="password"
            className="input"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="label">
            {role === "RETAILER" ? "Shop name (optional)" : "Business name"}
          </label>
          <input
            className="input"
            placeholder={role === "RETAILER" ? "Shop name" : "Business name"}
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>
        <div>
          <label className="label">City:</label>
          <select
            className="input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option>Lahore</option>
            <option>Karachi</option>
            <option>Islamabad</option>
            <option>Rawalpindi</option>
            <option>Faisalabad</option>
            <option>Multan</option>
            <option>Peshawar</option>
            <option>Quetta</option>
            <option>Mianwali</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          className="btn-primary h-11 px-8"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Request"}
        </button>
      </div>
    </form>
  );
}
