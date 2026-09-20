import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Health check for uptime monitors and deploy verification.
export async function GET() {
  let dbOk = true;
  try {
    await db.$queryRaw`SELECT 1`;
  } catch {
    dbOk = false;
  }
  return NextResponse.json(
    { status: dbOk ? "ok" : "degraded", db: dbOk ? "connected" : "unavailable", time: new Date().toISOString() },
    { status: dbOk ? 200 : 503 }
  );
}
