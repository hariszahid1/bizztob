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

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "DISTRIBUTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid data" },
      { status: 400 }
    );
  }
  const dist = await prisma.distributor.findUnique({
    where: { userId: session.id },
  });
  if (!dist) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const p = await prisma.product.create({
    data: {
      distributorId: dist.id,
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
  return NextResponse.json({ ok: true, id: p.id });
}
