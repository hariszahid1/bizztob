import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./db";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-me"
);

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "DISTRIBUTOR" | "RETAILER";
};

const COOKIE_NAME = "bizztob_session";

export async function signSession(user: SessionUser) {
  const token = await new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
  return token;
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as SessionUser["role"],
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  cookies().delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionUser | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireSession(): Promise<SessionUser> {
  const s = await getSession();
  if (!s) throw new Error("UNAUTHENTICATED");
  return s;
}

export async function getFullUser() {
  const s = await getSession();
  if (!s) return null;
  return prisma.user.findUnique({
    where: { id: s.id },
    include: { distributor: true, retailer: true },
  });
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
