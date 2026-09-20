import { NextResponse } from "next/server";
import { runSupplierSyncJob } from "@/lib/jobs/supplier-sync";

// Manual/cron-triggered sync for AliExpress-linked products (spec section 9).
export async function POST() {
  await runSupplierSyncJob();
  return NextResponse.json({ ok: true });
}
