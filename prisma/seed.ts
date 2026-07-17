import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function code() {
  return `ORD-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

async function main() {
  console.log("Cleaning existing data...");
  await prisma.ledgerEntry.deleteMany();
  await prisma.delivery.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.retailer.deleteMany();
  await prisma.distributor.deleteMany();
  await prisma.user.deleteMany();

  const adminHash = await bcrypt.hash("admin123", 10);
  const distHash = await bcrypt.hash("dist123", 10);
  const retHash = await bcrypt.hash("retail123", 10);

  console.log("Creating admin...");
  await prisma.user.create({
    data: {
      email: "admin@bizztob.com",
      passwordHash: adminHash,
      name: "Admin User",
      role: "ADMIN",
    },
  });

  console.log("Creating distributors...");
  const dist1 = await prisma.user.create({
    data: {
      email: "distributor@bizztob.com",
      passwordHash: distHash,
      name: "Ali Traders",
      role: "DISTRIBUTOR",
      phone: "+92 300 1234567",
      distributor: {
        create: {
          businessName: "Ali Traders (Pvt) Ltd",
          city: "Karachi",
          address: "Plot 22, SITE Area",
        },
      },
    },
    include: { distributor: true },
  });

  const dist2 = await prisma.user.create({
    data: {
      email: "distributor2@bizztob.com",
      passwordHash: distHash,
      name: "Fresh Foods Distribution",
      role: "DISTRIBUTOR",
      phone: "+92 321 7654321",
      distributor: {
        create: {
          businessName: "Fresh Foods Distribution",
          city: "Lahore",
          address: "Industrial Estate, Kot Lakhpat",
        },
      },
    },
    include: { distributor: true },
  });

  console.log("Creating retailers...");
  const retailerUser = await prisma.user.create({
    data: {
      email: "retailer@bizztob.com",
      passwordHash: retHash,
      name: "Bilal Ahmed",
      role: "RETAILER",
      phone: "+92 333 1112223",
      retailer: {
        create: {
          shopName: "Al-Karam General Store",
          city: "Karachi",
          address: "Shop 5, Gulshan-e-Iqbal Block 7",
        },
      },
    },
    include: { retailer: true },
  });

  const retailer2 = await prisma.user.create({
    data: {
      email: "retailer2@bizztob.com",
      passwordHash: retHash,
      name: "Sana Khan",
      role: "RETAILER",
      phone: "+92 345 4445556",
      retailer: {
        create: {
          shopName: "City Mart",
          city: "Lahore",
          address: "Main Boulevard, Model Town",
        },
      },
    },
    include: { retailer: true },
  });

  console.log("Creating products...");
  const productsDist1 = [
    {
      name: "Pepsi 250ml",
      category: "Beverages",
      price: 300,
      unit: "crate",
      stock: 200,
      sku: "PEP-250",
      imageUrl:
        "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=60",
    },
    {
      name: "Coca Cola 500ml",
      category: "Beverages",
      price: 500,
      unit: "crate",
      stock: 150,
      sku: "COK-500",
      imageUrl:
        "https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=400&q=60",
    },
    {
      name: "Lays Salted 40g",
      category: "Snacks",
      price: 40,
      unit: "pack",
      stock: 500,
      sku: "LAY-SLT",
      imageUrl:
        "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=400&q=60",
    },
    {
      name: "Kurkure Masala",
      category: "Snacks",
      price: 30,
      unit: "pack",
      stock: 600,
      sku: "KUR-MSL",
      imageUrl:
        "https://images.unsplash.com/photo-1621784563330-caee0b138a00?auto=format&fit=crop&w=400&q=60",
    },
    {
      name: "Nestlé Milk 1L",
      category: "Dairy",
      price: 220,
      unit: "pcs",
      stock: 300,
      sku: "NST-MLK-1L",
      imageUrl:
        "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=60",
    },
    {
      name: "Olpers Cream 200ml",
      category: "Dairy",
      price: 180,
      unit: "pcs",
      stock: 120,
      sku: "OLP-CRM",
    },
  ];

  const productsDist2 = [
    {
      name: "Basmati Rice 5kg",
      category: "Grocery",
      price: 2500,
      unit: "bag",
      stock: 80,
      sku: "RCE-BSM-5",
      imageUrl:
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=60",
    },
    {
      name: "Sugar 10kg",
      category: "Grocery",
      price: 1400,
      unit: "bag",
      stock: 50,
      sku: "SUG-10",
    },
    {
      name: "Cooking Oil 5L",
      category: "Grocery",
      price: 3200,
      unit: "bottle",
      stock: 40,
      sku: "OIL-5L",
      imageUrl:
        "https://images.unsplash.com/photo-1608797178974-15b35a64ede9?auto=format&fit=crop&w=400&q=60",
    },
    {
      name: "Tapal Danedar Tea 950g",
      category: "Grocery",
      price: 1500,
      unit: "pack",
      stock: 100,
      sku: "TAP-950",
    },
  ];

  await prisma.product.createMany({
    data: productsDist1.map((p) => ({
      ...p,
      distributorId: dist1.distributor!.id,
    })),
  });
  await prisma.product.createMany({
    data: productsDist2.map((p) => ({
      ...p,
      distributorId: dist2.distributor!.id,
    })),
  });

  const dist1Products = await prisma.product.findMany({
    where: { distributorId: dist1.distributor!.id },
  });
  const dist2Products = await prisma.product.findMany({
    where: { distributorId: dist2.distributor!.id },
  });

  console.log("Creating orders...");

  async function makeOrder(
    retailerId: string,
    distributorId: string,
    products: { id: string; name: string; price: number }[],
    picks: { productId: string; qty: number }[],
    daysAgo: number,
    status: "PENDING" | "CONFIRMED" | "DISPATCHED" | "DELIVERED"
  ) {
    const items = picks.map((p) => {
      const prod = products.find((x) => x.id === p.productId)!;
      return {
        productId: prod.id,
        name: prod.name,
        quantity: p.qty,
        unitPrice: prod.price,
        subtotal: prod.price * p.qty,
      };
    });
    const total = items.reduce((s, i) => s + i.subtotal, 0);
    const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    const order = await prisma.order.create({
      data: {
        code: code(),
        retailerId,
        distributorId,
        status,
        totalAmount: total,
        createdAt,
        updatedAt: createdAt,
        items: { create: items },
      },
    });

    if (status !== "PENDING") {
      await prisma.delivery.create({
        data: {
          orderId: order.id,
          distributorId,
          address: "Shop 5, Gulshan-e-Iqbal Block 7, Karachi",
          driverName: "Aslam Khan",
          vehicleNo: "SND-3421",
          scheduledFor: new Date(
            createdAt.getTime() + 2 * 24 * 60 * 60 * 1000
          ),
          status:
            status === "DELIVERED"
              ? "DELIVERED"
              : status === "DISPATCHED"
                ? "DISPATCHED"
                : "SCHEDULED",
          deliveredAt:
            status === "DELIVERED"
              ? new Date(createdAt.getTime() + 3 * 24 * 60 * 60 * 1000)
              : null,
        },
      });
    }

    return { order, total };
  }

  const o1 = await makeOrder(
    retailerUser.retailer!.id,
    dist1.distributor!.id,
    dist1Products,
    [
      { productId: dist1Products[0].id, qty: 20 },
      { productId: dist1Products[2].id, qty: 30 },
      { productId: dist1Products[4].id, qty: 10 },
    ],
    15,
    "DELIVERED"
  );
  const o2 = await makeOrder(
    retailerUser.retailer!.id,
    dist1.distributor!.id,
    dist1Products,
    [
      { productId: dist1Products[1].id, qty: 15 },
      { productId: dist1Products[3].id, qty: 24 },
    ],
    8,
    "DELIVERED"
  );
  await makeOrder(
    retailerUser.retailer!.id,
    dist1.distributor!.id,
    dist1Products,
    [
      { productId: dist1Products[0].id, qty: 15 },
      { productId: dist1Products[5].id, qty: 6 },
    ],
    2,
    "DISPATCHED"
  );
  await makeOrder(
    retailerUser.retailer!.id,
    dist2.distributor!.id,
    dist2Products,
    [
      { productId: dist2Products[0].id, qty: 4 },
      { productId: dist2Products[2].id, qty: 2 },
    ],
    1,
    "PENDING"
  );
  await makeOrder(
    retailer2.retailer!.id,
    dist2.distributor!.id,
    dist2Products,
    [
      { productId: dist2Products[1].id, qty: 5 },
      { productId: dist2Products[3].id, qty: 4 },
    ],
    3,
    "CONFIRMED"
  );

  console.log("Seeding ledger entries for delivered orders...");
  const delivered = await prisma.order.findMany({
    where: { status: "DELIVERED" },
    orderBy: { createdAt: "asc" },
  });
  for (const ord of delivered) {
    const last = await prisma.ledgerEntry.findFirst({
      where: {
        retailerId: ord.retailerId,
        distributorId: ord.distributorId,
      },
      orderBy: { createdAt: "desc" },
    });
    const newBal = (last?.balance ?? 0) + ord.totalAmount;
    await prisma.ledgerEntry.create({
      data: {
        retailerId: ord.retailerId,
        distributorId: ord.distributorId,
        orderId: ord.id,
        type: "INVOICE",
        amount: ord.totalAmount,
        balance: newBal,
        note: `Invoice for order ${ord.code}`,
        createdAt: new Date(ord.createdAt.getTime() + 3 * 24 * 60 * 60 * 1000),
      },
    });
  }

  console.log("Recording a partial payment...");
  const lastLedger = await prisma.ledgerEntry.findFirst({
    where: { retailerId: retailerUser.retailer!.id },
    orderBy: { createdAt: "desc" },
  });
  if (lastLedger && lastLedger.balance > 0) {
    const pay = Math.min(o1.total, lastLedger.balance);
    await prisma.ledgerEntry.create({
      data: {
        retailerId: lastLedger.retailerId,
        distributorId: lastLedger.distributorId,
        type: "PAYMENT",
        amount: pay,
        balance: lastLedger.balance - pay,
        note: "Cash payment received",
      },
    });
  }

  console.log("\nSeed complete! Demo accounts:");
  console.log("  Admin:       admin@bizztob.com / admin123");
  console.log("  Distributor: distributor@bizztob.com / dist123");
  console.log("  Distributor: distributor2@bizztob.com / dist123");
  console.log("  Retailer:    retailer@bizztob.com / retail123");
  console.log("  Retailer:    retailer2@bizztob.com / retail123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
