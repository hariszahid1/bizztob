import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "RETAILER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const q = String(body?.query || "").toLowerCase();

  const retailer = await prisma.retailer.findUnique({
    where: { userId: session.id },
  });
  if (!retailer) {
    return NextResponse.json({ answer: "Account not fully set up." });
  }

  if (
    q.includes("balance") ||
    q.includes("ledger") ||
    q.includes("owe")
  ) {
    const last = await prisma.ledgerEntry.findFirst({
      where: { retailerId: retailer.id },
      orderBy: { createdAt: "desc" },
    });
    const bal = last?.balance ?? 0;
    return NextResponse.json({
      answer:
        bal > 0
          ? `Your outstanding balance is ${formatCurrency(bal)}.`
          : `Your ledger is clear — you have no outstanding balance.`,
    });
  }

  if (q.includes("pending")) {
    const count = await prisma.order.count({
      where: { retailerId: retailer.id, status: "PENDING" },
    });
    return NextResponse.json({
      answer:
        count === 0
          ? "You have no pending orders right now."
          : `You have ${count} pending order${count > 1 ? "s" : ""}.`,
    });
  }

  if (q.includes("last week") || q.includes("recent") || q.includes("last")) {
    const since = new Date();
    since.setDate(since.getDate() - 7);
    const orders = await prisma.order.findMany({
      where: { retailerId: retailer.id, createdAt: { gte: since } },
      include: { items: true, distributor: true },
      orderBy: { createdAt: "desc" },
    });
    if (orders.length === 0) {
      return NextResponse.json({
        answer: "You haven't placed any orders in the last 7 days.",
      });
    }
    const lines = orders
      .slice(0, 5)
      .map(
        (o) =>
          `• ${o.code} · ${o.distributor.businessName} · ${o.items.length} items · ${formatCurrency(o.totalAmount)} · ${formatDate(o.createdAt)}`
      )
      .join("\n");
    return NextResponse.json({
      answer: `Here are your recent orders:\n${lines}`,
    });
  }

  if (q.includes("reorder") || q.includes("suggest")) {
    const group = await prisma.orderItem.groupBy({
      by: ["productId", "name"],
      where: { order: { retailerId: retailer.id } },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 3,
    });
    if (group.length === 0) {
      return NextResponse.json({
        answer:
          "I don't have enough order history yet to suggest a reorder. Try the catalog!",
      });
    }
    const lines = group
      .map(
        (g) =>
          `• ${g.name} — you've ordered ${g._sum.quantity} in total. Consider reordering.`
      )
      .join("\n");
    return NextResponse.json({
      answer: `Smart reorder suggestions:\n${lines}`,
    });
  }

  return NextResponse.json({
    answer:
      "I can help with ledger balance, pending orders, recent orders, and reorder suggestions. Try one of the suggested prompts!",
  });
}
