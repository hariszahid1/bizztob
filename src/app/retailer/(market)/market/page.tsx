import { prisma } from "@/lib/db";
import { MarketView } from "./MarketView";

export default async function MarketPage() {
  const distributors = await prisma.distributor.findMany({
    include: {
      products: {
        where: { isActive: true },
        orderBy: { name: "asc" },
      },
    },
    orderBy: { businessName: "asc" },
  });

  const products = distributors.flatMap((d) =>
    d.products.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      unit: p.unit,
      price: p.price,
      stock: p.stock,
      imageUrl: p.imageUrl,
      distributorId: d.id,
      distributorName: d.businessName,
    }))
  );

  return <MarketView products={products} />;
}
