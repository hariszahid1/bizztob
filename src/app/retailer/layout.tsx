import { redirect } from "next/navigation";
import { getFullUser } from "@/lib/auth";

export default async function RetailerRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getFullUser();
  if (!user) redirect("/login");
  if (user.role !== "RETAILER") redirect("/");
  return <>{children}</>;
}
