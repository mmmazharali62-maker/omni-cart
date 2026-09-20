import { NextRequest, NextResponse } from "next/server";
import { runTrackingUpdateJob } from "@/lib/jobs/tracking-update";

// Cron entry point (vercel.json): polls supplier tracking + notifies customers.
// Protected by a shared secret header so only the scheduler can invoke it.
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await runTrackingUpdateJob();
  return NextResponse.json({ ok: true });
}

export const GET = POST;
