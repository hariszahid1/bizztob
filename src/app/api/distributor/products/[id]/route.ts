import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

const schema = z.object({
  name: z.string().min(1),
  sku: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  price: z.number().nonnegative(),
  unit: z.string().min(1),
  stock: z.number().int().nonnegative(),
  imageUrl: z.string().url().optional().nullable().or(z.literal("")),
  isActive: z.boolean(),
});

async function authorize(id: string) {
  const session = await getSession();
  if (!session || session.role !== "DISTRIBUTOR") return null;
  const dist = await prisma.distributor.findUnique({
    where: { userId: session.id },
  });
  if (!dist) return null;
  const product = await prisma.product.findFirst({
    where: { id, distributorId: dist.id },
  });
  if (!product) return null;
  return { dist, product };
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const ctx = await authorize(params.id);
  if (!ctx)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  await prisma.product.update({
    where: { id: params.id },
    data: {
      name: parsed.data.name,
      sku: parsed.data.sku || null,
      category: parsed.data.category || null,
      price: parsed.data.price,
      unit: parsed.data.unit,
      stock: parsed.data.stock,
      imageUrl: parsed.data.imageUrl || null,
      isActive: parsed.data.isActive,
    },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const ctx = await authorize(params.id);
  if (!ctx)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
