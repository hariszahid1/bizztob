import { notFound } from "next/navigation";
import { getFullUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ProductForm } from "../../ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getFullUser();
  const dist = user?.distributor;
  if (!dist) return null;
  const p = await prisma.product.findFirst({
    where: { id: params.id, distributorId: dist.id },
  });
  if (!p) notFound();
  return (
    <ProductForm
      mode="edit"
      product={{
        id: p.id,
        name: p.name,
        sku: p.sku || "",
        category: p.category || "",
        price: p.price,
        unit: p.unit,
        stock: p.stock,
        imageUrl: p.imageUrl || "",
        isActive: p.isActive,
      }}
    />
  );
}
