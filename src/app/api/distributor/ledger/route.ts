import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

const schema = z.object({
  retailerId: z.string().min(1),
  amount: z.number().positive(),
  note: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "DISTRIBUTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  const dist = await prisma.distributor.findUnique({
    where: { userId: session.id },
  });
  if (!dist)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const last = await prisma.ledgerEntry.findFirst({
    where: { retailerId: parsed.data.retailerId, distributorId: dist.id },
    orderBy: { createdAt: "desc" },
  });
  const newBalance = (last?.balance ?? 0) - parsed.data.amount;

  await prisma.ledgerEntry.create({
    data: {
      retailerId: parsed.data.retailerId,
      distributorId: dist.id,
      type: "PAYMENT",
      amount: parsed.data.amount,
      balance: newBalance,
      note: parsed.data.note || "Payment received",
    },
  });
  return NextResponse.json({ ok: true });
}
