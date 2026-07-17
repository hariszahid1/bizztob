import { getFullUser } from "@/lib/auth";
import { CartView } from "./CartView";

export default async function CartPage() {
  const user = await getFullUser();
  const address = user?.retailer?.address || "";
  return <CartView defaultAddress={address} />;
}
