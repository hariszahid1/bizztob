"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, MessageSquare, Search, ShoppingCart } from "lucide-react";
import { Logo } from "./Logo";

export function MarketTopNav({
  cartCount = 0,
  showAuthLinks = false,
}: {
  cartCount?: number;
  showAuthLinks?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: "/", label: "Home" },
    { href: "/retailer/market", label: "Market" },
    { href: "/retailer", label: "Dashboard" },
    { href: "/#about", label: "About Us" },
    { href: "/retailer/cart", label: "My Cart" },
  ];

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 bg-white">
      <div className="max-w-[1440px] mx-auto h-20 px-4 lg:px-10 flex items-center gap-6">
        <Logo />
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => {
            const active =
              pathname === l.href ||
              (l.href !== "/" && pathname.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={
                  active
                    ? "text-brand-600 font-bold bg-clip-text text-transparent bg-brand-gradient"
                    : "text-brand-600 font-semibold hover:opacity-80"
                }
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <button className="icon-btn" aria-label="Messages">
            <MessageSquare className="h-4 w-4" />
          </button>
          <button className="icon-btn" aria-label="Notifications">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>
          <div className="h-8 w-px bg-slate-200" />
          <div className="hidden md:block search-box w-64">
            <Search className="h-4 w-4 search-ico" />
            <input placeholder="Search" />
          </div>
          <Link
            href="/retailer/cart"
            className="relative text-brand-600 hover:opacity-80"
            aria-label="Cart"
          >
            <ShoppingCart className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 h-4 min-w-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold grid place-items-center">
                {cartCount}
              </span>
            )}
          </Link>
          {showAuthLinks && (
            <>
              <Link href="/login" className="btn-outline-brand">
                Sign in
              </Link>
              <Link href="/signup" className="btn-primary">
                Sign up
              </Link>
            </>
          )}
          {!showAuthLinks && (
            <button onClick={logout} className="icon-btn" aria-label="Logout">
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
