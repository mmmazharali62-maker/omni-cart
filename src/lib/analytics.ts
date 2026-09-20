// Analytics queries powering the Admin Dashboard + Analytics page (spec section 14/22).
import { db } from "@/lib/db";

const PAID_STATUSES = ["PAID", "PROCESSING", "FULFILLED", "SHIPPED", "IN_TRANSIT", "DELIVERED"] as const;

export async function getDashboardStats() {
  const now = new Date();
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [revenueAgg, dailyOrders, weeklyOrders, monthlyOrders, customerCount, productCount, refundCount, failedCount, lowStock] =
    await Promise.all([
      db.order.aggregate({ _sum: { grandTotal: true }, where: { status: { in: [...PAID_STATUSES] } } }),
      db.order.count({ where: { createdAt: { gte: dayAgo } } }),
      db.order.count({ where: { createdAt: { gte: weekAgo } } }),
      db.order.count({ where: { createdAt: { gte: monthAgo } } }),
      db.user.count({ where: { role: "CUSTOMER" } }),
      db.product.count({ where: { status: "active" } }),
      db.order.count({ where: { status: { in: ["REFUNDED", "PARTIALLY_REFUNDED"] } } }),
      db.order.count({ where: { status: "FAILED" } }),
      db.productVariant.count({ where: { stock: { lte: 5 } } })
    ]);

  const orderCount = weeklyOrders; // average-order-value basis
  const revenue = revenueAgg._sum.grandTotal?.toNumber() ?? 0;

  return {
    revenue,
    orders: { last24h: dailyOrders, last7d: weeklyOrders, last30d: monthlyOrders },
    averageOrderValue: orderCount > 0 ? revenue / orderCount : 0,
    customers: customerCount,
    activeProducts: productCount,
    refunds: refundCount,
    failedOrders: failedCount,
    lowStockVariants: lowStock
  };
}

export async function getDailySalesSeries(days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const orders = await db.order.findMany({
    where: { createdAt: { gte: since }, status: { in: [...PAID_STATUSES] } },
    select: { createdAt: true, grandTotal: true }
  });

  const byDay = new Map<string, { revenue: number; orders: number }>();
  for (const o of orders) {
    const key = o.createdAt.toISOString().slice(0, 10);
    const agg = byDay.get(key) ?? { revenue: 0, orders: 0 };
    agg.revenue += o.grandTotal.toNumber();
    agg.orders += 1;
    byDay.set(key, agg);
  }
  return [...byDay.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([date, v]) => ({ date, ...v }));
}

export async function getTopProducts(limit = 10) {
  const items = await db.orderItem.groupBy({
    by: ["productId", "title"],
    _sum: { quantity: true },
    _count: { _all: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: limit
  });
  return items.map((i) => ({
    productId: i.productId,
    title: i.title,
    unitsSold: i._sum.quantity ?? 0,
    orders: i._count._all
  }));
}
