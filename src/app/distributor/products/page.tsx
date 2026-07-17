import { getFullUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ProductsView } from "./ProductsView";

export default async function DistributorProducts() {
  const user = await getFullUser();
  const dist = user?.distributor;
  if (!dist) return null;

  const products = await prisma.product.findMany({
    where: { distributorId: dist.id },
    orderBy: { createdAt: "desc" },
  });

  return <ProductsView products={products} />;
}
