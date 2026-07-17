import { redirect } from "next/navigation";
import { DashboardShell, type NavItem } from "@/components/DashboardShell";
import { getFullUser } from "@/lib/auth";
import {
  Home,
  Truck,
  Users,
  UserCircle2,
  Package,
  Boxes,
  Wallet,
  BarChart3,
  Settings,
} from "lucide-react";

export default async function DistributorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getFullUser();
  if (!user) redirect("/login");
  if (user.role !== "DISTRIBUTOR") redirect("/");

  const navItems: NavItem[] = [
    { href: "/distributor", label: "Dashboard", icon: <Home className="h-4 w-4" /> },
    { href: "/distributor/orders", label: "Orders", icon: <Truck className="h-4 w-4" /> },
    { href: "/distributor/connections", label: "Connections", icon: <Users className="h-4 w-4" /> },
    { href: "/distributor/team", label: "Team", icon: <UserCircle2 className="h-4 w-4" /> },
    { href: "/distributor/products", label: "Products", icon: <Package className="h-4 w-4" /> },
    { href: "/distributor/inventory", label: "Inventory", icon: <Boxes className="h-4 w-4" /> },
    { href: "/distributor/payment", label: "Payment", icon: <Wallet className="h-4 w-4" /> },
    { href: "/distributor/ledger", label: "Ledger", icon: <BarChart3 className="h-4 w-4" /> },
    { href: "/distributor/settings", label: "Setting", icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <DashboardShell
      user={{ name: user.name, email: user.email, role: "Distributor" }}
      navItems={navItems}
      roleLabel="Distributor"
    >
      {children}
    </DashboardShell>
  );
}
