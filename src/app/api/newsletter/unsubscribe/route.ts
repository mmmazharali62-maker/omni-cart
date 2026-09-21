import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiError } from "@/lib/api-error";
import { verifyUnsubscribeToken } from "@/lib/notifications/unsubscribe";

const schema = z.object({
  token: z.string().min(10).max(1000),
  confirm: z.boolean().default(true)
});

// One-click unsubscribe (spec section 15/17): token-based, no login required.
export async function POST(req: NextRequest) {
  try {
    const { token, confirm } = schema.parse(await req.json());
    const secret = process.env.NEXTAUTH_SECRET ?? "dev-unsubscribe-secret";
    const payload = verifyUnsubscribeToken(token, secret);
    if (!payload) return NextResponse.json({ error: "This link has expired - unsubscribe from any email footer." }, { status: 400 });

    if (!confirm) return NextResponse.json({ ok: true, status: "not_confirmed" });

    if (payload.scope === "all") {
      await db.newsletterSubscriber.updateMany({
        where: { email: payload.email },
        data: { isActive: false }
      }).catch(() => null);
    }
    // Marketing-only unsubscribes keep order emails; the subscriber stays active.
    return NextResponse.json({ ok: true, email: payload.email, scope: payload.scope });
  } catch (err) {
    return apiError(err);
  }
}
