import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

const schema = z.object({
  status: z.enum(["CONFIRMED", "DISPATCHED", "DELIVERED", "CANCELLED"]),
  delivery: z
    .object({
      address: z.string().min(1),
      driverName: z.string().optional().nullable(),
      vehicleNo: z.string().optional().nullable(),
      scheduledFor: z.string().optional().nullable(),
    })
    .optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
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
  if (!dist) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const order = await prisma.order.findFirst({
    where: { id: params.id, distributorId: dist.id },
    include: { items: true, delivery: true },
  });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const flow = ["PENDING", "CONFIRMED", "DISPATCHED", "DELIVERED"];
  const currentIdx = flow.indexOf(order.status);
  const nextIdx = flow.indexOf(parsed.data.status);

  if (parsed.data.status !== "CANCELLED") {
    if (nextIdx === -1 || nextIdx <= currentIdx) {
      return NextResponse.json(
        { error: "Invalid status transition" },
        { status: 400 }
      );
    }
  } else {
    if (order.status === "DELIVERED" || order.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Cannot cancel this order" },
        { status: 400 }
      );
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: order.id },
      data: { status: parsed.data.status },
    });

    if (parsed.data.status === "CONFIRMED" && parsed.data.delivery) {
      const d = parsed.data.delivery;
      const scheduledFor = d.scheduledFor ? new Date(d.scheduledFor) : null;
      if (order.delivery) {
        await tx.delivery.update({
          where: { orderId: order.id },
          data: {
            address: d.address,
            driverName: d.driverName || null,
            vehicleNo: d.vehicleNo || null,
            scheduledFor,
            status: "SCHEDULED",
          },
        });
      } else {
        await tx.delivery.create({
          data: {
            orderId: order.id,
            distributorId: dist.id,
            address: d.address,
            driverName: d.driverName || null,
            vehicleNo: d.vehicleNo || null,
            scheduledFor,
            status: "SCHEDULED",
          },
        });
      }
    }

    if (parsed.data.status === "DISPATCHED") {
      await tx.delivery.updateMany({
        where: { orderId: order.id },
        data: { status: "DISPATCHED" },
      });
    }

    if (parsed.data.status === "DELIVERED") {
      await tx.delivery.updateMany({
        where: { orderId: order.id },
        data: { status: "DELIVERED", deliveredAt: new Date() },
      });

      const lastLedger = await tx.ledgerEntry.findFirst({
        where: {
          retailerId: order.retailerId,
          distributorId: dist.id,
        },
        orderBy: { createdAt: "desc" },
      });
      const newBalance = (lastLedger?.balance ?? 0) + order.totalAmount;
      await tx.ledgerEntry.create({
        data: {
          retailerId: order.retailerId,
          distributorId: dist.id,
          orderId: order.id,
          type: "INVOICE",
          amount: order.totalAmount,
          balance: newBalance,
          note: `Invoice for order ${order.code}`,
        },
      });
    }

    if (parsed.data.status === "CANCELLED") {
      for (const it of order.items) {
        await tx.product.update({
          where: { id: it.productId },
          data: { stock: { increment: it.quantity } },
        });
      }
    }
  });

  return NextResponse.json({ ok: true });
}
