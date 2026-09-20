import { db } from "@/lib/db";
import { DigestPreview } from "@/components/admin/ops/digest-preview";

export const metadata = { title: "Daily Digest | Omni Cart" };

// Yesterday-at-a-glance (spec section 14/26).
export default async function AdminDigestPage() {
  const since = new Date(Date.now() - 24 * 3_600_000);
  const [orders, newCustomers, pendingReturns, lowStock, failedSyncs, top] = await Promise.all([
    db.order.findMany({ where: { createdAt: { gte: since }, status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] } }, select: { grandTotal: true } }).catch(() => []),
    db.user.count({ where: { createdAt: { gte: since } } }).catch(() => 0),
    db.returnRequest.count({ where: { status: "requested" } }).catch(() => 0),
    db.inventory.count({ where: { quantity: { lte: 10 } } }).catch(() => 0),
    db.webhookEvent.count({ where: { createdAt: { gte: since }, processedAt: null } }).catch(() => 0),
    db.orderItem.groupBy({ by: ["title"], _count: { _all: true }, orderBy: { _count: { title: "desc" } }, take: 1 }).catch(() => [])
  ]);

  return (
    <section className="mx-4 mt-12 max-w-2xl">
      <h1 className="text-3xl font-semibold">Daily digest</h1>
      <p className="text-white/50 text-sm mt-1 mb-6">Rolling 24-hour summary - also emailed each morning.</p>
      <DigestPreview input={{
        date: since.toISOString().slice(0, 10),
        ordersCount: orders.length,
        revenueCents: Math.round(orders.reduce((s, o) => s + Number(o.grandTotal) * 100, 0)),
        newCustomers, pendingReturns,
        lowStockCount: lowStock, failedSyncs,
        topProduct: top[0]?.title
      }} />
    </section>
  );
}
