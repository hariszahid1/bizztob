import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { makeOrderCode } from "@/lib/utils";

const schema = z.object({
  distributorId: z.string().min(1),
  notes: z.string().optional().nullable(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "RETAILER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid order data" },
      { status: 400 }
    );
  }

  const retailer = await prisma.retailer.findUnique({
    where: { userId: session.id },
  });
  if (!retailer) {
    return NextResponse.json({ error: "Retailer not found" }, { status: 400 });
  }

  const productIds = parsed.data.items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
  });
  if (products.length !== productIds.length) {
    return NextResponse.json(
      { error: "One or more products are unavailable" },
      { status: 400 }
    );
  }
  if (products.some((p) => p.distributorId !== parsed.data.distributorId)) {
    return NextResponse.json(
      { error: "All items must be from the same distributor" },
      { status: 400 }
    );
  }

  const items = parsed.data.items.map((i) => {
    const p = products.find((x) => x.id === i.productId)!;
    if (i.quantity > p.stock) {
      throw new Error(`Not enough stock for ${p.name}`);
    }
    return {
      productId: p.id,
      name: p.name,
      quantity: i.quantity,
      unitPrice: p.price,
      subtotal: i.quantity * p.price,
    };
  });

  const totalAmount = items.reduce((s, i) => s + i.subtotal, 0);

  try {
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          code: makeOrderCode(),
          retailerId: retailer.id,
          distributorId: parsed.data.distributorId,
          status: "PENDING",
          notes: parsed.data.notes || null,
          totalAmount,
          items: { create: items },
        },
      });

      for (const it of items) {
        await tx.product.update({
          where: { id: it.productId },
          data: { stock: { decrement: it.quantity } },
        });
      }

      return created;
    });

    return NextResponse.json({ ok: true, orderId: order.id, code: order.code });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Could not create order";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
