import { prisma } from "@/lib/db";
import { CatalogView } from "./CatalogView";

export default async function CatalogPage() {
  const distributors = await prisma.distributor.findMany({
    include: {
      products: {
        where: { isActive: true },
        orderBy: { name: "asc" },
      },
    },
    orderBy: { businessName: "asc" },
  });

  const flat = distributors.flatMap((d) =>
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

  return <CatalogView products={flat} distributors={distributors.map((d) => ({ id: d.id, name: d.businessName }))} />;
}
