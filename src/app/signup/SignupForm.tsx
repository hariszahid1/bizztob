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
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role,
        name,
        businessName,
        email,
        phone,
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
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="label">I am a</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRole("RETAILER")}
            className={cn(
              "rounded-lg border px-3 py-2 text-sm font-medium",
              role === "RETAILER"
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            )}
          >
            Retailer / Shopkeeper
          </button>
          <button
            type="button"
            onClick={() => setRole("DISTRIBUTOR")}
            className={cn(
              "rounded-lg border px-3 py-2 text-sm font-medium",
              role === "DISTRIBUTOR"
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            )}
          >
            Distributor
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Your name</label>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label">
            {role === "RETAILER" ? "Shop name" : "Business name"}
          </label>
          <input
            className="input"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label">Phone (optional)</label>
          <input
            className="input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">City</label>
          <input
            className="input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Password</label>
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="btn-primary w-full justify-center"
        disabled={loading}
      >
        {loading ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
