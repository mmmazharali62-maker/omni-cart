import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Guards /admin/* (spec section 17/18). Reads the NextAuth JWT and enforces
// role-based permissions; unauthenticated users get a redirect, wrong roles a 403.
const ADMIN_ROLES = ["ADMIN", "STORE_MANAGER", "SUPPORT", "OPERATIONS", "FULFILLMENT_MANAGER"];

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/admin")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const login = new URL("/account", req.url);
      login.searchParams.set("next", req.nextUrl.pathname);
      return NextResponse.redirect(login);
    }
    if (!ADMIN_ROLES.includes(token.role as string)) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
