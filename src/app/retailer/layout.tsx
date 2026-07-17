import { redirect } from "next/navigation";
import { DashboardShell, type NavItem } from "@/components/DashboardShell";
import { getFullUser } from "@/lib/auth";
import { Home, ShoppingBag, Package, Wallet, Bot } from "lucide-react";

export default async function RetailerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getFullUser();
  if (!user) redirect("/login");
  if (user.role !== "RETAILER") redirect("/");

  const navItems: NavItem[] = [
    { href: "/retailer", label: "Overview", icon: <Home className="h-4 w-4" /> },
    {
      href: "/retailer/catalog",
      label: "Catalog",
      icon: <ShoppingBag className="h-4 w-4" />,
    },
    {
      href: "/retailer/orders",
      label: "My Orders",
      icon: <Package className="h-4 w-4" />,
    },
    {
      href: "/retailer/ledger",
      label: "Ledger",
      icon: <Wallet className="h-4 w-4" />,
    },
    {
      href: "/retailer/assistant",
      label: "AI Assistant",
      icon: <Bot className="h-4 w-4" />,
    },
  ];

  return (
    <DashboardShell
      user={{ name: user.name, email: user.email, role: "Retailer" }}
      navItems={navItems}
      brandLabel="Retailer"
    >
      {children}
    </DashboardShell>
  );
}
