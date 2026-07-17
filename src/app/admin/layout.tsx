import { redirect } from "next/navigation";
import { DashboardShell, type NavItem } from "@/components/DashboardShell";
import { getFullUser } from "@/lib/auth";
import { Home, Store, Truck } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getFullUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/");

  const navItems: NavItem[] = [
    { href: "/admin", label: "Dashboard", icon: <Home className="h-4 w-4" /> },
    {
      href: "/admin/distributors",
      label: "Distributors",
      icon: <Truck className="h-4 w-4" />,
    },
    {
      href: "/admin/retailers",
      label: "Retailers",
      icon: <Store className="h-4 w-4" />,
    },
  ];

  return (
    <DashboardShell
      user={{ name: user.name, email: user.email, role: "Admin" }}
      navItems={navItems}
      roleLabel="Admin"
    >
      {children}
    </DashboardShell>
  );
}
