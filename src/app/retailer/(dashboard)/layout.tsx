import { DashboardShell, type NavItem } from "@/components/DashboardShell";
import { getFullUser } from "@/lib/auth";
import { Home, Truck, MessageSquare, Wallet, BarChart3 } from "lucide-react";

export default async function RetailerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getFullUser();
  if (!user) return null;

  const navItems: NavItem[] = [
    { href: "/retailer", label: "Dashboard", icon: <Home className="h-4 w-4" /> },
    { href: "/retailer/orders", label: "Orders", icon: <Truck className="h-4 w-4" /> },
    { href: "/retailer/messages", label: "Messages", icon: <MessageSquare className="h-4 w-4" /> },
    { href: "/retailer/payment", label: "Payment", icon: <Wallet className="h-4 w-4" /> },
    { href: "/retailer/ledger", label: "Ledger", icon: <BarChart3 className="h-4 w-4" /> },
  ];

  return (
    <DashboardShell
      user={{ name: user.name, email: user.email, role: "Retailer" }}
      navItems={navItems}
      roleLabel="Retailer"
    >
      {children}
    </DashboardShell>
  );
}
