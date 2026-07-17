"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

export function DashboardShell({
  navItems,
  user,
  children,
  brandLabel,
}: {
  navItems: NavItem[];
  user: { name: string; email: string; role: string };
  children: React.ReactNode;
  brandLabel: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex lg:w-64 flex-col border-r border-slate-200 bg-white">
        <div className="h-16 flex items-center px-5 border-b border-slate-200">
          <Logo />
        </div>
        <div className="px-3 py-3 text-xs uppercase tracking-wider text-slate-400">
          {brandLabel}
        </div>
        <nav className="flex-1 px-2 space-y-1">
          {navItems.map((n) => {
            const active =
              pathname === n.href ||
              (n.href !== "/" && pathname.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                  active
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-700 hover:bg-slate-100"
                )}
              >
                <span className="text-slate-500">{n.icon}</span>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-slate-200">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="h-9 w-9 rounded-full bg-slate-200 grid place-items-center text-slate-700 font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="mt-1 w-full btn-secondary justify-center"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl flex flex-col">
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
              <Logo />
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-3 py-3 text-xs uppercase tracking-wider text-slate-400">
              {brandLabel}
            </div>
            <nav className="flex-1 px-2 space-y-1">
              {navItems.map((n) => {
                const active =
                  pathname === n.href ||
                  (n.href !== "/" && pathname.startsWith(n.href));
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                      active
                        ? "bg-brand-50 text-brand-700"
                        : "text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    <span className="text-slate-500">{n.icon}</span>
                    {n.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-3 border-t border-slate-200">
              <button
                onClick={logout}
                className="w-full btn-secondary justify-center"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 flex items-center justify-between px-4 lg:px-8 border-b border-slate-200 bg-white sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="lg:hidden">
              <Logo compact />
            </div>
            <h1 className="hidden lg:block text-sm font-medium text-slate-600">
              {brandLabel}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <div className="h-8 w-8 rounded-full bg-slate-200 grid place-items-center text-slate-700 font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="leading-tight">
                <p className="font-medium text-slate-800">{user.name}</p>
                <p className="text-xs text-slate-500">{user.role}</p>
              </div>
            </div>
          </div>
        </header>
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
