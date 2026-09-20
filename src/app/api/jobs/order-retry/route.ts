import { NextRequest, NextResponse } from "next/server";
import { runOrderRetryJob } from "@/lib/jobs/order-retry";

// Cron entry point (vercel.json): retries failed payments/fulfillments with backoff.
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await runOrderRetryJob();
  return NextResponse.json({ ok: true });
}

export const GET = POST;
