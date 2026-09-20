import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiError } from "@/lib/api-error";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { z } from "zod";

const subscribeSchema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  try {
    const rl = rateLimit(clientKey(req, "newsletter"), 5, 60_000);
    if (!rl.allowed) return NextResponse.json({ error: "Too many attempts" }, { status: 429 });

    const { email } = subscribeSchema.parse(await req.json());
    const existing = await db.newsletterSubscriber.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) return NextResponse.json({ ok: true, message: "You're already subscribed!" });

    await db.newsletterSubscriber.create({ data: { email: email.toLowerCase() } });
    // TODO: sync to email marketing platform (Mailchimp/Klaviyo) when key is set.
    return NextResponse.json({ ok: true, message: "Subscribed - welcome aboard!" });
  } catch (err) {
    return apiError(err);
  }
}
