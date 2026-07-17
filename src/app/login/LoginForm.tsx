"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm({ nextUrl }: { nextUrl?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }
    const target =
      nextUrl ||
      (data.role === "ADMIN"
        ? "/admin"
        : data.role === "DISTRIBUTOR"
          ? "/distributor"
          : "/retailer");
    router.push(target);
    router.refresh();
  }

  function useDemo(role: "admin" | "distributor" | "retailer") {
    if (role === "admin") {
      setEmail("admin@bizztob.com");
      setPassword("admin123");
    } else if (role === "distributor") {
      setEmail("distributor@bizztob.com");
      setPassword("dist123");
    } else {
      setEmail("retailer@bizztob.com");
      setPassword("retail123");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="label">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="label">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input"
          placeholder="••••••••"
        />
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
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <div className="grid grid-cols-3 gap-2 pt-2">
        <button
          type="button"
          onClick={() => useDemo("admin")}
          className="btn-secondary text-xs"
        >
          Admin
        </button>
        <button
          type="button"
          onClick={() => useDemo("distributor")}
          className="btn-secondary text-xs"
        >
          Distributor
        </button>
        <button
          type="button"
          onClick={() => useDemo("retailer")}
          className="btn-secondary text-xs"
        >
          Retailer
        </button>
      </div>
    </form>
  );
}
