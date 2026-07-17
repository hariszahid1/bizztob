import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-me"
);
const COOKIE_NAME = "bizztob_session";

async function readSession(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as {
      id: string;
      email: string;
      name: string;
      role: "ADMIN" | "DISTRIBUTOR" | "RETAILER";
    };
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected =
    pathname.startsWith("/retailer") ||
    pathname.startsWith("/distributor") ||
    pathname.startsWith("/admin");
  if (!isProtected) return NextResponse.next();

  const session = await readSession(req);
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/retailer") && session.role !== "RETAILER") {
    return NextResponse.redirect(new URL(dashFor(session.role), req.url));
  }
  if (pathname.startsWith("/distributor") && session.role !== "DISTRIBUTOR") {
    return NextResponse.redirect(new URL(dashFor(session.role), req.url));
  }
  if (pathname.startsWith("/admin") && session.role !== "ADMIN") {
    return NextResponse.redirect(new URL(dashFor(session.role), req.url));
  }

  return NextResponse.next();
}

function dashFor(role: string) {
  if (role === "ADMIN") return "/admin";
  if (role === "DISTRIBUTOR") return "/distributor";
  return "/retailer";
}

export const config = {
  matcher: ["/retailer/:path*", "/distributor/:path*", "/admin/:path*"],
};
