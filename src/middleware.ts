import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Guards /admin/* routes (spec section 17/18: admin protection, role-based
// permissions). Real role check needs a NextAuth JWT read here once auth is wired end-to-end.
export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/admin")) {
    // TODO: read the NextAuth session token and require role in
    // ["ADMIN", "STORE_MANAGER", "SUPPORT", "OPERATIONS", "FULFILLMENT_MANAGER"].
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
