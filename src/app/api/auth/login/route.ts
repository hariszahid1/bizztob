import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { setSessionCookie, signSession } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid credentials." },
      { status: 400 }
    );
  }
  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const token = await signSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as "ADMIN" | "DISTRIBUTOR" | "RETAILER",
  });
  await setSessionCookie(token);

  return NextResponse.json({ ok: true, role: user.role });
}
