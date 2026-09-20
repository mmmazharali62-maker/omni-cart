import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/guard";
import { digestSeverity, renderDigest } from "@/lib/notifications/digest";

// Daily digest data (spec section 14): rolling 24h window.
export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });

  const since = new Date(Date.now() - 24 * 3_600_000);
  const [orders, newCustomers, pendingReturns, lowStock, failedSyncs, topProduct] = await Promise.all([
    db.order.findMany({ where: { createdAt: { gte: since }, status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] } }, select: { grandTotal: true } }).catch(() => []),
    db.user.count({ where: { createdAt: { gte: since } } }).catch(() => 0),
    db.returnRequest.count({ where: { status: "requested" } }).catch(() => 0),
    db.inventory.count({ where: { quantity: { lte: 10 } } }).catch(() => 0),
    db.webhookEvent.count({ where: { createdAt: { gte: since }, processedAt: null } }).catch(() => 0),
    db.orderItem.groupBy({ by: ["title"], _count: { _all: true }, orderBy: { _count: { title: "desc" } }, take: 1 }).catch(() => [])
  ]);

  const revenueCents = orders.reduce((s, o) => s + Number(o.grandTotal) * 100, 0);
  const input = {
    date: since.toISOString().slice(0, 10),
    ordersCount: orders.length,
    revenueCents: Math.round(revenueCents),
    newCustomers,
    pendingReturns,
    lowStockCount: lowStock,
    failedSyncs,
    topProduct: topProduct[0]?.title
  };

  return NextResponse.json({ input, rendered: renderDigest(input), severity: digestSeverity(input) });
}
