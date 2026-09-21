export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Powers the Admin Dashboard charts (spec section 14/22).
export async function GET() {
  const [orderCount, revenueAgg] = await Promise.all([
    db.order.count({ where: { status: { in: ["PAID", "PROCESSING", "FULFILLED", "SHIPPED", "IN_TRANSIT", "DELIVERED"] } } }),
    db.order.aggregate({ _sum: { grandTotal: true }, where: { status: { not: "PENDING" } } })
  ]);
  return NextResponse.json({
    orderCount,
    revenue: revenueAgg._sum.grandTotal ?? 0
    // TODO: add profit/margin, refund rate, supplier performance, category performance.
  });
}
