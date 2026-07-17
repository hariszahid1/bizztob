"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import {
  Bell,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  User,
  X,
} from "lucide-react";
import { cn, formatDateTime } from "@/lib/utils";

export type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

export function DashboardShell({
  navItems,
  user,
  children,
  roleLabel,
}: {
  navItems: NavItem[];
  user: { name: string; email: string; role: string };
  children: React.ReactNode;
  roleLabel: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState<string>("");

  useEffect(() => {
    setNow(formatDateTime(new Date()));
    const t = setInterval(() => setNow(formatDateTime(new Date())), 60000);
    return () => clearInterval(t);
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const bottomItems: NavItem[] = [
    { href: "#profile", label: "Profile", icon: <User className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen flex bg-canvas">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex lg:w-[247px] flex-col bg-white">
        <div className="h-20 flex items-center px-6">
          <Logo />
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((n) => {
            const active =
              pathname === n.href ||
              (n.href !== "/" && pathname.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                data-active={active}
                className="nav-item"
              >
                {n.icon}
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="mx-6 my-4 h-px bg-slate-100" />

        <nav className="px-3 space-y-1 pb-6">
          {bottomItems.map((n) => (
            <div key={n.href} className="nav-item cursor-pointer">
              {n.icon}
              {n.label}
            </div>
          ))}
          <button onClick={logout} className="nav-item w-full text-left">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl flex flex-col">
            <div className="h-16 flex items-center justify-between px-4">
              <Logo />
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 space-y-1">
              {navItems.map((n) => {
                const active =
                  pathname === n.href ||
                  (n.href !== "/" && pathname.startsWith(n.href));
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    data-active={active}
                    onClick={() => setOpen(false)}
                    className="nav-item"
                  >
                    {n.icon}
                    {n.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-3">
              <button
                onClick={logout}
                className="btn-secondary w-full justify-center"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 min-w-0 flex flex-col">
        <header className="h-20 flex items-center justify-between px-4 lg:px-8 bg-canvas">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="lg:hidden">
              <Logo />
            </div>
            <div className="hidden lg:block leading-tight">
              <h1 className="text-lg font-bold text-slate-900">
                Welcome, {user.name.split(" ")[0]}
                <sup className="ml-1 text-xs text-slate-500 font-medium italic">
                  {roleLabel}
                </sup>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">{now}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="icon-btn" aria-label="Messages">
              <MessageSquare className="h-4 w-4" />
            </button>
            <button className="icon-btn" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <div className="hidden md:block h-8 w-px bg-slate-200" />
            <div className="hidden md:block search-box w-72">
              <Search className="h-4 w-4 search-ico" />
              <input placeholder="Search" />
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
}
