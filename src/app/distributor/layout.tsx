import { redirect } from "next/navigation";
import { DashboardShell, type NavItem } from "@/components/DashboardShell";
import { getFullUser } from "@/lib/auth";
import {
  Home,
  Package,
  ClipboardList,
  Truck,
  Wallet,
  Users,
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
    {
      href: "/distributor",
      label: "Dashboard",
      icon: <Home className="h-4 w-4" />,
    },
    {
      href: "/distributor/orders",
      label: "Orders",
      icon: <ClipboardList className="h-4 w-4" />,
    },
    {
      href: "/distributor/products",
      label: "Products",
      icon: <Package className="h-4 w-4" />,
    },
    {
      href: "/distributor/deliveries",
      label: "Deliveries",
      icon: <Truck className="h-4 w-4" />,
    },
    {
      href: "/distributor/ledger",
      label: "Ledgers",
      icon: <Wallet className="h-4 w-4" />,
    },
    {
      href: "/distributor/retailers",
      label: "Retailers",
      icon: <Users className="h-4 w-4" />,
    },
  ];

  return (
    <DashboardShell
      user={{ name: user.name, email: user.email, role: "Distributor" }}
      navItems={navItems}
      brandLabel="Distributor Console"
    >
      {children}
    </DashboardShell>
  );
}
